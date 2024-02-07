import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "./Nav.jsx";

const Create = () => {
	const navigate = useNavigate();

	const [step, setStep] = useState("Connect");

	const installationID =
		window.location.href.includes("installation_id=") &&
		window.location.href.split("=")[1].split("&")[0];

	const [project, setProject] = useState({
		title: "",
		identifier: "",
		installationID: installationID,
		owner: "",
		hostID: null,
		url: "",
		host: "",
		quorum: 0.5,
		clawBack: true,
		headless: true,
	});
	console.log(project);
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
