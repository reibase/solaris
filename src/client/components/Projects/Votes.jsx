import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { useStore } from "../../store.js";
import ProgressBar from "../Projects/ProgressBar.jsx";
import { getDurationSince, formatDate } from "./formatting.js";
import ProjectHeading from "./ProjectHeading.jsx";
import socket from "../../socket.js";
import CodeHostLink from "./CodeHostLink.jsx";
import httpService from "../../services/httpService.js";

export default function Votes() {
	const { getUserProject, getIssue, getMergeableStatus } = httpService();
	const [voting, setVoting] = useState(false);
	const { user } = useStore();
	let { id, issueID } = useParams();

	const { data: mergeable, isFetching: isFetchingMergeableStatus } = useQuery({
		queryKey: [
			"mergeable",
			{ userID: user?.info.id, projectID: id, issueID: id },
		],
		queryFn: getMergeableStatus,
	});

	const { data: project } = useQuery(
		["project", { userID: user?.info.id, projectID: id }],
		getUserProject
	);

	const {
		data: issue,
		isFetching: isFetchingIssue,
		refetch: refetchIssue,
	} = useQuery({
		queryKey: [
			"issue",
			{ userID: user.info?.id, projectID: id, issueID: issueID },
		],
		queryFn: getIssue,
	});

	const postVote = async (chosenSide) => {
		setVoting(true);
		try {
			const { data, status } = await axios
				.post(
					`/api/projects/${id}/issues/${issueID}/vote`,
					{
						user: user.info.id,
						side: chosenSide,
					},
					{ withCredentials: true }
				)
				.then((res) => res);
			setVoting(false);
			socket.emit("vote cast", project?.id);
			return data;
		} catch (error) {
			setVoting(false);
			console.log(error);
		}
	};

	socket.on("vote received", (projectID) => {
		if (projectID === project?.id) {
			refetchIssue();
		}
	});

	const chosenSide = issue?.user.side === true ? "yes" : "no";

	const text = issue?.user.voted
		? `You voted ${chosenSide} on ${issue?.user.createdAt.slice(0, 10)}`
		: !mergeable
		? "This pull request is not voteable."
		: "Vote yes to merge or vote No to close this pull request.";

	const disabled = !mergeable ? true : issue?.user.voted ? true : false;

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading project={project} />

			{!issue?.title ? (
				<div className="p-4 block w-full h-full shadow-lg rounded-lg text-sm bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
					Loading
				</div>
			) : (
				<div className="p-4 block w-full h-full shadow-lg gap-10 rounded-lg text-sm flex flex-col md:flex-row items-start bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] lg:justify-between overflow-auto">
					<div className="flex h-content w-full lg:w-[300px] lg:h-full flex-col gap-6">
						<div className="flex flex-col">
							<span className="text-[16px] dark:text-white mb-2">
								#{issue?.number} {issue?.title}
							</span>
							<span className="text-gray-600 mb-2 text-[11px] dark:text-[#8B929F]">
								Created on {formatDate(issue?.createdAt.slice(0, 10))} by{" "}
								{issue?.author}
							</span>
							<CodeHostLink
								url={issue?.url}
								host={project?.host}
								text={"#" + " " + issue?.number + " " + issue?.title}
							/>
						</div>

						<div className="flex self-center justify-center w-full flex-col items-center mb-6 w-[300px]">
							<span className="font-medium text-center my-4 text-black dark:text-white">
								{isFetchingMergeableStatus
									? "Checking pull request status"
									: text}
							</span>
							<div className="flex w-full flex-row mb-4 items-center justify-center gap-[15px]">
								{voting ? (
									"Loading"
								) : (
									<>
										<button
											onClick={() => postVote(true)}
											className="bg-[#20B176] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
											disabled={disabled}
										>
											VOTE YES
										</button>
										<button
											onClick={() => postVote(false)}
											className="bg-[#DC2626] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
											disabled={disabled}
										>
											VOTE NO
										</button>
									</>
								)}
							</div>
						</div>

						<div className="p-3 w-full hidden md:flex md:flex-col rounded-lg bg-[#f8f8f9] dark:bg-[#171D2B] border border-1 border-[#D9D9D9] dark:border-[#373D47]">
							<p className="text-slate-600 dark:text-slate-300 text-[11px] mb-1">
								Your amount of credits will be applied to the side you select.
								When a side reaches the minimum number of votes required to end
								voting, the pull request will be either closed or merged
								automatically.
							</p>
							<p className="text-slate-600 dark:text-slate-300 text-[11px]">
								You may only vote once per pull request. It can not be undone.
							</p>
						</div>
					</div>

					<div className="flex h-content w-full flex-col text-[#8B929F]">
						<ProgressBar
							quorum={project?.quorum}
							totalYesVotes={issue?.voteData.totalYesVotes}
							totalNoVotes={issue?.voteData.totalNoVotes}
							yesPercent={issue?.voteData.totalYesPercent}
							noPercent={issue?.voteData.totalNoPercent}
							votesView={true}
						/>
						<div className="w-full mt-4">
							<div className=" grid grid-cols-4">
								<div className="text-center ">
									<p className="dark:text-[#8B929F] text-[10px]">User</p>
								</div>
								<div className=" text-center ">
									<p className="dark:text-[#8B929F] text-[10px]">Side</p>
								</div>
								<div className="text-center">
									<p className="dark:text-[#8B929F] text-[10px]">Amount</p>
								</div>
								<div className="text-center  ">
									<p className="dark:text-[#8B929F] text-[10px]">Age</p>
								</div>
							</div>
							{issue?.voteData?.votes.length > 0 ? (
								issue?.voteData.votes.map((vote, index) => (
									<div
										key={index}
										className={` p-[1px] grid grid-cols-4 ${
											index % 2 == 0 ? "bg-[#F9F9F9] dark:bg-[#171D2B]" : null
										} `}
									>
										<div className="text-center ">
											<p className="dark:text-white text-[10px]">
												{vote?.username}
											</p>
										</div>
										<div className=" text-center ">
											<p
												className={`${
													vote.side ? "text-[#038800]" : "text-[#DC2626]"
												} text-[10px]`}
											>
												{vote.side ? "YES" : "NO"}
											</p>
										</div>
										<div className="text-center">
											<p className="dark:text-white text-[10px]">
												{vote?.amount}
											</p>
										</div>
										<div className="text-center  ">
											<p className="dark:text-white text-[10px]">
												{getDurationSince(vote?.createdAt)}
											</p>
										</div>
									</div>
								))
							) : (
								<span className="block text-slate-400 text-center w-full h-20 mt-10">
									No one has voted on this pull request yet.
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
