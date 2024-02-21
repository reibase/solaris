import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Nav from "../Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";
import { useEffect } from "react";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import RepoItem from "./RepoItem.jsx";

export default function ConnectRepo({ project, setProject, dark, user }) {
	const [visible, setVisible] = useState(false);
	const [clicked, setClicked] = useState(false);

	const getInstallationRepos = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.id}/${project.host}/installations/repos`)
				.then((res) => {
					console.log(res);
					return res;
				});
			setClicked(false);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { status, data, isFetching } = useQuery({
		queryKey: ["repos"],
		queryFn: getInstallationRepos,
		enabled: user.id !== null && clicked,
	});

	const [text, setText] = useState("");

	useEffect(() => {
		if (data?.status === 200) {
			setText(
				"Don't see the repo you're looking for? Click below to manage Solaris' access to your repositories."
			);
		} else if (data?.status === 404) {
			setText(
				`Solaris does not have access to your ${project.host} repositories. Please allow Solaris access only to the repository you wish to connect.`
			);
		}
	}, [data]);

	const clickHandler = (e) => {
		setClicked(true);
		setProject({
			host: e.target.value,
			title: "",
			identifier: "",
			installationID: null,
			owner: "",
			hostID: null,
			creditAmount: 100,
			url: "",
			quorum: 50,
			clawBack: true,
			headless: true,
			isPrivate: false,
		});
	};

	const manageAccess = {
		github: `https://github.com/apps/reibase-solaris/installations/new`,
		gitlab: `https://gitlab.com/oauth/authorize?client_id=66859395df9b0ec65ba6f8add687fceffba6d17b39cde677fd0933336227b2b1&redirect_uri=${window.location.href}&response_type=code&scope=api`,
	};

	return (
		<div className="flex flex-col h-full divide-y gap-4 w-full mb-4 lg:divide-x lg:divide-y-0 lg:flex-row dark:divide-[#373D47]">
			<div className="w-full lg:w-1/3 dark:text-[#8B929F]">
				Source Code Provider:
				<button
					type="button"
					className={`${
						project.host === "github" && "bg-[#E7F0FF] dark:bg-[#18181B]"
					} flex flex-row gap-8 items-center mt-6 px-4 w-30 py-1 border border-1 rounded-md border-[#8B929F] hover:bg-[#E7F0FF] dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 dark:text-white`}
					value="github"
					onClick={(e) => clickHandler(e)}
				>
					GitHub
					<img className="w-5" src={dark ? githubLogoDarkMode : githubLogo} />
				</button>
				<button
					type="button"
					className={`${
						project.host === "gitlab" && "bg-[#E7F0FF] dark:bg-[#18181B]"
					} flex flex-row gap-8 items-center mt-6 px-4 w-30 py-1 border border-1 rounded-md border-[#8B929F] hover:bg-[#E7F0FF] dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 dark:text-white`}
					value="gitlab"
					onClick={(e) => clickHandler(e)}
				>
					GitLab
					<img className="w-5" src={gitlabLogo} />
				</button>
			</div>
			<div className="flex flex-col mt-5 lg:w-3/5 lg:px-10 lg:mt-0">
				<span className="dark:text-gray-500">Repository:</span>
				{isFetching ? (
					"Loading"
				) : (
					<div class="relative inline-block text-left">
						<div>
							<button
								type="button"
								className="mt-6 inline-flex w-full justify-between gap-x-1.5 rounded-md px-3 py-1 text-sm text-gray-900 hover:bg-gray-50 border border-1 rounded-md border-gray-300 hover:bg-[#E7F0FF] dark:border-[#8B929F] disabled:text-gray-300 disabled:border-gray-300 dark:hover:bg-[#18181B]/75 dark:text-white disabled:hover:bg-transparent disabled:cursor-default disabled:dark:hover:bg-transparent disabled:dark:text-[#373D47] disabled:dark:border-[#373D47]"
								id="menu-button"
								aria-expanded="true"
								aria-haspopup="true"
								onClick={() => setVisible(!visible)}
								disabled={!data?.installations}
							>
								{project.title === "" ? "Select a Repository" : project.title}
								<svg
									class="-mr-1 h-5 w-5 text-gray-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
						{visible ? (
							<div
								class="absolute max-h-40 overflow-y-scroll right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-[#0F172A] rounded-md bg-white dark:bg-[#373D47] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="menu-button"
								tabindex="-1"
							>
								<div class="py-1" role="none">
									{data?.installations &&
										data.installations.map((installation) => {
											return installation.repositories.map((repo) => {
												return (
													<RepoItem
														project={project}
														setProject={setProject}
														hostID={repo.id}
														isPrivate={
															project.host === "github"
																? repo?.private
																: repo?.visibility === "private"
																? true
																: false
														}
														url={
															project.host === "github"
																? repo?.html_url
																: repo?.web_url
														}
														installationID={repo?.installationID}
														title={
															project.host === "github"
																? repo?.full_name
																: repo?.name_with_namespace
														}
														visible={visible}
														setVisible={setVisible}
													/>
												);
											});
										})}
								</div>
							</div>
						) : null}
					</div>
				)}
				<div
					className={`flex flex-col gap-4 mt-3 text-gray-500 ${
						data?.status === 404 && "text-red-500"
					}`}
				>
					{text}
					{project.host && (
						<a href={manageAccess[project.host]}>
							<button className="mt-1 py-1.5 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47]">
								Manage Access
							</button>
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
