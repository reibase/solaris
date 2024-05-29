import { Project, Issue, Vote } from "../../../db/models/index.js";
import getGitHubPullRequest from "../../codehost/github/lib/getGitHubPullRequest.js";
import getGitLabMergeRequest from "../../codehost/gitlab/lib/getGitLabMergeRequest.js";

export default async function validateIssue(projectID, issueID) {
	let actionable;

	const project = await Project.findOne({
		where: {
			id: projectID,
		},
	});
	const issue = await Issue.findOne({
		where: {
			ProjectId: projectID,
			id: issueID,
		},
		include: Vote,
	});

	if (issue.type === "addCollaborator") {
		return true;
	}

	if (project.host === "github") {
		const gitHubPullRequest = await getGitHubPullRequest(
			project.identifier,
			issue.number
		);
		actionable = gitHubPullRequest.data.mergeable;
	} else if (project.host === "gitlab") {
		const gitLabMergeRequest = await getGitLabMergeRequest(
			project.hostID,
			issue.number,
			project.owner
		);
		actionable =
			gitLabMergeRequest.data.merge_status === "cannot_be_merged"
				? false
				: true;
	}

	return actionable;
}
