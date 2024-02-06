import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Project = db.define("Project", {
	owner: {
		type: DataTypes.INTEGER,
	},
	title: {
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
	},
	connected: {
		type: DataTypes.BOOLEAN,
	},
	live: {
		type: DataTypes.BOOLEAN,
	},
	quorum: {
		type: DataTypes.FLOAT,
	},
	clawback: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	disabled: {
		type: DataTypes.BOOLEAN,
	},
	url: {
		type: DataTypes.STRING,
	},
	public: {
		type: DataTypes.BOOLEAN,
	},
});

export default Project;
