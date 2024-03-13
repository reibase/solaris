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
import getGitHubPullRequest from "../codehost/github/lib/getGitHubPullRequest.js";
import getGitLabMergeRequest from "../codehost/gitlab/lib/getGitLabMergeRequest.js";
import getGitLabMergeRequests from "../codehost/gitlab/lib/getGitLabMergeRequests.js";
import createGitLabWebhook from "../codehost/gitlab/lib/createGitLabWebhook.js";
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

// find a user by a username
router.get("/:username", async (_req, res) => {
	const username = _req.params.username;
	try {
		const userData = await User.findOne({
			where: { username: username },
		});
		const userJSON = JSON.stringify(userData);
		const user = JSON.parse(userJSON, null, 2);
		if (user?.id) {
			return res.send({ status: 200, user: user });
		} else {
			return res.send({ status: 404, user: "not found" });
		}
	} catch (error) {
		return res.send({ status: 500, message: error.message });
	}
});

//get user projects
router.get("/:id/projects", async (_req, res) => {
	try {
		const data = await User.findOne({
			where: { id: _req.params.id },
			include: { model: Project, as: "projects" },
		});
		const json = JSON.stringify(data);
		const user = JSON.parse(json, null, 2);

		const projects = await Promise.all(
			user.projects.map(async (project) => {
				const data = await Project.findByPk(project.id, {
					include: { model: User, as: "members" },
				});
				const bal = await getUserBalance(user.id, project.id);
				project.user = { balance: bal };
				project.members = data.members;
				return project;
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
	const owner = _req.params.id;
	try {
		const project = await Project.create({
			title,
			owner,
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
		await project.addMember(owner);

		const initial = await Transfer.create({
			sender: owner,
			recipient: owner,
			amount: project.creditAmount,
		});

		await initial.setProject(project.id);

		if (host === "github") {
			const pulls = await getGitHubPullRequests(identifier, "open");

			await Promise.all(
				pulls.data.map(async (pull) => {
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
						state: pull.state === "opened" ? "open" : pull.state,
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

			//create webhook
			await createGitLabWebhook(hostID, parseInt(_req.params.id));
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
			issue.totalYesPercent = issue.totalYesVotes / project.quorum;
			issue.totalNoPercent = issue.totalNoVotes / project.quorum;

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

router.get(
	"/:id/projects/:projectID/issues/:issueID/mergeable",
	async (_req, res) => {
		try {
			let mergeable;
			const project = await Project.findOne({
				where: { id: _req.params.projectID },
			});
			if (project.host === "github") {
				const gitHubPullRequest = await getGitHubPullRequest(
					project.identifier,
					_req.params.issueID
				);
				mergeable = gitHubPullRequest.data.mergeable;
			} else if (project.host === "gitlab") {
				const gitLabMergeRequest = await getGitLabMergeRequest(
					project.hostID,
					_req.params.issueID,
					project.owner
				);
				mergeable =
					gitLabMergeRequest.data.merge_status === "cannot_be_merged"
						? false
						: true;
			}

			return res.send({ status: 200, data: mergeable });
		} catch (error) {
			console.log(error);
		}
	}
);

router.get("/:id/projects/:projectID/issues/:issueID", async (_req, res) => {
	try {
		const project = await Project.findOne({
			where: { id: _req.params.projectID },
			include: Issue,
		});

		const issueData = await project.getIssues({
			where: { number: _req.params.issueID },
			include: Vote,
		});

		const issueJson = JSON.stringify(issueData);
		let issue = JSON.parse(issueJson, null, 2);

		let response = issue[0];

		let userVoteData = {
			voted: false,
			side: null,
			amount: 0,
			createdAt: null,
		};

		issue[0]?.Votes.map((vote) => {
			if (vote.UserId === parseInt(_req.params.id)) {
				userVoteData.voted = true;
				userVoteData.side = vote.side;
				userVoteData.amount = vote.amount;
				userVoteData.createdAt = vote.createdAt;
			}
		});

		response.project = project;
		response.user = userVoteData;

		response.voteData = {
			votes: issue[0].Votes,
			totalYesVotes: issue[0].totalYesVotes,
			totalNoVotes: issue[0].totalNoVotes,
			totalYesPercent: response.totalYesVotes / project.quorum,
			totalNoPercent: response.totalNoVotes / project.quorum,
		};

		return res.send({ status: 200, data: response });
	} catch (error) {
		console.log(error);
	}
});

router.put("/:id/projects/:projectID", async (_req, res) => {
	const { live, creditAmount, quorum } = _req.body;
	try {
		const projectData = await Project.update(
			{
				live: live,
				creditAmount: creditAmount,
				quorum: quorum,
			},
			{ where: { id: _req.params.projectID } }
		);

		const json = JSON.stringify(projectData);
		const project = JSON.parse(json);

		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

router.delete("/:id/projects/:projectID", async (_req, res) => {
	const { id, projectID } = _req.params;
	try {
		const project = await Project.destroy({
			where: { id: projectID },
		});
		return res.send({ status: 200 });
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
