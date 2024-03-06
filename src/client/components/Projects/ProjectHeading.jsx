import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../store.js";
import { useNavigate } from "react-router-dom";

import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkDataTransfer from "../../assets/darkDataTransfer.svg";
import darkGroup from "../../assets/darkGroup.svg";
import darkSettings from "../../assets/darkSettings.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import Group from "../../assets/Group.svg";

export default function ProjectHeading({ project }) {
	const navigate = useNavigate();

	const { dark, user } = useStore();
	let { id } = useParams();

	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};

	return (
		<>
			<div className="w-full h-50 items-start justify-start px-4 py-2 shadow-md rounded-lg mb-2 text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{/* top row of header */}
				<div className="flex flex-row w-full justify-between">
					{/* top left of header */}
					<div className="flex flex-row items-center gap-[20px]">
						<span
							onClick={() => navigate(`/projects/${id}`)}
							className="font-semibold text-lg tracking-wide dark:text-white cursor-pointer"
						>
							{project?.title}
						</span>
						{project?.live ? (
							<span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
								LIVE
							</span>
						) : (
							<span className="flex items-center justify-center font-semibold bg-gray-100 text-[10px] px-[10px] h-[18px] rounded-md text-gray-500 dark:bg-gray-900 dark:text-gray-200">
								TEST
							</span>
						)}
					</div>
					{/* top right of header */}
					<span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
						{project?.user?.balance} Credits
					</span>
				</div>

				<span className="mt-1 mb-3 text-[#313131] dark:text-[#8B929F]">
					Added on {project?.createdAt.slice(0, 10)}
				</span>

				{/* bottom row of header  */}
				<div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
					<a href={project?.url} target="_blank" className="cursor-pointer">
						<div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center cursor-pointer">
							<div className="flex gap-[10px]">
								<img className="w-[14px]" src={icon[project?.host]} />
								<span className="dark:text-white text-[11px] w-[135px] text-left truncate overflow-hidden">
									{project?.identifier} on {project?.host}
								</span>
							</div>
							<img src={dark ? darkExternalLink : ExternalLink} />
						</div>
					</a>

					<div className="flex items-center gap-[20px]">
						<div className="flex gap-[7px]">
							<img
								className="w-[20px] opacity-20 cursor-pointer"
								src={dark ? darkGroup : Group}
							/>
							<p className="text-gray-300 dark:text-[#D9D9D9] text-[12px] font-medium cursor-pointer">
								Community
							</p>
						</div>
						<div
							className="flex gap-[7px] cursor-pointer"
							onClick={() => navigate(`/projects/${project?.id}/transfer`)}
						>
							<img src={darkDataTransfer} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Transfer
							</p>
						</div>
						{project?.owner === user.info.id && (
							<div
								className="flex gap-[7px] cursor-pointer"
								onClick={() => navigate(`/projects/${project?.id}/settings`)}
							>
								<img src={darkSettings} />
								<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
									Settings
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
