import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import { useStore } from "../../store.js";
import ProgressBar from "../Projects/ProgressBar.jsx";
import { getDurationSince, formatDate } from "./formatting.js";
import ProjectHeading from "./ProjectHeading.jsx";
import socket from "../../socket.js";
import CodeHostLink from "./CodeHostLink.jsx";
import httpService from "../../services/httpService.js";

export default function Votes() {
	const { getIssue, getMergeableStatus, postVote } = httpService();
	const [voting, setVoting] = useState(false);
	const side = useRef(null);
	const { user, currentProject } = useStore();
	let { issueID, projectID } = useParams();

	const { data: mergeable, isFetching: isFetchingMergeableStatus } = useQuery({
		queryKey: [
			"mergeable",
			{ userID: user?.id, projectID: projectID, issueID: issueID },
		],
		queryFn: getMergeableStatus,
	});

	const {
		data: issue,
		isFetching: isFetchingIssue,
		refetch: refetchIssue,
	} = useQuery({
		queryKey: [
			"issue",
			{ userID: user?.id, projectID: projectID, issueID: issueID },
		],
		queryFn: getIssue,
	});

	const {
		data: votingData,
		isFetching: isVoting,
		isFetched: voteCast,
	} = useQuery({
		queryKey: [
			"vote",
			{
				userID: user?.id,
				projectID: projectID,
				issueID: issueID,
				side: side.current,
				setVoting: setVoting,
			},
		],
		queryFn: postVote,
		enabled: voting,
		manual: true,
	});

	const voteHandler = async (chosenSide) => {
		side.current = chosenSide;
		setVoting(true);
	};

	useEffect(() => {
		if (voteCast) {
			socket.emit("vote cast", projectID);
		}
	}, [voteCast]);

	socket.on("vote received", (projectID) => {
		if (projectID === projectID) {
			refetchIssue();
		}
	});

	const chosenSide = issue?.user.side === true ? "yes" : "no";

	const text = issue?.user.voted
		? `You voted ${chosenSide} on ${issue?.user?.createdAt.slice(0, 10)}`
		: !mergeable
		? "This pull request is not voteable."
		: "Vote yes to merge or vote no to close this pull request.";

	const disabled = !mergeable ? true : issue?.user.voted ? true : false;

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading />
			{!issue?.title ? (
				<div className="p-4 block w-full h-full shadow-lg rounded-lg text-sm bg-white/90 dark:bg-mid-gray border border-transparent border-1 dark:border-dark-gray">
					Loading
				</div>
			) : (
				<div className="p-4 block w-full h-full shadow-lg gap-10 rounded-lg text-sm flex flex-col md:flex-row items-start bg-white/90 dark:bg-mid-gray border border-transparent border-1 dark:border-dark-gray lg:justify-between overflow-auto">
					<div className="flex h-content w-full lg:w-[300px] lg:h-full flex-col gap-6">
						<div className="flex flex-col">
							<span className="text-[16px] dark:text-white mb-2">
								#{issue?.number} {issue?.title}
							</span>
							<span className="text-gray-600 mb-2 text-[11px] dark:text-slate-gray">
								Created on {formatDate(issue?.createdAt?.slice(0, 10))} by{" "}
								{issue?.author}
							</span>
							<CodeHostLink
								url={issue?.url}
								host={currentProject?.host}
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
											onClick={() => voteHandler(true)}
											className="bg-[#20B176] font-semibold uppercase text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
											disabled={disabled}
										>
											Vote Yes
										</button>
										<button
											onClick={() => voteHandler(false)}
											className="bg-[#DC2626] font-semibold uppercase text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
											disabled={disabled}
										>
											Vote No
										</button>
									</>
								)}
							</div>
						</div>

						<div className="p-4 w-full hidden md:flex md:flex-col rounded-lg bg-off-white dark:bg-midnight border border-1 border-transparent dark:border-dark-gray">
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

					<div className="flex h-content w-full flex-col text-slate-gray">
						<ProgressBar
							quorum={currentProject?.quorum}
							totalYesVotes={issue?.voteData.totalYesVotes}
							totalNoVotes={issue?.voteData.totalNoVotes}
							yesPercent={issue?.voteData.totalYesPercent}
							noPercent={issue?.voteData.totalNoPercent}
							votesView={true}
						/>
						<div className="w-full mt-4">
							<div className=" grid grid-cols-4">
								<div className="text-center ">
									<p className="dark:text-slate-gray text-[10px]">User</p>
								</div>
								<div className=" text-center ">
									<p className="dark:text-slate-gray text-[10px]">Side</p>
								</div>
								<div className="text-center">
									<p className="dark:text-slate-gray text-[10px]">Amount</p>
								</div>
								<div className="text-center  ">
									<p className="dark:text-slate-gray text-[10px]">Age</p>
								</div>
							</div>
							{issue?.voteData?.votes.length > 0 ? (
								issue?.voteData.votes.map((vote, index) => (
									<div
										key={index}
										className={` p-[1px] grid grid-cols-4 ${
											index % 2 == 0 ? "bg-off-white dark:bg-midnight" : null
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
