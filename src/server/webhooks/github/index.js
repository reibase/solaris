import express from "express";

const router = express.Router();
//endpoint: api/webhooks/github/projects
// need route to update a pr's head if it changes and enact functionality to close voting or not
// need route to change a pr's status from open to closed, merged
// need route to update a pr's status to conflict, checks passed
router.post("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/head", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/status", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/mergeable", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

export default router;
