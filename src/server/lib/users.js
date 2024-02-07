import express from "express";
import User from "../../db/models/index.js";
const router = express.Router();
//endpoint: /users

//get users.. needed?
router.get("/", async (_req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

// get a user
router.get("/:id", async (_req, res) => {
	try {
		const user = await User.findOne({
			where: { id: _req.params.id },
			include: Projects,
		});
		const json = JSON.stringify(user);
		const res = JSON.parse(json, null, 2);
		return { status: 200, user: res, message: "User deleted successfully." };
	} catch (error) {
		return { status: 500, message: error.message };
	}
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
	try {
		const user = await User.delete({ where: { id: _req.params.id } });
		return { status: 200, message: "User deleted successfully." };
	} catch (error) {
		return { status: 500, message: error.message };
	}
});
export default router;
