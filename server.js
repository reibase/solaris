import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import fs from "fs";
import "dotenv/config";
import { App, Octokit } from "octokit";
import jwt from "jsonwebtoken";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// GitHub App:
const appId = Number(process.env.GITHUB_APP_ID);
const privateKeyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const secret = process.env.GITHUB_WEBHOOK_SECRET;

// Create an authenticated Octokit client authenticated as a GitHub App
const gitHubApp = new App({
	appId,
	privateKey,
	webhooks: {
		secret,
	},
});

const payload = {
	// issued at time, 60 seconds in the past to allow for clock drift
	iat: Math.floor(Date.now() / 1000) - 60,
	// JWT expiration time (10 minute maximum)
	exp: Math.floor(Date.now() / 1000) + 10 * 60,
	iss: appId,
};

const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

const { data } = await gitHubApp.octokit.request(
	"/repos/reibase/demo-repository/installation",
	{
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
			Authorization: `Bearer ${jwtToken}`,
		},
	}
);
const installationId = data.id;

const octokit = await gitHubApp.getInstallationOctokit(installationId);

const gitHubRes = async () => {
	const res = await octokit.request("GET /repos/jex441/demo/pulls", {
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
			Authorization: `Bearer ${jwtToken}`,
		},
	});
	console.log(res);
};

gitHubRes();

// GitHub Oauth App:
const GITHUB_CLIENT_ID =
	process.env.NODE_ENV === "production"
		? process.env.GITHUB_CLIENT_ID
		: process.env.GITHUB_CLIENT_ID_LOCAL;
const GITHUB_CLIENT_SECRET =
	process.env.NODE_ENV === "production"
		? process.env.GITHUB_CLIENT_SECRET
		: process.env.GITHUB_CLIENT_SECRET_LOCAL;

const callbackURL =
	process.env.NODE_ENV === "production"
		? "https://turbosrc-reibase-auth.fly.dev/authenticated/"
		: "http://localhost:5173/home";

// Cached production assets
const templateHtml = isProduction
	? await fs.readFile("./dist/client/index.html", "utf-8")
	: "";
const ssrManifest = isProduction
	? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
	: undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
	const { createServer } = await import("vite");
	vite = await createServer({
		server: { middlewareMode: true },
		appType: "custom",
		base,
	});
	app.use(vite.middlewares);
} else {
	const compression = (await import("compression")).default;
	const sirv = (await import("sirv")).default;
	app.use(compression());
	app.use(base, sirv("./dist/client", { extensions: [] }));
}

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(
	new GitHubStrategy(
		{
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			callbackURL: callbackURL,
		},
		function (accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
				// To keep the example simple, the user's GitHub profile is returned to
				// represent the logged-in user.  In a typical application, you would want
				// to associate the GitHub account with a user record in your database,
				// and return that user instead.
				return done(null, profile);
			});
		}
	)
);

app.use(
	session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get(
	"/auth/github",
	passport.authenticate("github", { scope: ["user:email"] }),
	function (req, res) {
		console.log("req", req);
		// The request will be redirected to GitHub for authentication, so this
		// function will not be called.
	}
);

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/");
	}
);

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.post("/api/webhooks/github", function (req, res) {
	console.log(req.body);
});

// Serve HTML
app.use("*", async (req, res, next) => {
	try {
		const url = req.originalUrl.replace(base, "");

		let template;
		let render;
		if (!isProduction) {
			// Always read fresh template in development
			template = await fs.readFile("./index.html", "utf-8");
			template = await vite.transformIndexHtml(url, template);
			render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
		} else {
			template = templateHtml;
			render = (await import("./dist/server/entry-server.js")).render;
		}

		const rendered = await render(url, ssrManifest);

		const html = template
			.replace(`<!--app-head-->`, rendered.head ?? "")
			.replace(`<!--app-html-->`, rendered.html ?? "");

		res.status(200).set({ "Content-Type": "text/html" }).end(html);
	} catch (e) {
		vite?.ssrFixStacktrace(e);
		console.log(e.stack);
		res.status(500).end(e.stack);
	}
});

// Start http server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
