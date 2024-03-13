import axios from "axios";
import url from "url";

import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";

export default async function mergeGitLabMergeRequest(
	projectID,
	number,
	ownerID
) {
	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);

	const body = {
		id: projectID,
		merge_request_iid: number,
		access_token: access_token,
	};

	const params = new url.URLSearchParams(body);

	const { status, data } = await axios.put(
		`https://gitlab.com/api/v4/projects/${projectID}/merge_requests/${number}/merge`,
		params.toString()
	);
	return { status, data };
}
