import httpClient from "../httpClient.js";

export default async function addGitHubCollaborator(
	repoName,
	number,
	issueTitle
) {
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];
	// hard code to triage for now
	const permission = "triage";
	// search for @ in issueTitle
	const username = "";
	const { client, jwtToken } = await httpClient(repoName);

	const { status, data } = await client.request(
		`PUT /repos/${repoName}/collaborators/${username}`,
		{
			owner: owner,
			repo: repo,
			username: username,
			permission: permission,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);

	const { status: issueStatus, data: issueData } = await client.request(
		`PATCH /repos/${owner}/${repo}/issues/${number}`,
		{
			owner: owner,
			repo: repo,
			issue_number: number,
			state: "closed",
			state_reason: "completed",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);

	return { issueStatus, issueData };
}
