import express from "express";
import { Project, Issue, Vote } from "../../db/models/index.js";
import { Op } from "sequelize";
import getUserBalance from "./utils/getUserBalance.js";

const router = express.Router();
//endpoint: api/projects
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/issues/:issueID/vote", async (_req, res) => {
	const bal = await getUserBalance(1, _req.params.id);
	if (bal < 1) {
		return res.send({ status: 401 });
	} else {
		const project = await Project.findOne({ where: { id: _req.params.id } });
		const issue = await project.getIssues({
			where: { number: _req.params.issueID },
		});
		console.log("oplah");
		console.log(issue);
		console.log(issue.state, issue.mergeable);
		if (issue.state === "open" && issue.mergeable) {
			console.log("booyah");
			const vote = await Vote.create({ side: _req.body.side, amount: bal });
			await Vote.setUser(_req.user.id);
			await issue.addVote(vote.id);
			const votesData = await issue.getVotes();
			const votesJson = JSON.stringify(votesData);
			const votes = JSON.parse(votesJson);
			const yesTotals = 0;
			const noTotals = 0;

			votes.map((vote) => {
				if (vote.side) {
					yesTotals += vote.amount;
				} else if (!vote.side) {
					noTotals += vote.amount;
				}
			});

			await issue.update({
				yesVoteTotals: yesTotals,
				noVoteTotals: noTotals,
			});

			return res.send({
				status: 200,
				messsage: "user successfully voted.",
				createdAt: vote.createdAt,
				id: vote.id,
			});
		} else {
			return res.send({ status: 403 });
		}
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
