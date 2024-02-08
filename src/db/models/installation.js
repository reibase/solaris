import { DataTypes } from "sequelize";
import db from "../index.js";

const Installation = db.define("Installation", {
	provider: {
		type: DataTypes.STRING,
	},
	installationID: {
		type: DataTypes.STRING,
		unique: true,
	},
});

export default Installation;
