import { DataTypes } from "sequelize";
import db from "../index.js";

const Installation = db.define("Installation", {
	provider: {
		type: DataTypes.STRING,
	},
	installationID: {
		type: DataTypes.BIGINT,
		unique: true,
	},
	refreshToken: {
		type: DataTypes.STRING,
		unique: true,
	},
});

export default Installation;
