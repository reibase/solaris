import httpClient from "../httpClient.js";

export default async function closeGitHubPullRequest(repoName, pull) {
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];
	const { client, jwtToken } = await httpClient(repoName);

	const { status, data } = await client.request(
		`PATCH /repos/${repoName}/pulls/${pull}`,
		{
			owner: owner,
			repo: repo,
			pull_number: pull,
			state: "closed",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	return { status, data };
}
