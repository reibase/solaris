import Sequelize from "sequelize";
import "dotenv/config";

const config =
	process.env.NODE_ENV === "production"
		? {
				logging: false,
				dialect: "postgres",
				dialectOptions: {
					ssl: {
						require: true,
					},
				},
		  }
		: {
				logging: false,
		  };

const db = new Sequelize(process.env.DB_URL, config);

export default db;
