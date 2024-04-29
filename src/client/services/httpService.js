import apiClient from "./apiClient";

class HttpService {
	getUserProjects = async ({ queryKey }) => {
		const [_, userID] = queryKey;
		try {
			const { data } = await apiClient
				.get(`/users/${userID}/projects`)
				.then(({ data }) => data);
			console.log(data);
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
			console.log("data", data);
			return data;
		} catch (error) {
			console.log(error);
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
}

const httpService = () => new HttpService();

export default httpService;
