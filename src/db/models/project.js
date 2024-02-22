import { Sequelize, DataTypes } from "sequelize";
import { Transfer } from "../models/index.js";

import db from "../index.js";

const Project = db.define("Project", {
	owner: {
		type: DataTypes.INTEGER,
	},
	title: {
		type: DataTypes.STRING,
	},
	installationID: {
		type: DataTypes.STRING,
	},
	description: {
		type: DataTypes.STRING,
	},
	host: {
		type: DataTypes.STRING,
	},
	identifier: {
		type: DataTypes.STRING,
	},
	hostID: {
		type: DataTypes.BIGINT,
		unique: true,
	},
	connected: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	live: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	quorum: {
		type: DataTypes.FLOAT,
	},
	clawback: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	disabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	url: {
		type: DataTypes.STRING,
	},
	isPrivate: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	creditAmount: {
		type: DataTypes.INTEGER,
		defaultValue: 100,
	},
});

export default Project;
