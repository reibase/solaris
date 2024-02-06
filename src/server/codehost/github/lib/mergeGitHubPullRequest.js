import httpClient from "../httpClient";

export default async function mergeGitHubPullRequest(
	repoName,
	pull,
	commitTitle = "merged via solaris",
	commitMessage = "contributors to this repo have voted in favor of merging this branch head"
) {
	const owner = repoName.split["/"][0];
	const repo = repoName.split["/"][1];
	const client = await httpClient(repoName);
	const { status, data } = await client.request(
		`PUT /repos/${repoName}/pulls/${pull}/merge`,
		{
			owner: owner,
			repo: repo,
			pull_number: pull,
			commit_title: commitTitle,
			commit_message: commitMessage,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	return { status, data };
}
