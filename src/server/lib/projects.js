import express from "express";
import { Project, Issue } from "../../db/models/index.js";

const router = express.Router();
//endpoint: api/projects
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.get("/:id", async (_req, res) => {
	try {
		const data = await Project.findOne({
			where: { id: _req.params.id },
			include: Issue,
		});
		const json = JSON.stringify(data);
		const project = JSON.parse(json, null, 2);
		console.log(project);
		return res.send({ status: 200, data: project });
	} catch (error) {
		console.log(error);
	}
});

export default router;
