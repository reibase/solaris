import { Transfer, Project } from "../../../db/models/index.js";

/* Function which adds a new user to the sandbox project with 10 credits. */
export default async function addToSandbox(userID) {
	const sandboxData = await Project.findOne({
		where: { identifier: "reibase/solaris-sandbox" },
	});
	const sandboxJSON = JSON.stringify(sandboxData);
	const sandbox = JSON.parse(sandboxJSON);
	if (sandbox?.id) {
		const transfer = await Transfer.create({
			sender: 1,
			recipient: userID,
			project: sandbox.id,
			amount: 5,
		});
		await transfer.setProject(sandbox.id);
		await sandboxData.addMember(userID);
		console.log("user added to sandbox");
	}
}
