import "dotenv/config";
import { App, Octokit } from "octokit";
import jwt from "jsonwebtoken";
import fs from "fs";

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

const getInstallationRepos = async (installationID) => {
	const client = await gitHubApp.getInstallationOctokit(installationID);
	try {
		const { data, status } = await client.request(
			"GET /installation/repositories"
		);
		const repos = data.repositories.map((repo) => {
			repo.installationID = installationID;
			return repo;
		});
		return {
			status,
			installationID: installationID,
			repositories: repos,
		};
	} catch (error) {
		return { status: 500, data: error.message };
	}
};
export default getInstallationRepos;
