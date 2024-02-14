import express from "express";
import { User, Installation, Project } from "../../db/models/index.js";
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
		if (!_req.body.installationID || !_req.body.provider) {
			return res.send({ status: 401, message: "invalid input data" });
		}

		const [installation, created] = await Installation.findOrCreate({
			where: {
				provider: _req.body.provider,
				installationID: parseInt(_req.body.installationID),
			},
		});

		await installation.setUser(_req.params.id);

		return res.send({
			status: created ? 201 : 200,
			message: `installation ${created ? "created" : "found"} successfully.`,
		});
	} catch (error) {
		return res.send({ status: 500, error: error.message });
	}
});

router.get("/:id/installations/repos", async (_req, res) => {
	try {
		const user = await User.findOne({ where: { id: _req.params.id } });
		const installationsData = await user.getInstallations();

		const json = JSON.stringify(installationsData);
		const obj = JSON.parse(json, null, 2);

		if (obj.length === 0) {
			return res.send({ status: 404 });
		}

		const installationRepos = await Promise.all(
			obj.map(async (installation) => {
				if (installation.provider === "github") {
					return await getInstallationRepos(installation.installationID);
				}
			})
		);

		return res.send({ status: 200, installations: installationRepos });
	} catch (error) {
		return res.send({ status: 500, error: error.message });
	}
});

router.post("/:id/projects", async (_req, res) => {
	const {
		title,
		description,
		host,
		identifier,
		hostID,
		installationID,
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
			installationID,
			url,
			quorum,
			host,
			hostID,
			live,
			clawBack,
		});
		res.status(200).json({ project });
	} catch (error) {
		res.status(500).json(error.message);
	}
});

router.delete("/:id/projects/:id", async (_req, res) => {
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
