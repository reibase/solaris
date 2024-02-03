import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import GitLabStrategy from "passport-gitlab2";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Octokit } from "octokit";

import path from "path";
import "dotenv/config";

import db from "../db/index.js";
import { User } from "../db/models/index.js";

// Constants
const port = process.env.PORT || 3001;
const __dirname = path.resolve();

const {
	GITHUB_OAUTH_APP_CLIENT_ID,
	GITHUB_OAUTH_APP_CALLBACK_URL,
	GITHUB_OAUTH_APP_CLIENT_SECRET,
	GOOGLE_OAUTH_APP_CLIENT_ID,
	GOOGLE_OAUTH_APP_CALLBACK_URL,
	GOOGLE_OAUTH_APP_CLIENT_SECRET,
	GITLAB_OAUTH_APP_CLIENT_ID,
	GITLAB_OAUTH_APP_CALLBACK_URL,
	GITLAB_OAUTH_APP_CLIENT_SECRET,
} = process.env;

// Create http server
const app = express();

// body parsing middleware
app.use(express.json());
app.use("/", express.static(__dirname + "/dist"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(
	new GitHubStrategy(
		{
			clientID: GITHUB_OAUTH_APP_CLIENT_ID,
			clientSecret: GITHUB_OAUTH_APP_CLIENT_SECRET,
			callbackURL: GITHUB_OAUTH_APP_CALLBACK_URL,
		},
		function (accessToken, refreshToken, profile, done) {
			process.nextTick(async function () {
				const octokit = new Octokit({ auth: accessToken });
				const { data } = await octokit.request(`GET /user/emails`);
				let email = "";
				for (let i = 0; i < data.length; i++) {
					if (data[i].primary) {
						email = data[i].email;
						break;
					}
				}

				const [user, created] = await User.findOrCreate({
					where: { email: email },
					defaults: {
						email: email,
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

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_OAUTH_APP_CLIENT_ID,
			clientSecret: GOOGLE_OAUTH_APP_CLIENT_SECRET,
			callbackURL: GOOGLE_OAUTH_APP_CALLBACK_URL,
			scope: ["https://www.googleapis.com/auth/userinfo.email"],
			state: true,
		},
		async function (accessToken, refreshToken, profile, cb) {
			const email = profile.emails[0].value;
			const username = email.split("@")[0];
			const [user, created] = await User.findOrCreate({
				where: { email: email },
				defaults: {
					username: username,
					email: profile.emails[0].value,
					googleID: profile.id,
					avatar: profile.photos[0].value,
					verifiedThru: "google",
				},
			});
			return cb(null, user);
		}
	)
);

passport.use(
	new GitLabStrategy(
		{
			clientID: GITLAB_OAUTH_APP_CLIENT_ID,
			clientSecret: GITLAB_OAUTH_APP_CLIENT_SECRET,
			callbackURL: GITLAB_OAUTH_APP_CALLBACK_URL,
		},
		function (accessToken, refreshToken, profile, done) {
			process.nextTick(async function () {
				const email = profile.emails[0].value;
				const [user, created] = await User.findOrCreate({
					where: { email: email },
					defaults: {
						username: profile.username,
						email: profile.emails[0].value,
						gitLabID: profile.id,
						avatar: profile.avatarUrl,
						verifiedThru: "gitlab",
					},
				});

				return done(null, user);
			});
		}
	)
);

app.get("/api/test", function (req, res) {
	return res.send(200);
});

app.get(
	"/api/auth/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/api/auth/google", passport.authenticate("google"));

app.get("/api/auth/gitlab", passport.authenticate("gitlab"));

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.

// Route for when user clicks Login with Github:
app.get(
	"/api/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/");
	}
);

app.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	function (req, res) {
		res.redirect("/");
	}
);

app.get(
	"/api/auth/gitlab/callback",
	passport.authenticate("gitlab", {
		failureRedirect: "/login",
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

app.get("/api/auth/logout", function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.get("/api/auth/me", function (req, res) {
	if (!req.user) {
		return res.sendStatus(404);
	}
	return res.send(req.user);
});

// Route for when user clicks submit access code:
app.post("/api/auth/access-code", function (req, res) {
	const accessCodes = [
		process.env.ACCESS_CODE_1,
		process.env.ACCESS_CODE_2,
		process.env.ACCESS_CODE_3,
		process.env.ACCESS_CODE_4,
		process.env.ACCESS_CODE_5,
	];
	if (accessCodes.includes(req.body.code)) {
		return res.send({ status: 200 });
	} else {
		return res.send({ status: 401 });
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

app.use("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/dist/index.html"));
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

//syncDB();
//authenticateDB();

// Start http server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
