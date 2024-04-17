import express from "express";
import { Project, Issue, Vote, User, Transfer } from "../../db/models/index.js";
import getUserBalance from "./utils/getUserBalance.js";
import mergeGitHubPullRequest from "../codehost/github/lib/mergeGitHubPullRequest.js";
import closeGitHubPullRequest from "../codehost/github/lib/closeGitHubPullRequest.js";
import mergeGitLabMergeRequest from "../codehost/gitlab/lib/mergeGitLabMergeRequest.js";
import closeGitLabMergeRequest from "../codehost/gitlab/lib/closeGitLabMergeRequest.js";

const router = express.Router();

/* Endpoint: api/projects */

/* Vote. Creates a new vote entry in the database. It then checks the totals and if the new total votes exceeds the quorum,
it makes the API call to the codehost to merge or close the merge request. */
router.post("/:id/issues/:issueID/vote", async (_req, res) => {
	console.log("user voted", _req?.user.id);
	try {
		const bal = await getUserBalance(_req.user.id, _req.params.id);
		const userData = await User.findOne({ where: { id: _req.user.id } });
		const userJSON = JSON.stringify(userData);
		const user = await JSON.parse(userJSON, null, 2);
		if (bal < 1) {
			return res.send({ status: 401, data: "user is not authorized." });
		} else {
			const projectData = await Project.findOne({
				where: { id: _req.params.id },
			});
			const projectJSON = JSON.stringify(projectData, null, 2);
			const project = JSON.parse(projectJSON);
			const issueData = await Issue.findOne({
				where: {
					ProjectId: _req.params.id,
					number: _req.params.issueID,
				},
				include: Vote,
			});
			const issueJSON = JSON.stringify(issueData);
			const issue = JSON.parse(issueJSON, null, 2);

			const duplicate = issue.Votes.filter(
				(vote) => vote.UserId === _req.user.id
			);
			if (duplicate.length > 0) {
				return res.send({
					status: 403,
					data: "user has already voted on this issue",
				});
			}
			if (issue.state !== "open") {
				return res.send({ status: 403, data: "issue is not voteable" });
			}

			const vote = await Vote.create({
				side: _req.body.side,
				amount: bal,
				username: user.username,
			});
			await vote.setUser(_req.user.id);
			await issueData.addVote(vote.id);
			const votesData = await issueData.getVotes();
			const votesJson = JSON.stringify(votesData);
			const votes = JSON.parse(votesJson);

			let yesTotals = 0;
			let noTotals = 0;

			votes.map((vote) => {
				if (vote.side) {
					yesTotals += vote.amount;
				} else if (!vote.side) {
					noTotals += vote.amount;
				}
			});

			await Issue.update(
				{
					totalYesVotes: yesTotals,
					totalNoVotes: noTotals,
				},
				{ where: { ProjectId: _req.params.id, number: _req.params.issueID } }
			);

			if (yesTotals >= project.quorum) {
				if (project.live) {
					if (project.host === "github") {
						await mergeGitHubPullRequest(project.identifier, issue.number);
					} else if (project.host === "gitlab") {
						await mergeGitLabMergeRequest(
							project.hostID,
							issue.number,
							project.owner
						);
					}
				} else {
					/* Artificially merge for testing purposes if the project's mode is set to 'demo': */
					await Issue.update(
						{
							state: "closed",
							mergedAt: Date.now(),
							merged: true,
							mergeable: false,
						},
						{
							where: { ProjectId: _req.params.id, number: _req.params.issueID },
						}
					);
				}
			} else if (noTotals >= project.quorum) {
				if (project.live) {
					if (project.host === "github") {
						await closeGitHubPullRequest(project.identifier, issue.number);
					} else if (project.host === "gitlab") {
						await closeGitLabMergeRequest(
							project.hostID,
							issue.number,
							project.owner
						);
					}
				} else {
					await Issue.update(
						{
							state: "closed",
							closedAt: Date.now(),
							mergeable: false,
							merged: false,
						},
						{
							where: { ProjectId: _req.params.id, number: _req.params.issueID },
						}
					);
				}
			}

			return res.send({
				status: 200,
				messsage: "user successfully voted.",
				createdAt: vote.createdAt,
				id: vote.id,
			});
		}
	} catch (error) {
		console.log(error);
		return res.send({ status: 500, data: error.message });
	}
});

/* This creates a new transfer entry. Users do not have a fixed balance, but a balance which is the
sum of their entire ingoing/outgoing transfers in a given project. */
router.post("/:id/transfer", async (_req, res) => {
	try {
		const { amount, sender, recipient } = _req.body;

		if (sender === recipient) {
			return res.send({
				status: 401,
				data: "sender cannot be same as recipient",
			});
		}
		const bal = await getUserBalance(sender, _req.params.id);

		if (bal < amount) {
			return res.send({ status: 401, data: "user balance insufficient" });
		}

		if (amount < 1) {
			return res.send({ status: 401, data: "unauthorized request" });
		}

		const projectData = await Project.findOne({
			where: { id: _req.params.id },
		});
		const projectJSON = JSON.stringify(projectData);
		const project = JSON.parse(projectJSON);

		if (amount > project.creditAmount) {
			return res.send({ status: 401, data: "unauthorized request" });
		}

		const senderData = await User.findOne({
			where: { id: sender },
		});
		const senderJSON = JSON.stringify(senderData);
		const senderObject = JSON.parse(senderJSON);

		const senderUsername = senderObject.username;

		const recipientData = await User.findOne({
			where: { id: recipient },
		});
		const recipientJSON = JSON.stringify(recipientData);
		const recipientObject = JSON.parse(recipientJSON);

		if (!recipientObject.id) {
			return res.send({ status: 404, data: "recipient not found" });
		}

		const network = "Solaris";

		const transferData = await Transfer.create({
			amount: amount,
			sender: sender,
			recipient: recipient,
			network: network,
		});
		const transferJSON = JSON.stringify(transferData);
		const transfer = JSON.parse(transferJSON, null, 2);

		await transferData.setProject(_req.params.id);
		await projectData.addMember(recipient);

		const transferRes = {
			status: 200,
			amount: transfer.amount,
			transactionID: transfer.id,
			project: _req.params.id,
			createdAt: transfer.createdAt,
			sender: { id: sender, username: senderUsername },
			recipient: { id: transfer.recipient, username: recipientObject.username },
			transferStatus: "complete",
			network: network,
		};

		return res.send(transferRes);
	} catch (error) {
		console.log(error);
		return res.send({ status: 500, data: error.message });
	}
});

export default router;
