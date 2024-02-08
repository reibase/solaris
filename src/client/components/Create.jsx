import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Create = () => {
	const navigate = useNavigate();

	const [step, setStep] = useState("Connect");

	const installed = window.location.href.includes("installation_id=")
		? true
		: false;

	const installationID =
		(window.location.href.includes("installation_id=") &&
			window.location.href.split("=")[1].split("&")[0]) ||
		false;

	const [project, setProject] = useState({
		title: "",
		identifier: "",
		installationID: installationID,
		owner: "",
		hostID: null,
		url: "",
		host: "github",
		quorum: 0.5,
		clawBack: true,
		headless: true,
	});

	//get api/installations
	const getInstallationRepos = async () => {
		try {
			const { data } = await axios
				.post("/api/installation/repos", {
					installationID: installationID,
				})
				.then((res) => {
					const firstRepo = res.data.repos[0];
					setProject({
						...project,
						identifier: firstRepo.full_name,
						title: firstRepo.full_name,
						hostID: firstRepo.id,
						owner: firstRepo.owner.id,
						url: firstRepo.url,
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
		enabled: installed,
	});

	switch (step) {
		case "Connect":
			return (
				<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
					<label htmlFor="source" />
					Source Code Provider:
					<form name="source">
						<select
							onChange={(e) => setProject({ ...project, host: e.target.value })}
						>
							<option value="github">GitHub</option>
							<option value="gitlab">GitLab</option>
						</select>
					</form>
					<form name="repos">
						<select
							onChange={(e) =>
								setProject({
									...project,
									identifier: e.target.value,
									hostID: e.target.id,
									title: e.target.full_name,
								})
							}
						>
							{data &&
								data.repos.map((repo) => (
									<option
										selected="selected"
										key={repo.id}
										id={repo.id}
										value={repo.full_name}
									>
										{repo.full_name}
									</option>
								))}
						</select>
					</form>
					<a href="https://github.com/organizations/reibase/settings/apps/solaris-local/installations">
						Manage Access
					</a>
					<button
						disabled={!installationID}
						onClick={() => setStep("Settings")}
					>
						Continue
					</button>
				</div>
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
					<button disabled={!installationID} onClick={() => setStep("Create")}>
						Create
					</button>
				</div>
			);
		case "Create":
			return (
				<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
					You have successfully created a project on Solaris.
					<button
						disabled={!installationID}
						onClick={() => navigate("/projects/:projectID")}
					>
						View Project
					</button>
				</div>
			);
		default:
			return (
				<>
					<Nav />
					<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
						<a href="https://github.com/organizations/reibase/settings/apps/solaris-local/installations">
							Manage Access
						</a>
						<button
							disabled={!installationID}
							onClick={() => setStep("Settings")}
						>
							Continue
						</button>
					</div>
				</>
			);
	}
};

export default Create;
