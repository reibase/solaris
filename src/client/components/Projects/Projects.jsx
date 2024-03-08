import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store.js";

import CodeHostLink from "./CodeHostLink.jsx";
import ModeBadge from "./ModeBadge.jsx";

export default function Projects() {
	const { dark, user } = useStore();
	const navigate = useNavigate();

	const getUserProjects = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { data, isFetching } = useQuery({
		queryKey: ["userprojects"],
		queryFn: getUserProjects,
	});

	if (isFetching) {
		return "Loading";
	}

	return (
		<div className="w-full h-full justify-start items-start shadow-lg rounded-lg text-sm flex flex-col p-2 lg:p-6 bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] gap-[10px]">
			<div className="flex mb-6 flex-row w-full justify-between">
				<h3 className="dark:text-white">My Projects</h3>
				<h3
					className="text-[#313131] dark:text-white cursor-pointer"
					onClick={() => navigate("/create")}
				>
					Create New Project
				</h3>
			</div>
			<div className="h-5/6 pr-2 w-full">
				{data?.length ? (
					data?.map((project, index) => (
						<div className="flex flex-col w-full lg:h-[120px] my-2 pb-4 border-b border-[#D4D4D4] dark:border-[#8B929F]">
							<div className="flex flex-row justify-between w-full">
								<div className="flex flex-row justify-start max-w-[260px] gap-4 lg:max-w-full">
									<span
										onClick={() => navigate(`/projects/${project.id}`)}
										className="lg:text-[15px] max-w-[220px] lg:max-w-full truncate dark:text-white cursor-pointer"
									>
										{project.identifier}
									</span>
									<ModeBadge project={project} />
								</div>
								<span className="text-[10px] font-medium text-slate-500 dark:text-[#8B929F] w-2/6 text-right">
									{project?.user.balance} Credits
								</span>
							</div>
							<div className="flex flex-row items-start justify-between w-full">
								<div className="flex flex-col justify-between w-1/2 lg:gap-2">
									<span className="text-[11px] leading-6 text-[#8B929F]">
										Added on {project.createdAt.slice(0, 10)}
									</span>
									<div className="flex items-center h-5 mb-1">
										{project.members.map((member, idx) => {
											return (
												<img
													key={member.id}
													className={`w-6 h-6 rounded-xl border-2 border-white dark:border-[#202530]/75`}
													src={member.avatar}
													title={member.username}
												/>
											);
										})}
									</div>
									<span className="hidden lg:block">
										<CodeHostLink
											url={project.url}
											text={project.identifier}
											host={project.host}
										/>
									</span>
								</div>
								<div className="flex h-full py-3 lg:py-0 items-center">
									<span
										onClick={() => navigate(`/projects/${project.id}`)}
										className="text-center w-[120px] border border-[#8D4D4D4] hover:bg-[#E7F0FF]/25 text-slate-800 dark:text-white dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 rounded-md py-1 px-2 dark:text-white cursor-pointer"
									>
										View Project
									</span>
								</div>
							</div>
						</div>
					))
				) : (
					<span className="w-full h-full text-gray-300 flex items-center justify-center text-center text-lg">
						You have not created any projects yet.
					</span>
				)}
			</div>
		</div>
	);
}
