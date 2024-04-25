import { User, Project } from "../../../db/models/index.js";

export default async function projectMemberLimit(projectID) {
	const projectData = await Project.findByPk(projectID, {
		include: { model: User, as: "members" },
	});
	const projectJSON = JSON.stringify(projectData);
	const project = JSON.parse(projectJSON);
	if (project.members.length >= 5) {
		return true;
	} else {
		return false;
	}
}
