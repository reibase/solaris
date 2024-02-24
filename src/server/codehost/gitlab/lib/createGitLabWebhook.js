import axios from "axios";
import "dotenv/config";

import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";

export default async function createGitLabWebhook(projectID, ownerID) {
	const { NODE_ENV } = process.env;

	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);

	const { status, data } = await axios.get(
		`https://gitlab.com/api/v4/projects/${projectID}/hooks`,
		{
			// url:
			// 	NODE_ENV === "development"
			// 		? "http://localhost:3001/api/webhooks/gitlab"
			// 		: "https://seashell-app-fs86p.ondigitalocean.app/api/webhooks/gitlab",
			// merge_request_events: true,
			headers: { Authorization: `Bearer ${access_token}` },
		}
	);
	console.log({ status, data });
	return { status, data };
}
