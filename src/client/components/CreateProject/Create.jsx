import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../store.js";

import Review from "./Review.jsx";
import ConnectRepo from "./ConnectRepo.jsx";
import Settings from "./Settings.jsx";
import Navigation from "./Navigation.jsx";
import Success from "./Success.jsx";
import ProjectType from "./ProjectType.jsx";
import ConnectOrg from "./ConnectOrg.jsx";
import httpService from "../../services/httpService.js";

const Create = (props) => {
	const { createInstallation } = httpService();
	const { user, dark } = useStore();
	const [index, setIndex] = useState(0);
	const [installationID, setInstallationID] = useState("");
	const [provider, setProvider] = useState("");
	const [enabled, setEnabled] = useState(false);
	const [project, setProject] = useState({
		type: "repository",
		title: "",
		identifier: "",
		installationID: null,
		owner: "",
		hostID: null,
		url: "",
		host: "",
		quorum: 510,
		creditAmount: 1000,
	});

	useEffect(() => {
		if (window.location.href.includes("?")) {
			if (window.location.href.includes("installation_id=")) {
				setProvider("github");
				setInstallationID(
					parseInt(window.location.href.split("=")[1].split("&")[0])
				);
			}
			if (window.location.href.includes("code=")) {
				setProvider("gitlab");
				setInstallationID(window.location.href.split("=")[1]);
			}
			setEnabled(true);
		}
	}, []);

	const { status, data, isFetching } = useQuery(
		[
			"installation",
			{ userID: user.id, installationID: installationID, provider: provider },
		],
		{
			queryKey: ["installation"],
			queryFn: createInstallation,
			enabled: enabled,
			manual: true,
		}
	);

	const componentHandler = () => {
		switch (index) {
			case 0:
				return (
					<ProjectType
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				);
			case 1:
				return project.type === "repository" ? (
					<ConnectRepo
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				) : (
					<ConnectOrg
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				);
			case 2:
				return (
					<Review
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				);
			case 3:
				return (
					<Success
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				);
		}
	};
	const steps = ["Project Type", "Connect Project", "Review"];
	return (
		<div className="w-full p-4 block h-[455px] shadow-lg text-sm rounded-lg flex flex-col justify-between lg:items-center lg:p-[20px] lg:mx-auto lg:w-[660px] bg-white/90 dark:bg-mid-gray border border-transparent border-1 dark:border-dark-gray">
			<div className="flex flex-row gap-4 h-1/6 w-full mb-4">
				{steps.map((step, idx) => (
					<span
						className={`text-[12px] lg:text-md h-4/6 dark:text-slate-gray ${
							idx !== index && "text-gray-300"
						}`}
					>
						Step {idx + 1}: {step}
					</span>
				))}
			</div>

			{isFetching ? (
				<div className="flex text w-full h-full w-full mb-4 dark:text-slate-gray">
					Loading
				</div>
			) : (
				componentHandler()
			)}

			<Navigation project={project} index={index} setIndex={setIndex} />
		</div>
	);
};
export default Create;
