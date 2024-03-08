import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../store.js";
import { useNavigate } from "react-router-dom";

import darkDataTransfer from "../../assets/darkDataTransfer.svg";
import darkGroup from "../../assets/darkGroup.svg";
import darkSettings from "../../assets/darkSettings.svg";
import Group from "../../assets/Group.svg";

import CodeHostLink from "./CodeHostLink.jsx";
import ModeBadge from "./ModeBadge.jsx";

export default function ProjectHeading({ project }) {
	const navigate = useNavigate();

	const { dark, user } = useStore();
	let { id } = useParams();

	return (
		<>
			<div className="w-full h-50 items-start justify-start p-2 lg:px-4 shadow-md rounded-lg mb-2 text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{/* top row of header */}
				<div className="flex flex-row w-full justify-between">
					{/* top left of header */}
					<div className="flex flex-row items-center gap-[20px] w-5/6">
						<span
							onClick={() => navigate(`/projects/${id}`)}
							className="font-semibold text-[14px] lg:text-lg tracking-wide dark:text-white cursor-pointer truncate overflow-hidden"
						>
							{project?.title}
						</span>
						<ModeBadge project={project?.live} />
					</div>
					{/* top right of header */}
					<span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
						{project?.user?.balance} Credits
					</span>
				</div>

				<span className="mt-1 mb-3 text-[#313131] text-[11px] dark:text-[#8B929F]">
					Added on {project?.createdAt.slice(0, 10)}
				</span>

				{/* bottom row of header  */}
				<div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
					<CodeHostLink
						url={project?.url}
						text={project?.identifier}
						host={project?.host}
					/>
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
