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

const getInstallationRepos = async (installationID) => {
	const client = await gitHubApp.getInstallationOctokit(installationID);
	try {
		const { data, status } = await client.request(
			"GET /installation/repositories"
		);
		return { status, data: data.repositories };
	} catch (error) {
		return { status: 500, data: error.message };
	}
};
export default getInstallationRepos;
