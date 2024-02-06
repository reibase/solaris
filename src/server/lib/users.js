import express from "express";

const router = express.Router();
//endpoint: /users

//get users.. needed?
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// get a user
router.get("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// update user, profile etc
router.put("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// create user..? needed?
router.post("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// delete user
router.delete("/:id", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});
export default router;
