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
			"text-[#dd2a2a] bg-[#fee2e0] dark:text-[#dd2a2a] dark:bg-[#fee2e0]",
		],
		merged: [
			"Merged",
			"text-[#7e3fec] bg-[#dbd3fb] dark:text-[#7e3fec] dark:bg-[#dbd3fb]",
		],
		open: [
			"Open",
			"text-[#1C7737] bg-[#EEFDF2] dark:bg-[#185B2E] dark:text-[#7FEDA2]",
		],
	};
	const handleCategoryClick = (category) => {
		setCategory(category);
	};
	console.log(project);

	const [category, setCategory] = useState("open");
	if (isFetching) {
		return "Loading";
	}

	return (
		<div className="flex w-full h-full flex-col gap-[10px]">
			<ProjectHeading project={project} />

			<div className="w-full h-full px-4 shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] overflow-auto">
				<div className="flex w-full justify-start gap-[15px] py-[10px]">
					<span
						onClick={() => handleCategoryClick("open")}
						className={` ${
							category != "open" ? "opacity-50" : null
						} cursor-pointer flex items-center justify-center font-semibold  text-[10px] px-[10px] h-[18px] rounded-md ${
							issueCategory["open"][1]
						}`}
					>
						Open
					</span>
					<span
						onClick={() => handleCategoryClick("closed")}
						className={` ${
							category != "closed" ? "opacity-50" : null
						} cursor-pointer  flex items-center justify-center font-semibold text-[10px] px-[10px] h-[18px] rounded-md text-[#dd2a2a] ${
							issueCategory["closed"][1]
						}`}
					>
						Closed
					</span>
					<span
						onClick={() => handleCategoryClick("merged")}
						className={` ${
							category != "merged" ? "opacity-50" : null
						} cursor-pointer flex items-center justify-center font-semibold text-[10px] px-[10px] h-[18px] rounded-md ${
							issueCategory["merged"][1]
						}`}
					>
						Merged
					</span>
				</div>

				{project?.issues[category].length ? (
					project?.issues[category].map((pullRequest, index) => (
						<div className="flex flex-row w-full justify-between border-b border-[#D4D4D4] py-3 px-1 hover:bg-slate-100/25 dark:hover:bg-[#161f2d] dark:border-[#373D47]">
							<div className="flex flex-row">
								<div className="flex flex-col gap-[25px]">
									<div className="flex flex-col">
										<div className="flex gap-[5px]">
											<h2 className="font-semibold text-[14px] tracking-wide dark:text-white">
												{pullRequest.title}
											</h2>
											<span
												className={`flex items-center justify-center font-semibold text-[10px] px-[10px] h-[18px] rounded-md ${issueCategory[category][1]}`}
											>
												{issueCategory[category][0]}
											</span>
										</div>
										<span className="text-slate-500 text-[11px] mt-2 dark:text-[#8B929F]">
											#{pullRequest.number} opened on{" "}
											{pullRequest.createdAt.slice(0, 10)} by{" "}
											{pullRequest.author}
										</span>
									</div>

									<a
										href={pullRequest?.url}
										target="_blank"
										className="cursor-pointer"
									>
										<div className="flex border border-[#D4D4D4] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center gap-[5px]">
											<div className="flex gap-[10px]">
												<img className="w-[14px]" src={icon[project?.host]} />
												<span className="font-semibold max-w-[125px] text-ellipsis overflow-hidden text-nowrap dark:text-white">
													{pullRequest.title}
												</span>
											</div>
											<img src={dark ? darkExternalLink : ExternalLink} />
										</div>
									</a>
								</div>
							</div>
							<div className="flex justify-end items-center w-1/2 pl-4 flex-row gap-4 items-end lg:w-1/3">
								<ProgressBar
									yesPercent={pullRequest.totalYesPercent}
									noPercent={pullRequest.totalNoPercent}
									votesView={false}
								/>
								<span>
									<img
										onClick={() =>
											navigate(
												`/projects/${project?.id}/issues/${pullRequest.number}`
											)
										}
										src={Forward}
										className="w-[14px] cursor-pointer"
									/>
								</span>
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
