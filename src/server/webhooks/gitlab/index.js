import express from "express";
const router = express.Router();

import { Issue, Project } from "../../../db/models/index.js";

//endpoint: api/webhooks/github/projects
router.post("/", async (_req, res) => {
	console.log(_req.body);
	// if (_req.body.action === "closed") {
	// 	await Issue.update(
	// 		{
	// 			state: "closed",
	// 			mergeable: false,
	// 			merged: _req.body.pull_request.merged,
	// 			closedAt: String(_req.body.pull_request.closed_at),
	// 		},
	// 		{ where: { hostID: _req.body.pull_request.id } }
	// 	);
	// }
	// if (_req.body.action === "opened") {
	// 	const issue = await Issue.create({
	// 		state: _req.body.pull_request.state,
	// 		mergeable: _req.body.pull_request.mergeable,
	// 		title: _req.body.pull_request.title,
	// 		number: _req.body.number,
	// 		author: _req.body.pull_request.user.login,
	// 		description: _req.body.pull_request.body,
	// 		createdAt: _req.body.pull_request.created_at,
	// 		hostID: _req.body.pull_request.id,
	// 		head: _req.body.pull_request.head.sha,
	// 		ref: _req.body.pull_request.head.ref,
	// 		base: _req.body.pull_request.base.sha,
	// 		baseRef: _req.body.pull_request.base.ref,
	// 		repoID: _req.body.pull_request.base.repo.id,
	// 		merged: _req.body.pull_request.merged,
	// 	});
	// 	const project = await Project.findOne({
	// 		where: { hostID: _req.body.pull_request.head.repo.id },
	// 	});
	// 	await issue.setProject(project.id);
	// }
});

export default router;
