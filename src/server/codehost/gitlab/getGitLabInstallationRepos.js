import "dotenv/config";
import axios from "axios";
import httpClient from "./httpClient.js";

const getGitLabInstallationRepos = async (code) => {
	const access_token = await httpClient(code);

	const getGroups = async () => {
		const { data } = await axios
			.get(`https://gitlab.com/api/v4/groups`, {
				headers: { Authorization: `Bearer ${access_token}` },
			})
			.then((res) => {
				return res;
			})
			.catch((err) => {
				console.log("error querying gitlab:", err.code);
				return err;
			});
		return data;
	};

	const groups = await getGroups();

	const [projects] = await Promise.all(
		groups.map(
			async (group) =>
				await axios
					.get(`https://gitlab.com/api/v4/groups/${group.id}/projects`, {
						headers: { Authorization: `Bearer ${access_token}` },
					})
					.then((res) => {
						return res.data;
					})
					.catch((err) => {
						console.log("error querying gitlab:", err.code);
						return err;
					})
		)
	);

	return [{ status: 200, repositories: projects }];
};

export default getGitLabInstallationRepos;
