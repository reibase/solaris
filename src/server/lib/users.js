import express from "express";
import "dotenv/config";
import axios from "axios";
import url from "url";
import Stripe from "stripe";

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
import getGitHubInstallationOrgs from "../codehost/github/getGitHubInstallationOrgs.js";
import getGitHubPullRequests from "../codehost/github/lib/getGitHubPullRequests.js";
import getGitHubPullRequest from "../codehost/github/lib/getGitHubPullRequest.js";
import getGitLabMergeRequest from "../codehost/gitlab/lib/getGitLabMergeRequest.js";
import getGitLabMergeRequests from "../codehost/gitlab/lib/getGitLabMergeRequests.js";
import createGitLabWebhook from "../codehost/gitlab/lib/createGitLabWebhook.js";
import getUserBalance from "./utils/getUserBalance.js";
import getSubscription from "./utils/getSubscription.js";
import projectLimit from "./utils/projectLimit.js";
import projectMemberLimit from "./utils/projectMemberLimit.js";
import validateIssue from "./utils/validateIssue.js";

const {
	GITLAB_APP_CLIENT_ID,
	GITLAB_APP_CLIENT_SECRET,
	GITLAB_APP_REDIRECT_URI,
	STRIPE_SECRET_KEY,
	NODE_ENV,
} = process.env;

const router = express.Router();
const stripe = new Stripe(STRIPE_SECRET_KEY);

/* Endpoint: /users */
router.get("/username/:username", async (_req, res) => {
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
		console.log(error);
		return res.send({ status: 500, message: error.message });
	}
});

router.get("/:id", async (_req, res) => {
	const id = _req.params.id;
	try {
		const userData = await User.findByPk(parseInt(id));
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

/* Get user's projects by user id */
router.get("/:id/projects", async (_req, res) => {
	try {
		const data = await User.findOne({
			where: { id: _req.params.id },
			include: { model: Project, as: "projects" },
		});
		const json = JSON.stringify(data);
		const user = JSON.parse(json, null, 2);

		// If a user's plan is inactive, downgrade them to the free tier:
		if (user.subscriptionID) {
			const subscription = await getSubscription(user.subscriptionID);
			if (subscription?.items?.data[0]?.plan.active === false) {
				const data = await User.update(
					{ plan: "free" },
					{ where: { id: user.id } }
				);
			}
		}
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

/* This endpoint is called when a user is creating a new project and is redirected from GitHub. GitHub supplies an installation id
	 in the URL params and the client immediately sends it here. We create a new entry in our database that a user is associated
	 with a new installation id for future reference. */
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

/* We use this endpoint to take every installation id associated with a user and return the repos each has access to.
	This permits a single user having Solaris installed on multiple GitHub organizations they belong to.
	
	We then query GitHub for the repos associated with each installation id and return them to the client so they
	can select one to create a new project with. */
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

/* Same as above but for Gitlab. Are we able to have multiple orgs associated to one user here? It appears to use only one
installation id. */
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

router.get("/:id/github/installations/orgs", async (_req, res) => {
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

		const installationOrgs = await Promise.all(
			obj.map(async (installation) => {
				return await getGitHubInstallationOrgs(installation.installationID);
			})
		);
		const responseData = installationOrgs.filter(
			(installation) => installation.status === 200
		);

		return res.send({ status: 200, installations: responseData });
	} catch (error) {
		console.log("error:", error);
		return res.send({ status: 500, error: error.message });
	}
});

/* Create project */
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
		quorum,
		isPrivate,
	} = _req.body;
	const owner = _req.params.id;
	try {
		const limit = await projectLimit(owner);
		if (limit) {
			return res.status(401).json({ message: "Project limit reached." });
		}
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
		/* Create a transfer entry which is the initial balance, credited to the maintainer. */
		const initial = await Transfer.create({
			sender: owner,
			recipient: owner,
			amount: project.creditAmount,
		});
		/* Associate the initial balance with the newly created project. */
		await initial.setProject(project.id);

		/* Get all currently open pull requests and create new entries in our database for them. */
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

			/* Create a webhook to listen for events from the repo on Gitlab. New merge requests will then make POST requests
			to our database. This is done for GitHub automatically based on the GitHub App configuration. */
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
			order: [[Issue, "updatedAt", "DESC"]],
			include: [{ model: Issue }, { model: User, as: "members" }],
		});
		const json = JSON.stringify(data);
		const project = JSON.parse(json, null, 2);
		const userData = await User.findByPk(_req.params.id);
		const userJSON = JSON.stringify(userData);
		const user = JSON.parse(userJSON);

		const userID = parseInt(_req.params.id);

		let balance = await getUserBalance(userID, project.id);

		project.user = {
			balance: balance,
			username: user.username,
			id: user.id,
			avatar: user.avatar,
		};

		const issues = project.Issues;

		/* Sort a project's issues into categories for pagination. */
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

		await Promise.all(
			project.members.map(async (member) => {
				let bal;
				bal = await getUserBalance(member.id, project.id);
				member.balance = bal;
			})
		);
		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

/* Check whether or not a pull request is mergeable. This occurs on the single PR/voting view. As mergeability is prone to change, 
it is necessary to check it each time a user visits the view before allowing them to vote on it because we don't want users to 
be able to vote on pull requests which are not mergeable. */
router.get(
	"/:id/projects/:projectID/issues/:issueID/mergeable",
	async (_req, res) => {
		try {
			const projectData = await Project.findOne({
				where: { id: _req.params.projectID },
				include: { model: Issue },
			});
			const projectJSON = JSON.stringify(projectData, null, 2);
			const project = JSON.parse(projectJSON);

			const [issue] = project.Issues.filter(
				(issue) => issue.id === parseInt(_req.params.issueID)
			);

			const actionable = await validateIssue(
				_req.params.projectID,
				_req.params.issueID
			);

			return res.send({ status: 200, data: actionable });
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
			where: { id: _req.params.issueID },
			order: [[Vote, "createdAt", "DESC"]],
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

		/* This is used for rendering whether or not the current user has voted, and if so, what the details of that vote were. */
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

/* Update a project's configuration. Total credit amount is fixed at 1000 right now. It is not editable. */
router.put("/:id/projects/:projectID", async (_req, res) => {
	/* Balances will be an object of user ids and that user's new balance. It is used for toggling a user's
	credit balance. */
	const { live, creditAmount, quorum, balances, newMember, removeMember } =
		_req.body;
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

		/* We loop through the balances, determine if it is a deposit or a withdrawl, and create a transfer
		entry for each one. */
		for (let key in balances) {
			let bal = await getUserBalance(parseInt(key), _req.params.projectID);
			let newBal = balances[key];
			let transfer;
			if (bal > newBal) {
				transfer = await Transfer.create({
					sender: key,
					recipient: _req.user.id,
					amount: bal - newBal,
				});
				await transfer.setProject(parseInt(_req.params.projectID));
			} else if (bal < newBal) {
				transfer = await Transfer.create({
					sender: _req.user.id,
					recipient: key,
					amount: newBal - bal,
				});
				await transfer.setProject(parseInt(_req.params.projectID));
			}
		}

		/* Remove user based on their id. Their credits go back to the maintainer. */
		if (removeMember?.id) {
			let bal = await getUserBalance(removeMember.id, _req.params.projectID);
			const transfer = await Transfer.create({
				sender: removeMember.id,
				recipient: _req.user.id,
				amount: bal,
				ProjectId: parseInt(_req.params.projectID),
			});
			const proj = await Project.findByPk(parseInt(_req.params.projectID));
			await proj.removeMember(removeMember.id);
		}

		/* Logic for adding a new member to the project based on their id */
		if (newMember?.id) {
			const projectMemberLimitExceeded = await projectMemberLimit(
				_req.params.projectID
			);
			if (projectMemberLimitExceeded) {
				return res.send({ status: 401, message: "Team member limit reached." });
			}
			const proj = await Project.findByPk(parseInt(_req.params.projectID));
			await proj.addMember(newMember.id);
		}

		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

/* Delete single project */
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

/* Delete single user */
router.delete("/:id", async (_req, res) => {
	try {
		const user = await User.findByPk(_req.params.id);
		if (user.subscriptionID) {
			await stripe.subscriptions.cancel(user.subscriptionID);
		}
		await Project.destroy({ where: { owner: _req.params.id } });
		await user.destroy();
		return res.send({
			status: 200,
			url:
				NODE_ENV === "development"
					? "http://localhost:3001/api/auth/logout"
					: "https://solaris.reibase.rs/api/auth/logout",
			message: "User and associated data deleted successfully.",
		});
	} catch (error) {
		return res.send({ status: 500, message: error.message });
	}
});

export default router;
