import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";
import { useEffect } from "react";
import Review from "./Review.jsx";
import ConnectRepo from "./ConnectRepo.jsx";
import Settings from "./Settings.jsx";
import ContinueButtons from "./ContinueButtons.jsx";
import Success from "./Success.jsx";

const Create = (props) => {
	const { user, setUserInfo, dark } = useStore();
	const [index, setIndex] = useState(0);
	const [project, setProject] = useState({
		title: "",
		identifier: "",
		installationID: null,
		owner: "",
		hostID: null,
		url: "",
		host: "",
		quorum: 510,
		creditAmount: 1000,
		clawBack: true,
		headless: true,
		isPrivate: false,
	});

	const [canContinue, setCanContinue] = useState(false);
	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
		if (project.host !== "" && project.hostID !== null) {
			setCanContinue(true);
		}
		if (index > 0 && index < 3) {
			setCanGoBack(true);
		}
	}, [project, index]);

	const createInstallation = async () => {
		let provider;
		let installationID;
		if (!user?.id) {
			return;
		}
		if (window.location.href.includes("installation_id=")) {
			provider = "github";
			installationID = parseInt(
				window.location.href.split("=")[1].split("&")[0]
			);
		}
		if (window.location.href.includes("code=")) {
			provider = "gitlab";
			installationID = window.location.href.split("=")[1];
		}

		try {
			const { data } = await axios
				.post(`/api/users/${user?.id}/installations`, {
					provider: provider,
					installationID: installationID,
				})
				.then((res) => {
					window.location.href = window.location.href.split("?")[0];
					return res;
				});
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { status, data, isFetching } = useQuery({
		queryKey: ["repos"],
		queryFn: createInstallation,
		enabled: window.location.href.includes("?") && user?.id !== null,
	});

	const componentHandler = () => {
		switch (index) {
			case 0:
				return (
					<ConnectRepo
						project={project}
						setProject={setProject}
						setIndex={setIndex}
						dark={dark}
						user={user}
					/>
				);
			case 1:
				return (
					<Settings
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
	// if (!user?.id) {
	// 	return "Loading";
	// }
	return (
		<div className="w-full p-4 block h-[455px] shadow-lg text-sm rounded-lg flex flex-col lg:items-center lg:p-[40px] lg:mx-auto lg:w-2/3 bg-white/90 dark:bg-mid-gray border border-transparent border-1 dark:border-dark-gray">
			<div className="flex flex-row gap-4 h-1/6 w-full mb-4">
				<span
					className={`text-[10px] lg:text-md h-4/6 dark:text-slate-gray ${
						index !== 0 && "text-gray-300"
					}`}
				>
					Step 1: Connect Repository
				</span>
				<span
					className={`text-[10px] lg:text-md dark:text-slate-gray ${
						index !== 1 && "text-gray-300"
					}`}
				>
					Step 2: Settings
				</span>
				<span
					className={`text-[10px] lg:text-md dark:text-slate-gray ${
						index !== 2 && "text-gray-300"
					}`}
				>
					Step 3: Review
				</span>
			</div>

			{isFetching ? (
				<div className="flex text w-full h-full w-full mb-4 dark:text-slate-gray">
					Loading
				</div>
			) : (
				componentHandler()
			)}

			<ContinueButtons
				index={index}
				setIndex={setIndex}
				canContinue={canContinue}
				canGoBack={canGoBack}
			/>
		</div>
	);
};
export default Create;
