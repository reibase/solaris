import httpClient from "../httpClient.js";

export default async function mergeGitHubPullRequest(org, username, role) {
	const { client, jwtToken } = await httpClient(org);

	const { status, data } = await client.request(
		`PUT /orgs/${org}/memberships/${username}`,
		{
			org: org,
			username: username,
			role: role,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	return { status, data };
}
