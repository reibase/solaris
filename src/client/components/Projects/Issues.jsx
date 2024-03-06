import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ExternalLink from "../../assets/ExternalLink.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import { useStore } from "../../store.js";
import Forward from "../../assets/Forward.svg";
import ProgressBar from "./ProgressBar.jsx";
import ProjectHeading from "./ProjectHeading.jsx";

export default function Issues() {
	const { dark, user } = useStore();
	let { id } = useParams();
	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};
	const navigate = useNavigate();
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

	const { data: project, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	let issueCategory = {
		closed: [
			"Closed",
			"text-[#dd2a2a] bg-[#fee2e0] dark:text-red-50 dark:bg-red-500",
		],
		merged: [
			"Merged",
			"text-[#7e3fec] bg-[#dbd3fb] dark:text-violet-50 dark:bg-violet-600",
		],
		open: [
			"Open",
			"text-[#1C7737] bg-[#EEFDF2] dark:text-emerald-50 dark:bg-emerald-800",
		],
	};
	const handleCategoryClick = (category) => {
		setCategory(category);
	};

	const [category, setCategory] = useState("open");
	if (isFetching) {
		return "Loading";
	}

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading project={project} />

			<div className="w-full h-full p-2 lg:px-4 shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] overflow-auto">
				<div className="flex w-full justify-start gap-[15px] py-[10px]">
					<span
						onClick={() => handleCategoryClick("open")}
						className={` ${
							category != "open" && "opacity-50"
						} cursor-pointer flex items-center justify-center  text-[11px] px-[10px] h-[18px] rounded-md ${
							issueCategory["open"][1]
						}`}
					>
						Open
					</span>
					<span
						onClick={() => handleCategoryClick("closed")}
						className={` ${
							category != "closed" && "opacity-50"
						} cursor-pointer  flex items-center justify-center text-[11px] px-[10px] h-[18px] rounded-md text-[#dd2a2a] ${
							issueCategory["closed"][1]
						}`}
					>
						Closed
					</span>
					<span
						onClick={() => handleCategoryClick("merged")}
						className={` ${
							category != "merged" && "opacity-50"
						} cursor-pointer flex items-center justify-center text-[11px] px-[10px] h-[18px] rounded-md ${
							issueCategory["merged"][1]
						}`}
					>
						Merged
					</span>
				</div>

				{project?.issues[category].length ? (
					project?.issues[category].map((pullRequest, index) => (
						<div
							onClick={() =>
								navigate(
									`/projects/${project?.id}/issues/${pullRequest.number}`
								)
							}
							className="w-full flex row border-b border-[#D4D4D4] py-3 lg:px-1 hover:bg-slate-100/25 dark:hover:bg-[#161f2d] dark:border-[#373D47]"
						>
							<div className="flex flex-col justify-between w-full lg:flex-row">
								<div className="flex flex-col items-stretch justify-items-stretch w-full justify-between">
									<div className="flex flex-row w-full mb-1 lg:m-0">
										<span
											onClick={() =>
												navigate(
													`/projects/${project?.id}/issues/${pullRequest.number}`
												)
											}
											className="font-semibold lg:text-[14px] max-w-[200px] lg:max-w-[300px] text-left truncate text-ellipsis overflow-hidden dark:text-white cursor-pointer"
										>
											{pullRequest.title}
										</span>
										<span
											className={`ml-4 flex items-center justify-center text-[11px] px-[10px] h-[18px] rounded-md ${issueCategory[category][1]}`}
										>
											{issueCategory[category][0]}
										</span>
									</div>
									<span className="text-slate-500 text-[11px] my-1 dark:text-[#8B929F]">
										#{pullRequest.number} opened on{" "}
										{pullRequest.createdAt.slice(0, 10)} by {pullRequest.author}
									</span>

									<div className="w-full flex-row items-end align-baseline mt-3 hidden lg:flex">
										<a
											href={pullRequest?.url}
											target="_blank"
											className="cursor-pointer lg:m-0 hidden lg:block"
										>
											<div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[300px] justify-between items-center cursor-pointer">
												<div className="flex gap-[10px]">
													<img className="w-[14px]" src={icon[project?.host]} />
													<span className="dark:text-white text-[11px] w-[200px] text-left truncate overflow-hidden">
														{pullRequest?.title} on{" "}
														{project?.host.slice(0, 1).toUpperCase() +
															project?.host.slice(1)}{" "}
													</span>
												</div>
												<img src={dark ? darkExternalLink : ExternalLink} />
											</div>
										</a>
									</div>
								</div>
								<div className="w-3/4 mt-2 lg:w-full lg:ml-14 lg:mt-0">
									<ProgressBar
										quorum={project?.quorum}
										totalYesVotes={pullRequest?.totalYesVotes}
										totalNoVotes={pullRequest?.totalNoVotes}
										yesPercent={pullRequest.totalYesPercent}
										noPercent={pullRequest.totalNoPercent}
										votesView={false}
									/>
								</div>
							</div>
							<div className="w-14 flex justify-end">
								<img
									onClick={() =>
										navigate(
											`/projects/${project?.id}/issues/${pullRequest.number}`
										)
									}
									src={Forward}
									className="w-[14px] cursor-pointer"
								/>
							</div>
						</div>
					))
				) : (
					<span className="w-full h-full flex justify-center items-center text-slate-400">
						There are no {category} merge requests for this project.
					</span>
				)}
			</div>
		</div>
	);
}
