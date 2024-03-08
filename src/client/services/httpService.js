import apiClient from "./apiClient";

class HttpService {
	getUserProjects = async ({ queryKey }) => {
		const [_, userID] = queryKey;
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
				.then((res) => res.data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};
}

const httpService = () => new HttpService();

export default httpService;
