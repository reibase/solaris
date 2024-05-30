import httpClient from "../httpClient.js";

export default async function closeGitHubIssue(repoName, number, reason) {
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];

	const { client, jwtToken } = await httpClient(repoName);

	const { status: issueStatus, data: issueData } = await client.request(
		`PATCH /repos/${owner}/${repo}/issues/${number}`,
		{
			owner: owner,
			repo: repo,
			issue_number: number,
			state: "closed",
			state_reason: reason,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);

	return { issueStatus, issueData };
}
