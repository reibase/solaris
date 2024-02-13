import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "../Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";

import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import ConnectRepo from "./ConnectRepo.jsx";

const Create = (props) => {
	const { user, setUserInfo, dark } = useStore();
	const navigate = useNavigate();
	const [step, setStep] = useState("Connect");
	const [clicked, setClicked] = useState(false);
	const [project, setProject] = useState({
		title: "",
		identifier: "",
		installationID: null,
		owner: "",
		hostID: null,
		url: "",
		host: "",
		quorum: 0.5,
		clawBack: true,
		headless: true,
	});

	const createInstallation = async () => {
		const installationID = parseInt(
			window.location.href.split("=")[1].split("&")[0]
		);
		try {
			const { data } = await axios
				.post(`/api/users/${user.info.id}/installations`, {
					provider: "github",
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
		enabled:
			window.location.href.includes("installation_id=") &&
			user.info.id !== null,
	});

	const componentHandler = () => {
		switch (step) {
			case "Connect":
				return (
					<ConnectRepo
						project={project}
						setProject={setProject}
						setStep={setStep}
						dark={dark}
						user={user.info}
						clicked={clicked}
						setClicked={setClicked}
					/>
				);

			case "Settings":
				return (
					<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
						Set Quorum Live Test
						<button onClick={() => setStep("Review")}>Continue</button>
					</div>
				);
			case "Review":
				return (
					<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
						You are creating this project with these settings
						<button onClick={() => setStep("Create")}>Create</button>
					</div>
				);
			case "Create":
				return (
					<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
						You have successfully created a project on Solaris.
						<button onClick={() => navigate("/projects/:projectID")}>
							View Project
						</button>
					</div>
				);
		}
	};

	if (isFetching) {
		return "loading";
	}

	return (
		<div className="mx-2 p-4 block h-[455px] shadow-lg rounded-lg text-sm flex flex-col lg:items-center lg:p-[40px] lg:mx-auto lg:w-2/5 bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
			<div className="flex flex-row gap-4 h-1/6 w-full mb-4">
				<span className="text-[10px] h-4/6 text-gray-400">
					Step 1: Connect Repository
				</span>
				<span className="text-[10px] text-gray-400">Step 2: Settings</span>
				<span className="text-[10px] text-gray-400">Step 3: Review</span>
			</div>
			{componentHandler()}
			<div className="flex items-end justify-end w-full h-1/6">
				<span>
					<button
						className="mt-2 py-1.5 w-24 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47]"
						onClick={() => setStep("Settings")}
					>
						Continue
					</button>
				</span>
			</div>
		</div>
	);
};
export default Create;
