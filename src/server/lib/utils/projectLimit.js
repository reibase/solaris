import { User, Project } from "../../../db/models/index.js";

export default async function projectLimit(userID) {
	const userData = await User.findByPk(userID, {
		include: { model: Project, as: "projects" },
	});
	const userJSON = JSON.stringify(userData);
	const user = JSON.parse(userJSON);

	if (user.plan === "free") {
		if (user.projects.length >= 3) {
			return true;
		}
	}
	return false;
}
