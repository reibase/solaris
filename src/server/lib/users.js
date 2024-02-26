import express from "express";
import { Op } from "sequelize";

import {
	User,
	Installation,
	Project,
	Issue,
	Transfer,
	Vote,
} from "../../db/models/index.js";
import getGitHubInstallationRepos from "../codehost/github/getGitHubInstallationRepos.js";
import getGitLabInstallationRepos from "../codehost/gitlab/getGitLabInstallationRepos.js";
import getGitHubPullRequests from "../codehost/github/lib/getGitHubPullRequests.js";
import getGitLabMergeRequests from "../codehost/gitlab/lib/getGitLabMergeRequests.js";
import getUserBalance from "./utils/getUserBalance.js";

import "dotenv/config";
import axios from "axios";
const {
	GITLAB_APP_CLIENT_ID,
	GITLAB_APP_CLIENT_SECRET,
	GITLAB_APP_REDIRECT_URI,
} = process.env;
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

//get user projects
router.get("/:id/projects", async (_req, res) => {
	try {
		const data = await User.findOne({
			where: { id: _req.params.id },
			include: Project,
		});
		const json = JSON.stringify(data);
		const user = JSON.parse(json, null, 2);

		const projects = user.Projects;

		await Promise.all(
			projects.map(async (project) => {
				const bal = await getUserBalance(user.id, project.id);
				project.user = { balance: bal };
			})
		);

		return res.send({ status: 200, data: projects });
	} catch (error) {
		console.log(error);
		return res.send({ status: 500, message: error.message });
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
				redirect_uri: GITLAB_APP_REDIRECT_URI,
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
			obj.map(async (installation) => {
				return await getGitHubInstallationRepos(installation.installationID);
			})
		);

		const responseData = installationRepos.filter(
			(installation) => installation.status === 200
		);

		console.log("installation repos:", installationRepos);
		console.log("response data:", responseData);

		return res.send({ status: 200, installations: responseData });
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
		creditAmount,
		url,
		live,
		quorum,
		clawBack,
		isPrivate,
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
			isPrivate,
			creditAmount,
		});
		await project.setUser(_req.params.id);

		const initial = await Transfer.create({
			sender: _req.params.id,
			recipient: _req.params.id,
			amount: project.creditAmount,
		});

		await initial.setProject(project.id);

		if (host === "github") {
			const pulls = await getGitHubPullRequests(identifier, "open");

			await Promise.all(
				pulls.data.map(async (pull) => {
					console.log(pull);
					const pullRequest = await Issue.create({
						number: pull.number,
						hostID: pull.id,
						url: pull.html_url,
						title: pull.title,
						state: pull.state,
						host: host,
						author: pull.user.login,
						createdAt: pull.created_at,
						mergeable: pull.mergeable,
						conflict: pull.mergeable,
						head: pull.head.sha,
						ref: pull.head.ref,
						base: pull.base.sha,
						baseRef: pull.base.ref,
						repoID: pull.base.repo.id,
					});
					await pullRequest.setProject(project.id);
				})
			);
		} else if (host === "gitlab") {
			const pulls = await getGitLabMergeRequests(
				hostID,
				parseInt(_req.params.id)
			);

			await Promise.all(
				pulls.data.map(async (pull) => {
					const pullRequest = await Issue.create({
						number: pull.iid,
						url: pull.web_url,
						hostID: pull.id,
						state: pull.state,
						description: pull.description,
						title: pull.title,
						host: host,
						mergeable: pull.merge_status === "cannot_be_merged" ? false : true,
						author: pull.author.username,
						createdAt: pull.created_at,
						conflict: pull.has_conflicts,
						head: pull.sha,
						ref: pull.source_branch,
						baseRef: pull.target_branch,
						repoID: pull.target_project_id,
					});
					await pullRequest.setProject(project.id);
				})
			);
		}

		res.status(200).json({ project });
	} catch (error) {
		console.log(error);
		res.status(500).json(error.message);
	}
});

router.get("/:id/projects/:projectID", async (_req, res) => {
	try {
		const data = await Project.findOne({
			where: { id: _req.params.projectID },
			include: Issue,
		});
		const json = JSON.stringify(data);
		const project = JSON.parse(json, null, 2);

		const transfersData = await data.getTransfers({
			where: {
				[Op.or]: [{ recipient: _req.params.id }, { sender: _req.params.id }],
			},
		});
		const transfersJson = JSON.stringify(transfersData);
		const transfers = JSON.parse(transfersJson);

		const userID = parseInt(_req.params.id);

		let balance = transfers.reduce((accum, cur) => {
			if (cur.recipient === userID) {
				accum = accum + cur.amount;
			} else if (cur.sender === userID) {
				accum = accum - cur.amount;
			}
			return accum;
		}, 0);

		project.user = { balance: balance };
		const issues = project.Issues;
		project.issues = { open: [], merged: [], closed: [] };

		issues.map((issue) => {
			if (issue.state === "closed") {
				if (issue.merged) {
					project.issues.merged.push(issue);
				} else {
					project.issues.closed.push(issue);
				}
			} else if (issue.state === "open") {
				project.issues.open.push(issue);
			}
		});

		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

router.get("/:id/projects/:projectID/issues/:issueID", async (_req, res) => {
	try {
		const data = await Project.findOne({
			where: { id: _req.params.projectID },
			include: Issue,
		});

		const issueData = await data.getIssues({
			where: { number: _req.params.issueID },
			include: Vote,
		});

		const issueJson = JSON.stringify(issueData);
		let issue = JSON.parse(issueJson, null, 2);

		const json = JSON.stringify(data);
		const project = JSON.parse(json, null, 2);

		const transfersData = await data.getTransfers({
			where: {
				[Op.or]: [{ recipient: _req.params.id }, { sender: _req.params.id }],
			},
		});
		const transfersJson = JSON.stringify(transfersData);
		const transfers = JSON.parse(transfersJson);

		const userID = parseInt(_req.params.id);

		let balance = transfers.reduce((accum, cur) => {
			if (cur.recipient === userID) {
				accum = accum + cur.amount;
			} else if (cur.sender === userID) {
				accum = accum - cur.amount;
			}
			return accum;
		}, 0);

		project.user = { balance: balance };

		project.issue = issue[0];
		project.issue.voteData = {
			votes: [
				{
					id: 1,
					side: true,
					amount: 300,
					UserId: 1,
					createdAt: "2024 - 02 - 01",
				},
				{
					id: 2,
					side: true,
					amount: 250,
					UserId: 2,
					createdAt: "2024 - 02 - 02",
				},
				{
					id: 3,
					side: true,
					amount: 400,
					UserId: 3,
					createdAt: "2024 - 02 - 03",
				},
				{
					id: 4,
					side: true,
					amount: 350,
					UserId: 1,
					createdAt: "2024 - 02 - 04",
				},
				{
					id: 5,
					side: true,
					amount: 200,
					UserId: 4,
					createdAt: "2024 - 02 - 05",
				},
				{
					id: 6,
					side: true,
					amount: 275,
					UserId: 5,
					createdAt: "2024 - 02 - 06",
				},
				{
					id: 7,
					side: true,
					amount: 325,
					UserId: 7,
					createdAt: "2024 - 02 - 07",
				},
				{
					id: 8,
					side: true,
					amount: 275,
					UserId: 8,
					createdAt: "2024 - 02 - 08",
				},
				{
					id: 9,
					side: true,
					amount: 300,
					UserId: 99,
					createdAt: "2024 - 02 - 09",
				},
				{
					id: 10,
					side: true,
					amount: 350,
					UserId: 12,
					createdAt: "2024 - 02 - 10",
				},
				{
					id: 11,
					side: true,
					amount: 400,
					UserId: 3131,
					createdAt: "2024 - 02 - 11",
				},
				{
					id: 12,
					side: true,
					amount: 225,
					UserId: 212,
					createdAt: "2024 - 02 - 12",
				},
				{
					id: 13,
					side: true,
					amount: 275,
					UserId: 132,
					createdAt: "2024 - 02 - 13",
				},
				{
					id: 14,
					side: true,
					amount: 325,
					UserId: 42525,
					createdAt: "2024 - 02 - 14",
				},
				{
					id: 15,
					side: false,
					amount: 375,
					UserId: 6343,
					createdAt: "2024 - 02 - 15",
				},
				{
					id: 16,
					side: false,
					amount: 250,
					UserId: 3155,
					createdAt: "2024 - 02 - 16",
				},
				{
					id: 17,
					side: false,
					amount: 275,
					UserId: 5353,
					createdAt: "2024 - 02 - 17",
				},
				{
					id: 18,
					side: false,
					amount: 325,
					UserId: 64565,
					createdAt: "2024 - 02 - 18",
				},
				{
					id: 19,
					side: false,
					amount: 400,
					UserId: 64636,
					createdAt: "2024 - 02 - 19",
				},
				{
					id: 20,
					side: false,
					amount: 300,
					UserId: 643,
					createdAt: "2024 - 02 - 20",
				},
			],
		};

		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
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
