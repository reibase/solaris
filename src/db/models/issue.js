import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Issue = db.define("Issue", {
	title: {
		type: DataTypes.STRING,
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
	title: {
		type: DataTypes.STRING,
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

export default Issue;
