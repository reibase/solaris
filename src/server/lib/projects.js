import express from "express";
import { Project, Issue, Vote } from "../../db/models/index.js";
import { Op } from "sequelize";
import getUserBalance from "./utils/getUserBalance.js";
import mergeGitHubPullRequest from "../codehost/github/lib/mergeGitHubPullRequest.js";
import closeGitHubPullRequest from "../codehost/github/lib/closeGitHubPullRequest.js";

const router = express.Router();
//endpoint: api/projects
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/issues/:issueID/vote", async (_req, res) => {
	try {
		const bal = await getUserBalance(_req.user.id, _req.params.id);
		if (bal < 1) {
			return res.send({ status: 401, data: "user is not authorized." });
		} else {
			const project = await Project.findOne({ where: { id: _req.params.id } });
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

			const vote = await Vote.create({ side: _req.body.side, amount: bal });
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
				await mergeGitHubPullRequest(project.identifier, issue.number);
			} else if (noTotals >= project.quorum) {
				await closeGitHubPullRequest(project.identifier, issue.number);
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

router.get("/:id", async (_req, res) => {
	try {
		const data = await Project.findOne({
			where: { id: _req.params.id },
			include: Issue,
		});
		const json = JSON.stringify(data);
		const project = JSON.parse(json, null, 2);

		const transfers = await Project.getTransfers({
			where: {
				[Op.or]: [{ recipient: _req.params.id }, { sender: _req.params.id }],
			},
		});

		let balance = transfers.reduce((accum, cur) => {
			if (cur.recipient === _req.user.id) {
				accum = accum + cur.amount;
			} else if (cur.sender === _req.user.id) {
				accum = accum - cur.amount;
			}
			return accum;
		}, 0);

		project.user = { balance: balance };

		console.log(project);
		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

export default router;
