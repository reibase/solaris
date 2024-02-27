import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Vote = db.define("Vote", {
	side: {
		type: DataTypes.BOOLEAN,
	},
	username: {
		type: DataTypes.STRING,
	},
	amount: {
		type: DataTypes.INTEGER,
	},
});

export default Vote;
