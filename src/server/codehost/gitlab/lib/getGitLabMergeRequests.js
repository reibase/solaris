import axios from "axios";
import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";
import url from "url";

export default async function getGitLabMergeRequests(projectID, ownerID) {
	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);
	const body = {
		access_token: access_token,
	};
	const params = new url.URLSearchParams(body);

	const { status, data } = await axios.get(
		`https://gitlab.com/api/v4/projects/${projectID}/merge_requests`,
		{ headers: { Authorization: `Bearer ${access_token}` } }
	);
	return { status, data };
}
