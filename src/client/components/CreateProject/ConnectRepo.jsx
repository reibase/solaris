import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "../Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";
import { useEffect } from "react";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";

export default function ConnectRepo({
	project,
	setProject,
	dark,
	user,
	setStep,
}) {
	const getInstallationRepos = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.id}/installations/repos`)
				.then((res) => {
					const firstRepo = res.data[0].repositories[0];
					setProject({
						...project,
						installationID: firstRepo.installationID,
						hostID: firstRepo.id,
						identifier: firstRepo.full_name,
					});
					return res;
				});
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { status, data } = useQuery({
		queryKey: ["repos"],
		queryFn: getInstallationRepos,
		enabled: project.host === "github",
	});

	const [text, setText] = useState("");

	useEffect(() => {
		if (status === 404) {
			setText(
				"Solaris does not have access to your repositories. Please allow Solaris access only to the repository you wish to connect."
			);
		} else {
			setText(
				"Don't see the repo you're looking for? Click below to manage Solaris' access to your repositories."
			);
		}
	}, [data]);

	return (
		<div className="flex flex-col h-full divide-y lg:divide-x lg:divide-y-0 lg:flex-row gap-4 w-full mb-4">
			<div className="w-full lg:w-1/3 dark:text-[#8B929F]">
				Source Code Provider:
				<button
					className={`${
						project.host === "github" && "bg-[#E7F0FF] dark:bg-[#18181B]"
					} flex flex-row gap-8 items-center mt-6 px-4 w-30 py-1 border border-1 rounded-md border-[#8B929F] hover:bg-[#E7F0FF] dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 dark:text-white`}
					value="github"
					onClick={(e) => setProject({ ...project, host: e.target.value })}
				>
					<span>GitHub</span>
					<span>
						<img className="w-5" src={dark ? githubLogoDarkMode : githubLogo} />
					</span>
				</button>
				<button
					className={`${
						project.host === "gitlab" && "bg-[#E7F0FF] dark:bg-[#18181B]"
					} flex flex-row gap-8 items-center mt-6 px-4 w-30 py-1 border border-1 rounded-md border-[#8B929F] hover:bg-[#E7F0FF] dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 dark:text-white`}
					value="gitlab"
					onClick={(e) => setProject({ ...project, host: e.target.value })}
				>
					<span className="">GitLab</span>
					<span>
						<img className="w-5" src={gitlabLogo} />
					</span>
				</button>
			</div>
			<div className="flex flex-col mt-5 lg:w-3/5 lg:px-10 lg:mt-0">
				<span className="dark:text-gray-500">Repository:</span>
				<span>
					<select
						className="mt-2"
						onChange={(e) =>
							setProject({
								...project,
								identifier: e.target.name,
								installationID: parseInt(e.target.value),
								hostID: e.target.id,
								title: e.target.name,
							})
						}
					>
						{data &&
							data.map((installation) => {
								return installation.repositories.map((repo) => {
									return (
										<option
											selected="selected"
											name={repo.full_name}
											key={repo.installationID}
											id={repo.id}
											value={repo.installationID}
										>
											{repo.full_name}
										</option>
									);
								});
							})}
					</select>
				</span>
				<div className="flex flex-col gap-4 mt-3 text-gray-500">
					{text}
					<a href="https://github.com/organizations/reibase/settings/apps/solaris-local/installations">
						<button className="mt-1 py-1.5 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47]">
							Manage Access
						</button>
					</a>
				</div>
			</div>
		</div>
	);
}
