import express from "express";

const router = express.Router();
//endpoint: /projects/:id/issues
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.get("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.put("/:id/head", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.put("/:id/vote", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.post("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

router.delete("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});
export default router;
