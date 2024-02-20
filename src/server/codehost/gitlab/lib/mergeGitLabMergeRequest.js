import axios from "axios";

import { Installation } from "../../../../db/models/index.js";
import httpClient from "../httpClient.js";

export default async function mergeGitLabMergeRequest(
	projectID,
	mergeRequestIID,
	ownerID,
	mergeCommitMessage = "contributors to this repo have voted in favor of merging this branch head via solaris"
) {
	const installation = await Installation.findOne({
		where: { UserId: ownerID, provider: "gitlab" },
	});
	const refreshToken = installation.refreshToken;
	const access_token = await httpClient(refreshToken);

	console.log("access_token", access_token);

	const { status, data } = await axios.put(
		`https://gitlab.com/api/v4/projects/${projectID}/merge_requests/${mergeRequestIID}/merge`,
		{
			merge_commit_message: mergeCommitMessage,
			headers: { Authorization: `Bearer ${access_token}` },
		}
	);
	console.log({ status, data });
	return { status, data };
}
// mergeGitLabMergeRequest(54983319, 1, 1);
