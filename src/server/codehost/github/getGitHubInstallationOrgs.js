import "dotenv/config";
import { App, Octokit } from "octokit";
import jwt from "jsonwebtoken";
import fs from "fs";

const {
	GITHUB_ORG_APP_PRIVATE_KEY,
	GITHUB_ORG_APP_ID,
	GITHUB_ORG_APP_WEBHOOK_SECRET,
} = process.env;

const privateKey = GITHUB_ORG_APP_PRIVATE_KEY;

// Create a authenticated as a GitHub App
const gitHubApp = new App({
	appId: GITHUB_ORG_APP_ID,
	privateKey,
	webhooks: {
		secret: GITHUB_ORG_APP_WEBHOOK_SECRET,
	},
});

const getInstallationOrgs = async (installationID) => {
	const client = await gitHubApp.getInstallationOctokit(installationID);
	try {
		const { data, status } = await client.request(
			`GET /app/installations/${installationID}`,
			{
				installation_id: installationID,
			}
		);
		console.log("data", data?.account);

		return {
			status,
			installationID: installationID,
			org: data?.account,
		};
	} catch (error) {
		console.log("error", error);
		return { status: 500, data: error.message };
	}
};
export default getInstallationOrgs;