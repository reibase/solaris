import "dotenv/config";
import { App, Octokit } from "octokit";
import jwt from "jsonwebtoken";
import fs from "fs";

const {
	GITHUB_APP_PRIVATE_KEY_PATH,
	GITHUB_APP_ID,
	GITHUB_APP_WEBHOOK_SECRET,
} = process.env;

const privateKey = fs.readFileSync(GITHUB_APP_PRIVATE_KEY_PATH, "utf8");

// Create a authenticated as a GitHub App
const gitHubApp = new App({
	appId: GITHUB_APP_ID,
	privateKey,
	webhooks: {
		secret: GITHUB_APP_WEBHOOK_SECRET,
	},
});

/*
Create access token with JWT and our GitHub App's ID to query the /installation endpoint
and receive an authenticated client for this repo's installation instance.
*/

const httpClient = async (repoName) => {
	const payload = {
		// issued at time, 60 seconds in the past to allow for clock drift
		iat: Math.floor(Date.now() / 1000) - 60,
		// JWT expiration time (10 minute maximum)
		exp: Math.floor(Date.now() / 1000) + 10 * 60,
		iss: GITHUB_APP_ID,
	};

	const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

	const { data } = await gitHubApp.octokit.request(
		`/repos/${repoName}/installation`,
		{
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	const installationId = data.id;

	// Returns an authenticated client instance for this repository:
	const client = await gitHubApp.getInstallationOctokit(installationId);
	return { client, jwtToken };
};
export default httpClient;
