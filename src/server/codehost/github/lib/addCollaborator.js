import httpClient from "../httpClient.js";
import closeGitHubIssue from "./closeGitHubIssue.js";

export default async function addGitHubCollaborator(
	repoName,
	number,
	issueTitle
) {
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];
	const permission = "triage";

	const usernamePattern = /@\w+/;

	const match = issueTitle.match(usernamePattern);

	let username = match ? match[0] : null;

	const { client, jwtToken } = await httpClient(repoName);

	const { status, data } = await client.request(
		`PUT /repos/${repoName}/collaborators/${username.slice(1)}`,
		{
			owner: owner,
			repo: repo,
			username: username.slice(1),
			permission: permission,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);

	await closeGitHubIssue(repoName, number, "completed");

	return { issueStatus, issueData };
}
