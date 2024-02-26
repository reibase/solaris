import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Issue = db.define("Issue", {
	title: {
		type: DataTypes.STRING,
	},
	author: {
		type: DataTypes.STRING,
	},
	state: {
		type: DataTypes.STRING,
	},
	mergeable: {
		type: DataTypes.BOOLEAN,
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
	ref: {
		type: DataTypes.STRING,
	},
	baseRef: {
		type: DataTypes.STRING,
	},
	conflict: {
		type: DataTypes.BOOLEAN,
	},
	base: {
		type: DataTypes.STRING,
	},
	repoID: {
		type: DataTypes.BIGINT,
	},
	closedAt: {
		type: DataTypes.STRING,
	},
	mergedAt: {
		type: DataTypes.STRING,
	},
	merged: {
		type: DataTypes.BOOLEAN,
	},
});

export default Issue;
