import express from "express";

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

router.post("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.delete("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});
export default router;
