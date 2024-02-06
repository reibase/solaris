import express from "express";

import { Project } from "../../db/models/index.js";

const router = express.Router();
//endpoint: users/:id/projects
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});
router.get("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.put("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/", async (_req, res) => {
	const {
		title,
		description,
		host,
		identifier,
		hostID,
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
			url,
			quorum,
			host,
			hostID,
			live,
			clawBack,
		});
		// await project.setOwner(); ?
		res.status(200).json({ project });
	} catch (error) {
		res.status(500).json(error.message);
	}
});

router.delete("/:id", async (_req, res) => {
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
export default router;
