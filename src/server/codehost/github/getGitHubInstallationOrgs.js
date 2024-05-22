import "dotenv/config";
import { App } from "octokit";

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

const getInstallationOrgs = async (installationID) => {
	const client = await gitHubApp.getInstallationOctokit(installationID);
	try {
		const { data, status } = await client.request("GET /installation/orgs");
		const orgs = data.orgs.map((org) => {
			org.installationID = installationID;
			return org;
		});
		return {
			status,
			installationID: installationID,
			organizations: orgs,
		};
	} catch (error) {
		return { status: 500, data: error.message };
	}
};
export default getInstallationOrgs;
