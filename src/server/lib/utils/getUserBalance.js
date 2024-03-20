import { Transfer } from "../../../db/models/index.js";
import { Op } from "sequelize";

const getUserBalance = async (userID, projectID) => {
	const transfersData = await Transfer.findAll({
		where: {
			[Op.or]: [{ recipient: userID }, { sender: userID }],
			ProjectId: projectID,
		},
	});
	const transfersJson = JSON.stringify(transfersData);
	const transfers = JSON.parse(transfersJson);

	let balance = transfers.reduce((accum, cur) => {
		console.log(cur);
		if (cur.recipient === userID) {
			accum = accum + cur.amount;
		} else if (cur.sender === userID) {
			accum = accum - cur.amount;
		}
		return accum;
	}, 0);

	return balance;
};
export default getUserBalance;
