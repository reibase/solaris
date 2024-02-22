import httpClient from "../httpClient.js";

export default async function getGitHubPullRequests(repoName, state = "all") {
	const { client, jwtToken } = await httpClient(repoName);

	const { status, data } = await client.request(
		`GET /repos/${repoName}/pulls`,
		{
			state: state,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	return { status, data };
}
