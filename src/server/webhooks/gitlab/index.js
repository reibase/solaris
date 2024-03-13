import express from "express";
const router = express.Router();

import { Issue, Project } from "../../../db/models/index.js";

//endpoint: api/webhooks/gitlab
router.post("/", async (_req, res) => {
	if (_req.body.object_kind === "merge_request") {
		if (_req.body?.object_attributes.action === "open") {
			const duplicateData = await Issue.findOne({
				where: { hostID: _req.body.object_attributes.id },
			});
			const duplicateJSON = JSON.stringify(duplicateData, null, 2);
			const duplicate = JSON.parse(duplicateJSON);

			if (duplicate?.id) {
				return;
			}
			const project = await Project.findOne({
				where: { hostID: _req.body.project.id },
			});
			const issue = await Issue.create({
				number: _req.body.object_attributes.iid,
				url: _req.body.object_attributes.web_url,
				hostID: _req.body.object_attributes.id,
				state:
					_req.body.object_attributes.state === "opened"
						? "open"
						: _req.body.object_attributes.state,
				description: _req.body.object_attributes.description,
				title: _req.body.object_attributes.title,
				host: "gitlab",
				mergeable:
					_req.body.object_attributes.merge_status === "cannot_be_merged"
						? false
						: true,
				author: _req.body.object_attributes.author_id,
				createdAt: _req.body.object_attributes.created_at,
				//	conflict: _req.body.object_attributes.has_conflicts,
				//	head: _req.body.object_attributes.last_commit.sha,
				ref: _req.body.object_attributes.source_branch,
				baseRef: _req.body.object_attributes.target_branch,
				repoID: _req.body.object_attributes.target_project_id,
			});
			await issue.setProject(project.id);
		}
		if (_req.body?.object_attributes.action === "merge") {
			await Issue.update(
				{
					state: "closed",
					mergeable: false,
					merged: true,
					mergedAt: _req.body.object_attributes.updated_at,
				},
				{ where: { hostID: _req.body.object_attributes.id } }
			);
		}
		if (_req.body?.object_attributes.action === "close") {
			await Issue.update(
				{
					state: "closed",
					mergeable: false,
					merged: false,
					closedAt: _req.body.object_attributes.updated_at,
				},
				{ where: { hostID: _req.body.object_attributes.id } }
			);
		}
		if (_req.body?.object_attributes.action === "update") {
		}
	}
});

export default router;
