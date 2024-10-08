import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Plans from "../Checkout/Plans.jsx";
import CodeHostLink from "./CodeHostLink.jsx";
import ModeBadge from "./ModeBadge.jsx";
import { useStore } from "../../store.js";
import httpService from "../../services/httpService.js";

export default function Projects() {
	const { getUserProjects } = httpService();
	const { user } = useStore();
	const navigate = useNavigate();
	const { data: projects, isFetching: isFetchingProjects } = useQuery(
		["userID", { userID: user?.id }],
		{
			queryKey: ["userprojects"],
			queryFn: getUserProjects,
		}
	);

	if (isFetchingProjects) {
		return "Loading";
	}
	if (!user.plan) {
		return <Plans />;
	}

	return (
		<div className="w-full h-full p-3 lg:px-4 shadow-lg rounded-lg text-sm flex flex-col items-center bg-[white]/90 dark:bg-mid-gray border border-transparent border-1 dark:border-dark-gray overflow-auto">
			<div className="flex mb-6 flex-row w-full justify-between">
				<h3 className="dark:text-white">My Projects</h3>
				<h3
					className="text-dark-gray dark:text-white cursor-pointer"
					onClick={() => navigate("/create")}
				>
					Create New Project
				</h3>
			</div>
			<div className="h-5/6 pr-2 w-full">
				{projects?.length ? (
					projects?.map((project, index) => (
						<div
							key={project.id}
							className="flex flex-col w-full lg:h-[120px] my-2 pb-4 border-b border-lightGray dark:border-slate-gray"
						>
							<div className="flex flex-row justify-between w-full">
								<div className="flex flex-row justify-start max-w-[260px] gap-4 lg:max-w-full">
									<span
										onClick={() => navigate(`/projects/${project.id}`)}
										className="lg:text-[15px] max-w-[220px] lg:max-w-full truncate dark:text-[white] cursor-pointer"
									>
										{project.identifier}
									</span>
									<ModeBadge project={project} />
								</div>
								<span className="text-[10px] font-medium text-slate-500 dark:text-slate-gray w-2/6 text-right">
									{project?.user.balance} Credits
								</span>
							</div>
							<div className="flex flex-row items-start justify-between w-full">
								<div className="flex flex-col justify-between w-1/2 lg:gap-2">
									<span className="text-[11px] mt-1 text-slate-gray">
										Added on {project.createdAt.slice(0, 10)}
									</span>
									<span className="flex items-center h-5 mb-1">
										{project.members.map((member) => {
											return (
												<img
													key={member.id}
													className={`w-5 h-5 rounded-xl border-2 border-[white] dark:border-mid-gray/75`}
													src={member.avatar}
													title={member.username}
												/>
											);
										})}
									</span>
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
										className="text-center w-[120px] border border-[#8D4D4D4] hover:bg-powder-blue/25 text-slate-800 dark:text-[white] dark:border-slate-gray dark:hover:bg-midnight/75 rounded-md py-1 px-2 dark:text-[white] cursor-pointer"
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
