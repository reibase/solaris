import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import ExternalLink from "../../assets/ExternalLink.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import { useStore } from "../../store.js";
import ProgressBar from "../Projects/ProgressBar.jsx";
import { getDurationSince, formatDate } from "./formatting.js";
import ProjectHeading from "./ProjectHeading.jsx";
import socket from "../../socket.js";

export default function Votes() {
	const [voting, setVoting] = useState(false);
	const { dark, user } = useStore();
	let { id, issueID } = useParams();
	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};

	const getProject = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects/${id}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const getIssue = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects/${id}/issues/${issueID}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { data: project, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	const {
		data: issue,
		isFetching: isFetchingIssue,
		refetch,
	} = useQuery({
		queryKey: ["issue"],
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
			socket.emit("vote cast", project?.id);
			setVoting(false);
			return data;
		} catch (error) {
			setVoting(false);
			console.log(error);
		}
	};

	socket.on("vote received", (projectID) => {
		if (projectID === project?.id) {
			refetch();
		}
	});

	const chosenSide = issue?.user.side === true ? "yes" : "no";

	if (isFetching) {
		return "Loading";
	}
	console.log(issue);
	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading project={project} />

			<div className="p-4 block w-full h-full shadow-lg rounded-lg text-sm flex flex-col md:flex-row items-start bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] lg:justify-between overflow-auto">
				<div className="flex h-content w-full lg:w-1/3 lg:h-full flex-col gap-6">
					<div className="flex flex-col">
						<span className="text-lg text-[#313131] dark:text-[#8B929F]">
							#{issue?.number} {issue?.title}
						</span>
						<span className="text-gray-600 dark:text-[#8B929F] mt-1">
							Created on {formatDate(issue?.createdAt.slice(0, 10))} by{" "}
							{issue?.author}
						</span>
						<a href={issue?.url} target="_blank" className="cursor-pointer">
							<div className="flex border border-[#8D4D4D4] my-3 dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-full justify-between items-center">
								<div className="flex gap-[10px]">
									<img className="w-[14px]" src={icon[project?.host]} />
									<span className="dark:text-[#8B929F] text-[11px] text-left truncate overflow-hidden">
										View #{issue?.number} {issue?.title} on {project?.host}
									</span>
								</div>
								<img src={dark ? darkExternalLink : ExternalLink} />
							</div>
						</a>
					</div>

					<div className="flex self-center justify-center w-full flex-col items-center mb-6">
						<span className="font-medium my-4 text-black dark:text-white">
							{issue?.user.voted
								? `You voted ${chosenSide} on ${issue?.user.createdAt.slice(
										0,
										10
								  )}`
								: "Vote yes to merge or vote No to close this pull request."}
						</span>
						<div className="flex w-full flex-row mb-4 items-center justify-center gap-[15px]">
							{voting ? (
								"Loading"
							) : (
								<>
									<button
										onClick={() => postVote(true)}
										className="bg-[#20B176] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
										disabled={issue?.user.voted}
									>
										VOTE YES
									</button>
									<button
										onClick={() => postVote(false)}
										className="bg-[#DC2626] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white disabled:opacity-50"
										disabled={issue?.user.voted}
									>
										VOTE NO
									</button>
								</>
							)}
						</div>
					</div>
					<div className="p-4 w-full hidden md:flex md:flex-col rounded-lg bg-[#f8f8f9] dark:bg-[#171D2B] border border-1 border-[#D9D9D9] dark:border-[#373D47]">
						<p className="text-[#919190] text-[10px]">
							Your amount of credits will be applied to the side you select.
							When that side reaches a majority the pull request will be either
							merged or closed automatically.
						</p>
						<p className="text-[#919190] text-[10px]">
							You may only vote once per pull request. It can not be undone.
						</p>
					</div>
				</div>

				<div className="flex h-content w-full lg:px-10 lg:w-2/3 flex-col gap-[5px] text-[#8B929F]">
					<span>Voting Activity</span>
					<ProgressBar
						quorum={project?.quorum}
						totalYesVotes={issue?.voteData.totalYesVotes}
						totalNoVotes={issue?.voteData.totalNoVotes}
						yesPercent={issue?.voteData.totalYesPercent}
						noPercent={issue?.voteData.totalNoPercent}
						votesView={true}
					/>
					<div className="w-full">
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
						{issue?.voteData?.votes.length > 0 &&
							issue?.voteData.votes.map((vote, index) => (
								<div
									key={index}
									class={` p-[1px] grid grid-cols-4 ${
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
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
