import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Issue = db.define("Issue", {
	title: {
		type: DataTypes.STRING,
	},
	author: {
		type: DataTypes.STRING,
	},
	createdAt: {
		type: DataTypes.STRING,
	},
	number: {
		type: DataTypes.INTEGER,
	},
	description: {
		type: DataTypes.STRING,
	},
	url: {
		type: DataTypes.STRING,
	},
	host: {
		type: DataTypes.STRING,
	},
	hostID: {
		type: DataTypes.BIGINT,
	},
	totalYesVotes: {
		type: DataTypes.INTEGER,
	},
	totalNoVotes: {
		type: DataTypes.INTEGER,
	},
	parentHead: {
		type: DataTypes.STRING,
	},
	head: {
		type: DataTypes.STRING,
	},
	childHead: {
		type: DataTypes.STRING,
	},
});

const action = async (issue) => {
	const project = await issue.getProject();
	console.log("project:", project.id);

	// if (issue.totalYesVotes > issue.quorum) {
	// 	// await merge pr
	// } else if (issue.totalNoVotes > issue.quorum) {
	// 	// await close pr
	// }
};

Issue.afterUpdate(action);

export default Issue;
