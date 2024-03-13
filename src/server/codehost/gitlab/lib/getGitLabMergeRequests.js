import axios from "axios";
import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";

export default async function getGitLabMergeRequests(projectID, ownerID) {
	console.log("called!");
	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);

	const { status, data } = await axios.get(
		`https://gitlab.com/api/v4/projects/${projectID}/merge_requests?state=opened&wip=no`,
		{ headers: { Authorization: `Bearer ${access_token}` } }
	);
	return { status, data };
}
