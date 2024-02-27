import "dotenv/config";
import { App } from "octokit";
import fs from "fs";
import express from "express";

const router = express.Router();

const {
  GITHUB_APP_PRIVATE_KEY = 1,
  GITHUB_APP_ID,
  GITHUB_APP_WEBHOOK_SECRET,
} = process.env;

const privateKey = GITHUB_APP_PRIVATE_KEY;

// Create a authenticated as a GitHub App
const gitHubApp = new App({
  appId: GITHUB_APP_ID,
  privateKey,
  webhooks: {
    secret: GITHUB_APP_WEBHOOK_SECRET,
  },
});

router.post("/repos", async (_req, res) => {
  const { installationID } = _req.body;
  const client = await gitHubApp.getInstallationOctokit(installationID);
  try {
    const { data, status } = await client.request(
      "GET /installation/repositories"
    );
    console.log(data.repositories);
    return res.send({ status, repos: data.repositories });
  } catch (error) {
    return res.send({ status: 500, data: error.message });
  }
});
export default router;
