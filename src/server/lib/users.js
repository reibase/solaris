import express from "express";
import { User, Installation, Project } from "../../db/models/index.js";
import getGitHubInstallationRepos from "../codehost/github/getGitHubInstallationRepos.js";
import getGitLabInstallationRepos from "../codehost/gitlab/getGitLabInstallationRepos.js";

import "dotenv/config";
import axios from "axios";
const { GITLAB_APP_CLIENT_ID, GITLAB_APP_CLIENT_SECRET } = process.env;
import url from "url";

const router = express.Router();
//endpoint: /users

//get users.. needed?
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// get a user
router.get("/:id", async (_req, res) => {
	try {
		const user = await User.findOne({
			where: { id: _req.params.id },
			include: Projects,
		});
		const json = JSON.stringify(user);
		const res = JSON.parse(json, null, 2);
		return { status: 200, user: res, message: "User deleted successfully." };
	} catch (error) {
		return { status: 500, message: error.message };
	}
});

// update user, profile etc
router.put("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// create codehost app installation id
router.post("/:id/installations", async (_req, res) => {
	try {
		if (!_req.body.installationID || !_req.body.provider || !_req.params.id) {
			return res.send({ status: 401, message: "invalid input data" });
		}
		let installation;
		let created;
		if (_req.body.provider === "gitlab") {
			const body = {
				grant_type: "authorization_code",
				client_id: GITLAB_APP_CLIENT_ID,
				client_secret: GITLAB_APP_CLIENT_SECRET,
				code: _req.body.installationID,
				redirect_uri: "http://localhost:3001/create",
			};

			const params = new url.URLSearchParams(body);

			const { data } = await axios
				.post(`https://gitlab.com/oauth/token`, params.toString())
				.then((res) => {
					return res;
				})
				.catch((err) => {
					console.log(err);
					return err;
				});

			const refreshToken = data.refresh_token;
			const [dbInstallation, dbCreated] = await Installation.findOrCreate({
				where: { UserId: _req.params.id, provider: "gitlab" },
				defaults: {
					provider: _req.body.provider,
					refreshToken: refreshToken,
				},
			});
			console.log(dbCreated, _req.body.provider, dbInstallation.refreshToken);
			installation = dbInstallation;
			created = dbCreated;
		} else if (_req.body.provider === "github") {
			_req.body.installationID = parseInt(_req.body.installationID);

			const [dbInstallation, dbCreated] = await Installation.findOrCreate({
				where: {
					provider: _req.body.provider,
					installationID: _req.body.installationID,
				},
			});
			console.log(dbCreated, _req.body.provider, dbInstallation.installationID);
			installation = dbInstallation;
			created = dbCreated;
		}

		await installation.setUser(_req.params.id);
		const response = {
			status: created ? 201 : 200,
			message: `installation ${created ? "created" : "found"} successfully.`,
		};
		return res.send(response);
	} catch (error) {
		console.log(error);
		return res.send({ status: 500, error: error.message });
	}
});

router.get("/:id/github/installations/repos", async (_req, res) => {
	try {
		const user = await User.findOne({ where: { id: _req.params.id } });
		const installationsData = await user.getInstallations({
			where: { provider: "github" },
		});

		const json = JSON.stringify(installationsData);
		const obj = JSON.parse(json, null, 2);

		if (obj.length === 0) {
			return res.send({ status: 404 });
		}

		const installationRepos = await Promise.all(
			obj.forEach(async (installation) => {
				const installationRepos = await getGitHubInstallationRepos(
					installation.installationID
				);
				if (installationRepos.status === 200) {
					return installationRepos;
				} else {
					await Installation.destroy({
						where: { installationID: installation.installationID },
					});
				}
			})
		);

		return res.send({ status: 200, installations: installationRepos });
	} catch (error) {
		return res.send({ status: 500, error: error.message });
	}
});

router.get("/:id/gitlab/installations/repos", async (_req, res) => {
	try {
		const data = await Installation.findOne({
			where: { provider: "gitlab", UserId: _req.params.id },
		});
		const json = JSON.stringify(data);
		const installation = JSON.parse(json, null, 2);

		if (!installation) {
			return res.send({ status: 404 });
		}

		const responseData = await getGitLabInstallationRepos(
			installation.refreshToken
		);

		return res.send({ status: 200, installations: responseData });
	} catch (error) {
		return res.send({ status: 500, error: error.message });
	}
});

router.post("/:id/projects", async (_req, res) => {
	const {
		title,
		description,
		host,
		identifier,
		hostID,
		installationID,
		url,
		live,
		quorum,
		clawBack,
	} = _req.body;
	try {
		const project = await Project.create({
			title,
			description,
			identifier,
			installationID,
			url,
			quorum,
			host,
			hostID,
			live,
			clawBack,
		});
		await project.setUser(_req.params.id);
		res.status(200).json({ project });
	} catch (error) {
		console.log(error.message);
		res.status(500).json(error.message);
	}
});

router.delete("/:id/projects/:id", async (_req, res) => {
	const { id } = _req.body;
	try {
		const project = await Project.destroy({
			where: { id: id },
		});
		res.status(200).json({ message: "project deleted successfully" });
	} catch (error) {
		res.status(500).json(error.message);
	}
});

// delete user
router.delete("/:id", async (_req, res) => {
	try {
		const user = await User.delete({ where: { id: _req.params.id } });
		return { status: 200, message: "User deleted successfully." };
	} catch (error) {
		return { status: 500, message: error.message };
	}
});
export default router;
