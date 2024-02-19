import React from "react";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";

export default function Review({ project, user, dark }) {
	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};
	return (
		<div className="flex flex-col h-full gap-4 w-full mb-4 dark:divide-[#373D47] dark:text-white">
			<div>
				<h1 className="text-lg pb-1">Review</h1>
				<p className="">You are creating this project with these resources:</p>
			</div>
			<div className="px-4 w-full flex items-center justify-center">
				<div className="flex w-full flex-col gap-4 dark:text-white">
					<span className="flex p-1 justify-between flex-row gap-4">
						<span>Repository:</span>
						<span className={`flex flex-row gap-4 bg-[url()]`}>
							<a
								href={project.url}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
							>
								<img className="w-4" src={icon[project.host]} />
							</a>
							<a
								href={project.url}
								className="text-blue-500 hover:text-blue-600"
								target="_blank"
							>
								{project.identifier}
							</a>
						</span>
					</span>
					<span className="flex p-1 justify-between flex-row gap-4 bg-gray-100 dark:bg-gray-900 ">
						<span>Credit Amount:</span>
						<span>{project.creditAmount}</span>
					</span>
					<span className="flex p-1 justify-between flex-row gap-4">
						<span>Number of credits required to end voting:</span>
						<span>{project.quorum}</span>
					</span>
				</div>
			</div>
		</div>
	);
}
