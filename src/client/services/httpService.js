import apiClient from "./apiClient";

class HttpService {
	getUser = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID } = args;
		try {
			const { data } = await apiClient.get(`/users/${userID}`).then((res) => {
				return res;
			});
			return data;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	getAuth = async () => {
		try {
			const { data } = await apiClient.get("/auth/me").then((res) => {
				return res;
			});
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	createInstallation = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID, provider, installationID } = args;
		if (!provider || !installationID) return;
		try {
			const { data } = await apiClient
				.post(`/users/${userID}/installations`, {
					provider: provider,
					installationID: installationID,
				})
				.then((res) => {
					window.location.href = window.location.href.split("?")[0];
					return res;
				});
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	getUserProjects = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID } = args;
		try {
			const { data } = await apiClient
				.get(`/users/${userID}/projects`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	getUserProject = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID, projectID } = args;
		try {
			const { data } = await apiClient
				.get(`/users/${userID}/projects/${projectID}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	getIssue = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID, projectID, issueID } = args;
		try {
			const { data } = await apiClient
				.get(`/users/${userID}/projects/${projectID}/issues/${issueID}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	getMergeableStatus = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID, projectID, issueID } = args;
		try {
			const { data } = await apiClient
				.get(
					`/users/${userID}/projects/${projectID}/issues/${issueID}/mergeable`
				)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	postVote = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { projectID, issueID, userID, side, setVoting } = args;
		try {
			const data = await apiClient
				.post(`/projects/${projectID}/issues/${issueID}/vote`, {
					user: userID,
					side: side,
				})
				.then(({ data }) => {
					return data;
				})
				.catch((err) => err.message);
			setVoting(false);
			return data;
		} catch (error) {
			setVoting(false);
			console.log(error);
		}
	};
	createCheckoutSession = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID, plan, mode, setClicked } = args;
		try {
			const data = await apiClient
				.post(`/create-checkout-session`, {
					userID: userID,
					plan: plan,
					mode: mode,
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					window.location.href = res.data.url;
					return res;
				})
				.catch((err) => err.message);
			setClicked(false);
			return { status: 200 };
		} catch (error) {
			setClicked(false);
			console.log(error);
		}
	};
	billingPortalSession = async ({ queryKey }) => {
		const [_, args] = queryKey;
		const { userID } = args;
		try {
			const data = await apiClient
				.post(`/billing-portal-session`, {
					userID: userID,
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					window.location.href = res.data.url;
					return res;
				})
				.catch((err) => err.message);
			setClicked(false);
			return { status: 200 };
		} catch (error) {
			setClicked(false);
		}
	};
	deleteProject = async (userID, projectID) => {
		try {
			const { data } = await apiClient
				.delete(`/users/${userID}/projects/${projectID}`)
				.then((res) => res);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	deleteUser = async (args) => {
		try {
			const { userID } = args;
			const { data } = await apiClient
				.delete(`/users/${userID}`)
				.then((res) => {
					localStorage.removeItem("solarisStorage");
					window.location.href = res.data.url;
					return res;
				});
			return data;
		} catch (error) {
			console.log(error);
		}
	};
}
const httpService = () => new HttpService();

export default httpService;
