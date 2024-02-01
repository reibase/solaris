import { Sequelize, DataTypes } from "sequelize";
import db from '../index.js'

const User = db.define("User", {
	firstName: {
		type: DataTypes.STRING,
	},
	lastName: {
		type: DataTypes.STRING,
	},
	username: {
		type: DataTypes.STRING,
		unique: true,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
	},
	verifiedThru: {
		type: DataTypes.STRING,
	},
	gitHubID: {
		type: DataTypes.BIGINT,
		unique: true,
	},
	gitLabID: {
		type: DataTypes.STRING,
		unique: true,
	},
	avatar: {
		type: DataTypes.STRING,
	},
});

export default User