import { Sequelize, DataTypes } from "sequelize";
import db from "../index.js";

const Vote = db.define("Vote", {
	side: {
		type: DataTypes.BOOLEAN,
	},
	amount: {
		type: DataTypes.INTEGER,
	},
});

export default Vote;
