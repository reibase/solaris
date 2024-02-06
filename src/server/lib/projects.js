import express from "express";

const router = express.Router();
//endpoint: api/projects
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.get("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.get("/:id/users", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// toggle live and test modes
router.put("/:id/mode", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// create project
router.post("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id/transfer", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.delete("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});
export default router;
