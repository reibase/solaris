import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../store.js";
import Forward from "../../assets/Forward.svg";
import ProgressBar from "./ProgressBar.jsx";
import ProjectHeading from "./ProjectHeading.jsx";
import CodeHostLink from "./CodeHostLink.jsx";
import httpService from "../../services/httpService.js";

export default function Issues() {
	const { getUserProject } = httpService();
	const { user, currentProject, setCurrentProject } = useStore();
	let { projectID } = useParams();
	const navigate = useNavigate();

	const { data: project } = useQuery(
		["project", { userID: user?.id, projectID: projectID }],
		getUserProject
	);

	useEffect(() => {
		if (project?.id) {
			setCurrentProject(project);
		}
	}, [project]);

	let issueCategory = {
		closed: [
			"Closed",
			"text-[#dd2a2a] bg-[#fee2e0] dark:text-red-50 dark:bg-red-500",
			"bg-[#dd2a2a] dark:bg-[#bg-red-500]",
		],
		merged: [
			"Merged",
			"text-[#7e3fec] bg-[#dbd3fb] dark:text-violet-50 dark:bg-violet-600",
			"bg-[#7e3fec] dark:bg-[#bg-violet-600]",
		],
		open: [
			"Open",
			"text-[#1C7737] bg-[#EEFDF2] dark:text-emerald-50 dark:bg-emerald-800",
			"bg-[#1C7737] dark:bg-[#bg-emerald-800]",
		],
	};

	const handleCategoryClick = (category) => {
		setCategory(category);
	};

	const [category, setCategory] = useState("open");
	if (!currentProject.id) {
		return "Loading";
	}
	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading />
			<div className="w-full h-full p-3 lg:px-4 shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] overflow-auto">
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

				{currentProject?.issues[category].length ? (
					currentProject?.issues[category].map((pullRequest, index) => (
						<div
							key={pullRequest.id}
							className="w-full flex row border-b border-[#D4D4D4] py-4 lg:px-1 hover:bg-slate-100/25 dark:hover:bg-[#161f2d] dark:border-[#373D47]"
						>
							<div className="flex flex-col justify-between w-full lg:flex-row">
								<div className="flex flex-col items-stretch justify-items-stretch w-full justify-between">
									<div className="flex flex-row items-center w-full mb-1 lg:m-0">
										<span
											className={`block h-2 w-2 mr-2 ${issueCategory[category][2]} rounded-md`}
										></span>
										<span
											onClick={() =>
												navigate(
													`/projects/${currentProject?.id}/issues/${pullRequest.number}`
												)
											}
											className="font-semibold lg:text-[14px] truncate dark:text-white cursor-pointer"
										>
											{pullRequest.title}
										</span>
									</div>
									<span
										onClick={() =>
											navigate(
												`/projects/${currentProject?.id}/issues/${pullRequest.number}`
											)
										}
										className="text-slate-500 text-[11px] dark:text-[#8B929F]"
									>
										#{pullRequest.number} opened on{" "}
										{pullRequest.createdAt.slice(0, 10)} by {pullRequest.author}
									</span>

									<div className="w-full flex-row items-end align-baseline mt-3 hidden lg:flex">
										<CodeHostLink
											url={pullRequest?.url}
											host={currentProject?.host}
											text={
												"#" +
												" " +
												pullRequest?.number +
												" " +
												pullRequest?.title
											}
										/>
									</div>
								</div>
								<div
									onClick={() =>
										navigate(
											`/projects/${currentProject?.id}/issues/${pullRequest.number}`
										)
									}
									className="mt-2 w-full lg:ml-14 lg:mt-0"
								>
									<ProgressBar
										quorum={currentProject?.quorum}
										totalYesVotes={pullRequest?.totalYesVotes}
										totalNoVotes={pullRequest?.totalNoVotes}
										yesPercent={pullRequest.totalYesPercent}
										noPercent={pullRequest.totalNoPercent}
										votesView={false}
									/>
								</div>
							</div>
							<div
								onClick={() =>
									navigate(
										`/projects/${currentProject?.id}/issues/${pullRequest.number}`
									)
								}
								className="w-14 flex justify-end"
							>
								<img
									onClick={() =>
										navigate(
											`/projects/${currentProject?.id}/issues/${pullRequest.number}`
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
