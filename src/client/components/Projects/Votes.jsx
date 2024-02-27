import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import githubLogo from "../../assets/github.svg";
import githubDarkmode from "../../assets/github-darkmode.svg";
import { useStore } from "../../store.js";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkDataTransfer from "../../assets/darkDataTransfer.svg";
import darkGroup from "../../assets/darkGroup.svg";
import darkSettings from "../../assets/darkSettings.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import Group from "../../assets/Group.svg";
import ProgressBar from "../Projects/ProgressBar.jsx";
import gitlabLogo from "../../assets/gitlab.svg";
import { getDurationSince, formatDate } from "./formatting.js";

export default function Votes() {
	const { dark, user } = useStore();
	let { id, issueID } = useParams();
	const navigate = useNavigate();

	const getProject = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects/${id}/issues/${issueID}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const postVote = async (chosenSide) => {
		try {
			const { data, status } = await axios
				.post(`/api/projects/${id}/issues/${issueID}/vote`, {
					user: user.info.id,
					side: chosenSide,
				})
				.then((res) => res);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { data, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	const icon = {
		github: dark ? githubDarkmode : githubLogo,
		gitlab: gitlabLogo,
	};

	if (isFetching) {
		return "Loading";
	}

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			{/* header */}
			<div className="w-full h-50 items-start justify-start p-4 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] gap-[10px]">
				{/* top row of header */}
				<div className="flex flex-row w-full justify-between">
					{/* top left of header */}
					<div className="flex flex-row items-center gap-[20px]">
						<span className="font-semibold text-lg tracking-wide dark:text-white">
							{data?.project.title}
						</span>
						<span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
							{data?.project.live ? `LIVE` : `TEST`}
						</span>
					</div>
					{/* top right of header */}
					<span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
						{data?.user?.balance} Credits
					</span>
				</div>

				<span className="mt-1 mb-3 text-[#313131] dark:text-[#8B929F]">
					Added on {formatDate(data?.project.createdAt.slice(0, 10))}
				</span>

				{/* bottom row of header  */}
				<div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
					<a href={data?.url} target="_blank">
						<div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
							<div className="flex gap-[10px]">
								<img className="w-[14px]" src={icon[data?.host]} />
								<span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
									{data?.project.identifier} on {data?.project.host}
								</span>
							</div>
							<img src={dark ? darkExternalLink : ExternalLink} />
						</div>
					</a>

					<div className="flex items-center gap-[20px]">
						<div className="flex gap-[7px]">
							<img className="w-[20px]" src={dark ? darkGroup : Group} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Community
							</p>
						</div>
						<div className="flex gap-[7px]">
							<img src={darkDataTransfer} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Transfer
							</p>
						</div>
						<div
							className="flex gap-[7px] cursor-pointer"
							onClick={() => navigate(`/projects/${data?.id}/settings`)}
						>
							<img src={darkSettings} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Settings
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="p-4 block w-full h-full shadow-lg rounded-lg text-sm flex flex-col md:flex-row items-start bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between overflow-auto">
				<div className="flex lg:w-1/3 h-full flex-col gap-6">
					<div className="flex flex-col">
						<span className="text-lg text-[#313131] dark:text-[#8B929F]">
							#{data?.number} {data?.title}
						</span>
						<span className="text-gray-600 dark:text-[#8B929F] mt-1">
							Created on {formatDate(data?.createdAt.slice(0, 10))} by{" "}
							{data?.author}
						</span>
						<div className="mt-4 flex w-full border border-[#919190] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] justify-between items-center gap-[5px]">
							<div className="flex gap-[10px]">
								<img className="w-[14px]" src={icon[data?.host]} />
								<span className="w-full text-ellipsis overflow-hidden text-nowrap dark:text-white">
									{data?.title} on {data?.host}
								</span>
							</div>
							<a href={data?.url}>
								<img src={dark ? darkExternalLink : ExternalLink} />
							</a>
						</div>
					</div>

					<div className="flex w-full flex-col md:gap-[40px] items-center mb-6">
						<p className="font-medium text-[10px] text-black dark:text-white">
							Vote yes to merge or vote No to close this pull request.
						</p>
						<div className="flex w-full flex-row mb-4 justify-center gap-[15px]">
							<button
								onClick={() => postVote(true)}
								className="bg-[#20B176] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white"
							>
								VOTE YES
							</button>
							<button
								onClick={() => postVote(false)}
								className="bg-[#DC2626] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white"
							>
								VOTE NO
							</button>
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
				<div className="flex w-full lg:px-10 lg:w-2/3 flex-col gap-[5px] text-[#8B929F]">
					<span>Voting Activity</span>
					<ProgressBar
						yesPercent={data?.voteData.totalYesPercent}
						noPercent={data?.voteData.totalNoPercent}
						votesView={true}
					/>
					<div className="w-full">
						<div class=" grid grid-cols-4">
							<div class="text-center ">
								<p className="dark:text-[#8B929F] text-[10px]">User</p>
							</div>
							<div class=" text-center ">
								<p className="dark:text-[#8B929F] text-[10px]">Side</p>
							</div>
							<div class="text-center">
								<p className="dark:text-[#8B929F] text-[10px]">Amount</p>
							</div>
							<div class="text-center  ">
								<p className="dark:text-[#8B929F] text-[10px]">Age</p>
							</div>
						</div>
						{data?.voteData?.votes.length > 0 &&
							data?.voteData.votes.map((vote, index) => (
								<div
									key={index}
									class={` p-[1px] grid grid-cols-4 ${
										index % 2 == 0 ? "bg-[#F9F9F9] dark:bg-[#171D2B]" : null
									} `}
								>
									<div class="text-center ">
										<p className="dark:text-white text-[10px]">
											{vote?.UserId}
										</p>
									</div>
									<div class=" text-center ">
										<p
											className={`${
												vote.side ? "text-[#038800]" : "text-[#DC2626]"
											} text-[10px]`}
										>
											{vote.side ? "YES" : "NO"}
										</p>
									</div>
									<div class="text-center">
										<p className="dark:text-white text-[10px]">
											{vote?.amount}
										</p>
									</div>
									<div class="text-center  ">
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
