import httpClient from "../httpClient";

export default async function mergeGitHubPullRequest(
	projectID,
	mergeRequestIID,
	mergeCommitMessage = "contributors to this repo have voted in favor of merging this branch head via solaris",
	refreshToken
) {
	const access_token = await httpClient(refreshToken);

	const { status, data } = await client.request(
		`PUT /projects/${projectID}/merge_requests/${mergeRequestIID}/merge`,
		{
			merge_commit_message: mergeCommitMessage,
			headers: { Authorization: `Bearer ${access_token}` },
		}
	);
	return { status, data };
}
