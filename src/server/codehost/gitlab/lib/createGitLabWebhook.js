import axios from "axios";
import "dotenv/config";
import url from "url";

import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";

export default async function createGitLabWebhook(projectID, ownerID) {
	const { NODE_ENV } = process.env;

	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);

	const body = {
		id: projectID,
		url:
			NODE_ENV === "development"
				? "https://smee.io/HXzpMdreQh578AmR"
				: "https://solaris.reibase.rs/api/webhooks/gitlab",
		merge_requests_events: true,
		access_token: access_token,
	};

	const params = new url.URLSearchParams(body);

	const { status, data } = await axios.post(
		`https://gitlab.com/api/v4/projects/${projectID}/hooks`,
		params.toString()
	);
	return { status, data };
}
