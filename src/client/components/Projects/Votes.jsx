import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
import { Button } from "@mui/material";

export default function Votes() {
	const { dark, user } = useStore();
	let { id, issueID } = useParams();

	const icon = {
		github: dark ? githubDarkmode : githubLogo,
		gitlab: gitlabLogo,
	};

	// const project = {
	// 	userID: 1,
	// 	createdAt: "january 1 2024",
	// 	creditAmount: 10000,
	// 	url: "https://github.com/ramirc5/demo",
	// 	id: 3,
	// 	identifier: "ramirc5/demo",
	// 	live: true,
	// 	quorum: 501,
	// 	updatedAt: "february 2 2024",
	// 	user: {
	// 		balance: 100,
	// 	},
	// 	host: "github",
	// 	title: "ramirc5/demo",
	// 	isPrivate: false,
	// 	installationID: "1231234",
	// 	description: "its just a demo",
	// 	issues: data,
	// };

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
	const { data, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	if (isFetching) {
		return "Loading";
	}

	console.log(data);

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			{/* header */}
			<div className="w-full h-50 items-start justify-start p-4 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{/* top row of header */}
				<div className="flex flex-row w-full justify-between">
					{/* top left of header */}
					<div className="flex flex-row items-center gap-[20px]">
						<span className="font-semibold text-lg tracking-wide dark:text-white">
							{data?.title}
						</span>
						<span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
							{data?.live ? `LIVE` : `TEST`}
						</span>
					</div>
					{/* top right of header */}
					<span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
						{data?.user?.balance} Credits
					</span>
				</div>

				<span className="mt-2 text-[#313131] dark:text-[#8B929F]">
					Added on {data?.createdAt.slice(0, 10)}
				</span>

				{/* bottom row of header  */}
				<div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
					<a href={data?.url} target="_blank">
						<div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
							<div className="flex gap-[10px]">
								<img className="w-[14px]" src={icon[data?.host]} />
								<span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
									{data?.identifier} on {data?.host}
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
						<div className="flex gap-[7px]">
							<img src={darkSettings} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Settings
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-2 pb-[20px] lg:mx-auto block h-[50vh] w-{{WIDTH}} shadow-lg rounded-lg text-sm flex flex-col md:flex-row items-center md:px-[20px] lg:w-[65%] bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between overflow-auto">
				<div className="flex flex-col gap-[15px]">
					<div className="flex flex-row w-full justify-between p-4">
						<div className="flex flex-row">
							<div className="flex flex-col gap-[15px]">
								<div className="flex flex-col">
									<div className="flex gap-[5px]">
										<h2 className="font-semibold dark:text-white">
											PULL REQUEST TITLE
										</h2>
									</div>
									<span className="font-light text-[#313131] dark:text-[#8B929F]">
										#1 opened on May 23 by ramirc5
									</span>
								</div>
								<button className="flex border border-[#919190] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center gap-[5px]">
									<div className="flex gap-[10px]">
										<img
											className="w-[14px]"
											src={dark ? githubDarkmode : githubLogo}
										/>
										<span className="font-semibold max-w-[125px] text-ellipsis overflow-hidden text-nowrap dark:text-white">
											(chore) refactor: uncrustify par...
										</span>
									</div>
									<img src={dark ? darkExternalLink : ExternalLink} />
								</button>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-[15px]">
						<p className="font-medium text-[10px] text-black dark:text-white">
							Vote yes to merge or vote No to close this pull request.
						</p>
						<div className="flex flex-row justify-between gap-[15px]">
							<button className="bg-[#20B176] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white">
								VOTE YES
							</button>
							<button className="bg-[#DC2626] font-semibold text-[16px] px-[20px] py-[3px] rounded-md text-white">
								VOTE NO
							</button>
						</div>
					</div>
					<div className="px-[3px] py-[5px] hidden md:flex md:flex-col rounded-lg dark:bg-[#171D2B] border border-transparent border-1 border-[#D9D9D9] dark:border-[#373D47] w-[260px] ">
						<p className="text-[#919190] text-[8px]">
							Your amount of credits will be applied to the side you select.
							When that side reaches a majority the pull request will be either
							merged or closed automatically.
						</p>
						<p className="text-[#919190] text-[8px]">
							You may only vote once per pull request. It can not be undone.
						</p>
					</div>
				</div>
				<div className="w-[95%] md:w-[60%]">
					<div className="flex flex-col gap-[5px] font-semibold text-[#8B929F] text-[12px] md:w-[85%] mt-[20px]">
						<p>Voting Activity</p>
						<div className="w-[80%] md:w-full">
							<ProgressBar
								yesPercent={0.35}
								yesVotes={123}
								noPercent={0.1}
								noVotes={87}
								totalPercent={0.45}
								quorum={0.5}
								votesView={true}
							/>
						</div>
					</div>
					<div className="w-[93%] max-h-[120px] overflow-auto ">
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
						{data?.voteData?.votes.length &&
							data.map((item, index) => (
								<div
									key={index}
									class={` p-[1px] grid grid-cols-4 ${
										item % 2 == 1 ? "bg-[#F9F9F9] dark:bg-[#171D2B]" : null
									} `}
								>
									<div class="text-center ">
										<p className="dark:text-white text-[10px]">jex123</p>
									</div>
									<div class=" text-center ">
										<p
											className={`${
												item % 2 == 1 ? "text-[#038800]" : "text-[#DC2626]"
											} text-[10px]`}
										>
											{item % 2 == 1 ? "YES" : "NO"}
										</p>
									</div>
									<div class="text-center">
										<p className="dark:text-white text-[10px]">50,000</p>
									</div>
									<div class="text-center  ">
										<p className="dark:text-white text-[10px]">2 HR</p>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
