import { Project, Issue, Vote } from "../../../db/models/index.js";
import mergeGitHubPullRequest from "../../codehost/github/lib/mergeGitHubPullRequest.js";
import closeGitHubPullRequest from "../../codehost/github/lib/closeGitHubPullRequest.js";
import mergeGitLabMergeRequest from "../../codehost/gitlab/lib/mergeGitLabMergeRequest.js";
import closeGitLabMergeRequest from "../../codehost/gitlab/lib/closeGitLabMergeRequest.js";
import addGitHubCollaborator from "../../codehost/github/lib/addCollaborator.js";

export default async function tabulateVotes(projectID, issueID) {
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
	const votesData = await issue.getVotes();
	const votesJson = JSON.stringify(votesData);
	const votes = JSON.parse(votesJson);

	let yesTotals = 0;
	let noTotals = 0;

	votes.map((vote) => {
		if (vote.side) {
			yesTotals += vote.amount;
		} else if (!vote.side) {
			noTotals += vote.amount;
		}
	});

	await Issue.update(
		{
			totalYesVotes: yesTotals,
			totalNoVotes: noTotals,
		},
		{ where: { ProjectId: projectID, id: issueID } }
	);

	if (yesTotals >= project.quorum) {
		if (project.live) {
			if (project.host === "github") {
				if (issue.type === "pullRequest") {
					await mergeGitHubPullRequest(project.identifier, issue.number);
				} else if (issue.type === "addCollaborator") {
					await addGitHubCollaborator(
						project.identifier,
						issue.number,
						issue.title
					);
				}
			} else if (project.host === "gitlab") {
				if (issue.type === "pullRequest") {
					await mergeGitLabMergeRequest(
						project.hostID,
						issue.number,
						project.owner
					);
				} else if (issue.type === "addCollaborator") {
					// Make collaborator calls for GitLab
				}
			}
		} else {
			/* Artificially merge for testing purposes if the project's mode is set to 'demo': */
			await Issue.update(
				{
					state: "closed",
					mergedAt: Date.now(),
					merged: true,
					mergeable: false,
				},
				{
					where: { ProjectId: projectID, id: issueID },
				}
			);
		}
	} else if (noTotals >= project.quorum) {
		if (project.live) {
			if (project.host === "github") {
				if (issue.type === "pullRequest") {
					await closeGitHubPullRequest(project.identifier, issue.number);
				} else if (issue.type === "addCollaborator") {
					await closeGitHubIssue(project.identifier, issue.number);
				}
			} else if (project.host === "gitlab") {
				await closeGitLabMergeRequest(
					project.hostID,
					issue.number,
					project.owner
				);
			}
		} else {
			await Issue.update(
				{
					state: "closed",
					closedAt: Date.now(),
					mergeable: false,
					merged: false,
				},
				{
					where: { ProjectId: projectID, id: issueID },
				}
			);
		}
	}
}
