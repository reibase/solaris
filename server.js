import fs from "node:fs/promises";
import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import "dotenv/config";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
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
		: "http://localhost:5173/home";

// Create http server
const app = express();

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

// Start http server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
