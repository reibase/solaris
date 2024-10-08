import express from "express";
import passport from "passport";
import session from "express-session";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import GitLabStrategy from "passport-gitlab2";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Octokit } from "octokit";
import SmeeClient from "smee-client";
import path from "path";
import "dotenv/config";
import SequelizeStore from "connect-session-sequelize";
import { createServer } from "node:http";
import { Server } from "socket.io";
import Stripe from "stripe";

import db from "../db/index.js";
import { User } from "../db/models/index.js";

import projects from "./lib/projects.js";
import users from "./lib/users.js";

import githubWebhook from "./webhooks/github/index.js";
import gitlabWebhook from "./webhooks/gitlab/index.js";
import stripeWebhook from "./webhooks/stripe/index.js";

import addToSandbox from "./lib/utils/addToSandbox.js";

/* For testing webhooks in dev environment: */
const smee = new SmeeClient({
	source: "https://smee.io/HXzpMdreQh578AmR",
	target: "http://localhost:3001/api/webhooks/gitlab",
	logger: console,
});

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
	NODE_ENV,
	STRIPE_PREMIUM_PRICE_ID,
	STRIPE_SECRET_KEY,
} = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);

const sequelizeStore = SequelizeStore(session.Store);
const store = new sequelizeStore({ db });

const app = express();

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	socket.on("vote cast", (projectID) => {
		socket.emit("vote received", projectID);
	});
});

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store,
	})
);

// body parsing middleware
app.use(express.json());
app.use("/", express.static(__dirname + "/dist"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const events = NODE_ENV === "development" && smee.start();
app.use("/api/webhooks/github", githubWebhook);
app.use("/api/webhooks/gitlab", gitlabWebhook);
app.use("/api/webhooks/stripe", stripeWebhook);
NODE_ENV === "development" && events.close();

/* Initialize Passport!  Also use passport.session() middleware, to support
persistent login sessions (recommended). */
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, {
			id: user.id,
			username: user.username,
			avatar: user.avatar,
			plan: user.plan,
			email: user.email,
		});
	});
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

				if (created) {
					await addToSandbox(user.id);
				}

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
			if (created) {
				await addToSandbox(user.id);
			}
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

				if (created) {
					await addToSandbox(user.id);
				}

				return done(null, user);
			});
		}
	)
);

/* Routes for when user clicks Login with <Auth Provider>: */
app.get(
	"/api/auth/github",
	passport.authenticate("github", { scope: ["user:email"] })
);
app.get("/api/auth/google", passport.authenticate("google"));
app.get("/api/auth/gitlab", passport.authenticate("gitlab"));

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.

/* Routes which the auth provider redirects to after successful authentication: */
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
		res.redirect("/");
	}
);

app.get("/api/auth/logout", function (req, res) {
	req.logout(function (err) {
		req.session.destroy();
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

/* Endpoint the client queries to establish if the user is logged in or not  */
app.get("/api/auth/me", function (req, res) {
	if (!req.user) {
		return res.send({ isLoggedIn: false });
	}
	return res.send({ isLoggedIn: true, ...req.user });
});

/* Route for when user clicks submit access code. Not in use currently: */
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

/* Simple route middleware to ensure user is authenticated.
   Use this route middleware on any resource that needs to be protected.  If
   the request is authenticated (typically via a persistent login session),
   the request will proceed.  Otherwise, the user will be redirected to the
   login page. */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.use("/api/users", ensureAuthenticated, users);
app.use("/api/projects", ensureAuthenticated, async function (req, res) {
	return projects(req, res);
});

app.post("/api/create-checkout-session", async (req, res) => {
	const { mode, plan, userID } = req.body;

	const userData = await User.findByPk(userID);
	const userJSON = JSON.stringify(userData, null, 2);
	const user = JSON.parse(userJSON);

	if (plan === "free") {
		await User.update({ plan: plan }, { where: { id: userID } });
		return res.json({ url: "/success" });
	}

	if (plan === "enterprise") {
		await User.update({ plan: "free" }, { where: { id: userID } });
		return res.json({ url: "/welcomeenterprise" });
	}

	if (plan === "premium") {
		await User.update({ plan: "premium" }, { where: { id: userID } });

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: STRIPE_PREMIUM_PRICE_ID,
					quantity: 1,
				},
			],
			mode: "subscription",
			customer_email: user.email,
			success_url:
				NODE_ENV === "development"
					? "http://localhost:3001/success"
					: "https://solaris.reibase.rs/success",
			cancel_url:
				NODE_ENV === "development"
					? "http://localhost:3001/plans"
					: "https://solaris.reibase.rs/plans",
		});
		return res.json({ url: session.url });
	}
});

app.post("/api/billing-portal-session", async (req, res) => {
	const { mode, plan, userID } = req.body;

	const userData = await User.findByPk(userID);
	const userJSON = JSON.stringify(userData, null, 2);
	const user = JSON.parse(userJSON);
	if (!user?.customerID) {
		return;
	}
	const session = await stripe.billingPortal.sessions.create({
		customer: user.customerID,
		return_url:
			NODE_ENV === "development"
				? "http://localhost:3001/profile"
				: "https://solaris.reibase.rs/profile",
	});

	return res.json({ url: session.url });
});

app.use("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/dist/index.html"));
});

// Connect to database
const syncDB = async () => {
	NODE_ENV === "development" && (await db.sync());
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
server.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
