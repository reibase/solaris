import "dotenv/config";
import axios from "axios";
const { GITLAB_APP_CLIENT_ID, GITLAB_APP_CLIENT_SECRET } = process.env;
import url from "url";
import { Installation } from "../../../db/models/index.js";

const httpClient = async (refreshToken) => {
	const body = {
		grant_type: "refresh_token",
		client_id: GITLAB_APP_CLIENT_ID,
		client_secret: GITLAB_APP_CLIENT_SECRET,
		refresh_token: refreshToken,
		redirect_uri: GITLAB_APP_REDIRECT_URI || "http://localhost:3001/create",
	};

	const params = new url.URLSearchParams(body);

	const { data } = await axios
		.post(`https://gitlab.com/oauth/token`, params.toString())
		.then((res) => {
			return res;
		})
		.catch((err) => {
			console.log("refresh token error:", err.code);
			return err.code;
		});

	const access_token = data.access_token;

	// Update refresh token in db for future reference
	try {
		await Installation.update(
			{
				refreshToken: data.refresh_token,
			},
			{ where: { refreshToken: refreshToken } }
		);
	} catch (error) {
		console.log(error.message);
	}

	return access_token;
};

export default httpClient;
