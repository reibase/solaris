import httpClient from "../httpClient.js";

export default async function addGitHubCollaborator(repoName) {
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];
	const { client, jwtToken } = await httpClient(repoName);

	const { status, data } = await client.request(
		`POST /repos/${owner}/${repo}/labels`,
		{
			owner: owner,
			repo: repo,
			name: "vote",
			description: "Enable voting on Solaris (https://solaris.reibase.rs)",
			color: "FAFF00",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	return { status, data };
}
