import express from "express";
import { User, Installation } from "../../db/models/index.js";
import getInstallationRepos from "../codehost/github/getInstallationRepos.js";

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

// create codehost app installation id
router.post("/:id/installations", async (_req, res) => {
	try {
		const [installation, created] = await Installation.findOrCreate({
			where: {
				provider: _req.body.provider,
				installationID: _req.body.installationID,
			},
		});

		await installation.setUser(_req.params.id);
		const user = await User.findOne({ where: { id: _req.params.id } });
		const installationsData = await user.getInstallations();

		const json = JSON.stringify(installationsData);
		const obj = JSON.parse(json, null, 2);

		const installationRepos = await Promise.all(
			obj.map(async (installation) => {
				if (installation.provider === "github") {
					return await getInstallationRepos(installation.installationID);
				}
			})
		);
		return res.send(installationRepos);
	} catch (error) {
		return res.send({ status: 500, error: error.message });
	}
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
