import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import githubLogo from "../assets/github.svg";
import githubLogoDarkMode from "../assets/github-darkmode.svg";
import gitlabLogo from "../assets/gitlab.svg";
import { useStore } from "../store.js";
import ExternalLink from "../assets/ExternalLink.svg";
import darkDataTransfer from "../assets/darkDataTransfer.svg";
import darkGroup from "../assets/darkGroup.svg";
import darkSettings from "../assets/darkSettings.svg";
import darkExternalLink from "../assets/darkExternalLink.svg";
import Group from "../assets/Group.svg";
import ProgressBar from "./ProgressBar.jsx";

export default function Projects() {
	const { dark, user } = useStore();
	let { id } = useParams();
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
	const { data, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	if (isFetching) {
		return "Loading";
	}
	console.log(data);
	return (
		// wrapper
		<div className="w-full h-full flex flex-col gap-[10px]">
			{/* header */}
			<div className="w-full h-50 items-start justify-start px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
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

				<span className="mt-1 mb-3 text-[#313131] dark:text-[#8B929F]">
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

			<div className="w-full h-full px-4 shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between overflow-auto">
				{data?.Issues.length ? (
					data?.Issues.map((pullRequest, index) => (
						<div className="flex flex-row w-full justify-between border-b border-[#D4D4D4] py-3 px-1 hover:bg-slate-100/25 dark:hover:bg-[#161f2d] dark:border-[#373D47]">
							<div className="flex flex-row">
								<div className="flex flex-col gap-[25px]">
									<div className="flex flex-col">
										<div className="flex gap-[5px]">
											<h2 className="font-semibold text-[14px] tracking-wide dark:text-white">
												{pullRequest.title}
											</h2>
										</div>
										<span className="text-slate-500 mt-2 dark:text-[#8B929F]">
											#{pullRequest.number} opened on{" "}
											{pullRequest.createdAt.slice(0, 10)} by{" "}
											{pullRequest.author}
										</span>
									</div>

									<a href={pullRequest?.url} target="_blank">
										<div className="flex border border-[#D4D4D4] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center gap-[5px]">
											<div className="flex gap-[10px]">
												<img className="w-[14px]" src={icon[data?.host]} />
												<span className="font-semibold max-w-[125px] text-ellipsis overflow-hidden text-nowrap dark:text-white">
													{pullRequest.title}
												</span>
											</div>
											<img src={dark ? darkExternalLink : ExternalLink} />
										</div>
									</a>
								</div>
							</div>
							<div className="flex flex-col justify-end gap-[10px] md:gap-0 items-end md:justify-between ">
								<button className="border border-[#D4D4D4] dark:border-[#8B929F] rounded-md  px-[10px] py-[3px] w-[125px] dark:text-white">
									View Pull Request
								</button>
							</div>
						</div>
					))
				) : (
					<span className="w-full h-full flex justify-center items-center text-slate-400">
						There are no merge requests for this project.
					</span>
				)}
			</div>
		</div>
	);
}
