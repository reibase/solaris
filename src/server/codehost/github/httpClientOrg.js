import "dotenv/config";
import { App } from "octokit";
import jwt from "jsonwebtoken";

const { GITHUB_APP_PRIVATE_KEY, GITHUB_APP_ID, GITHUB_APP_WEBHOOK_SECRET } =
	process.env;

const privateKey = GITHUB_APP_PRIVATE_KEY;

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
and receive an authenticated client for this org's installation instance.
*/

const httpClientOrg = async (org) => {
	const payload = {
		// issued at time, 60 seconds in the past to allow for clock drift
		iat: Math.floor(Date.now() / 1000) - 60,
		// JWT expiration time (10 minute maximum)
		exp: Math.floor(Date.now() / 1000) + 10 * 60,
		iss: GITHUB_APP_ID,
	};
	const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

	const { data } = await gitHubApp.octokit.request(
		`/orgs/${org}/installation`,
		{
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${jwtToken}`,
			},
		}
	);
	const installationID = data.id;

	// Returns an authenticated client instance for this repository:
	const client = await gitHubApp.getInstallationOctokit(installationID);

	return { client, jwtToken };
};
export default httpClientOrg;
