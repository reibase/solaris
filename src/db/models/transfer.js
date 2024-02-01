import { Sequelize, DataTypes } from "sequelize";
import db from '../index.js'

const Transfer = db.define("Transfer", {
	sender: {
		type: DataTypes.INTEGER,
	},
	recipient: {
		type: DataTypes.INTEGER,
	},
	amount: {
		type: DataTypes.INTEGER,
	},
	status: {
		type: DataTypes.STRING,
	},
	network: {
		type: DataTypes.STRING,
	},
});

export default Transfer;