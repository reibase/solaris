import fs from "node:fs/promises";
import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import "dotenv/config";

import db from "./src/db/index.js";
import { User } from "./src/db/models/index.js";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

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
		: "http://localhost:5173/auth/github/callback";

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
			process.nextTick(async function () {
				const [user, created] = await User.findOrCreate({
					where: { gitHubID: profile._json.id },
					defaults: {
						username: profile._json.login,
						gitHubID: profile._json.id,
						avatar: profile._json.avatar_url,
						verifiedThru: "github",
					},
				});

				return done(null, user);
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
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.get("/account", function (req, res) {
	console.log(req.user);
	res.send(req.user);
});

app.post("/access-code", function (req, res) {
	const accessCodes = [
		process.env.ACCESS_CODE_1,
		process.env.ACCESS_CODE_2,
		process.env.ACCESS_CODE_3,
		process.env.ACCESS_CODE_4,
		process.env.ACCESS_CODE_5,
	];
	if (accessCodes.includes(req.body.code)) {
		res.status(200);
	} else {
		res.status(401);
	}
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

// Connect to database
const syncDB = async () => {
	await db.sync({ force: true });
	console.log("All models were synchronized successfully.");
};

const authenticateDB = async () => {
	try {
		await db.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

syncDB();
authenticateDB();

// Start http server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
