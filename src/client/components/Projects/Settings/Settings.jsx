import React from "react";
import { useState, useEffect } from "react";
import { useStore } from "../../../store.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import ProjectHeading from "../ProjectHeading.jsx";
import Mode from "./Mode.jsx";
import CreditBehavior from "./CreditBehavior.jsx";
import MergeRequestBehavior from "./MergeRequestBehavior.jsx";
import ProjectSettings from "./ProjectSettings.jsx";
import Community from "./Community.jsx";
import SettingsNav from "./SettingsNav.jsx";
import httpService from "../../../services/httpService.js";

export default function Settings() {
	let { projectID } = useParams();
	const navigate = useNavigate();
	const { dark, currentProject, setCurrentProject, user } = useStore();
	const [unsaved, setUnsaved] = useState(false);
	const { getUserProject, deleteProject } = httpService();
	const [errorText, setErrorText] = useState("");
	const [updatedProject, setUpdatedProject] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [members, setMembers] = useState([]);
	const [ownerBalance, setOwnerBalance] = useState(0);
	const [balances, setBalances] = useState({});
	const [updated, setUpdated] = useState(false);

	const { data: savedProject } = useQuery({
		queryKey: ["project", { userID: user?.info.id, projectID: projectID }],
		queryFn: getUserProject,
		manual: true,
		enabled: updated,
	});

	useEffect(() => {
		if (savedProject?.id) setCurrentProject(savedProject);
	}, [savedProject]);

	useEffect(() => {
		setUpdatedProject(currentProject);
		setMembers(currentProject?.members);
		setCurrentUser(currentProject?.user);
		setOwnerBalance(currentProject?.user?.balance);
	}, [currentProject]);

	useEffect(() => {
		let obj = {};
		currentProject?.members.length &&
			currentProject.members.forEach((mem) => {
				if (mem.id !== user.info.id) {
					obj[mem.id] = mem.balance;
				}
			});
		setBalances(obj);
	}, [currentProject]);

	const updateProject = async (body = updatedProject) => {
		try {
			await axios
				.put(`/api/users/${user?.info.id}/projects/${projectID}`, body)
				.then((res) => {
					if (res.data.status === 200) {
						setUpdated(true);
					}
				})
				.catch((err) => setErrorText("There was an error:", err));
		} catch (error) {
			console.log(error);
		}
	};

	const deleteHandler = async (e) => {
		const data = await deleteProject(user.info.id, projectID);
		if (data.status === 200) navigate("/");
	};

	useEffect(() => {
		if (updatedProject?.quorum !== currentProject?.quorum) {
			setUnsaved(true);
			return;
		}
		if (ownerBalance !== currentUser?.balance && ownerBalance > 0) {
			setUnsaved(true);
			return;
		} else {
			setUnsaved(false);
		}
	}, [ownerBalance, updatedProject]);

	return (
		<div className="w-full h-full flex flex-col">
			<ProjectHeading />
			<div className="w-full h-full overflow-y-auto flex flex-col lg:flex-row p-4 shadow-lg rounded-lg text-sm bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47]">
				<SettingsNav />
				<div className="flex w-full lg:mx-4 flex-col gap-1">
					<ProjectSettings
						updateProject={updateProject}
						setUpdatedProject={setUpdatedProject}
						updatedProject={updatedProject}
					/>
					{/* <MergeRequestBehavior /> */}
					<Community
						ownerBalance={ownerBalance}
						setOwnerBalance={setOwnerBalance}
						setBalances={setBalances}
						balances={balances}
						setMembers={setMembers}
						members={members}
						setCurrentUser={setCurrentUser}
						currentUser={currentUser}
						setUpdatedProject={setUpdatedProject}
						updatedProject={updatedProject}
						updateProject={updateProject}
					/>
					{/* 	<CreditBehavior />*/}
					<div className="w-full flex items-start">
						<button
							type="button"
							className="border border-1 rounded-md px-5 py-1 border-[#313131] dark:border-white disabled:opacity-50 dark:text-white"
							onClick={() => updateProject({ ...updatedProject, balances })}
							disabled={!unsaved}
						>
							Save
						</button>
						<span className="text-red-500 ml-2">
							{errorText !== "" && errorText}
						</span>
					</div>
					<Mode
						updateProject={updateProject}
						updatedProject={updatedProject}
						setUpdatedProject={setUpdatedProject}
						deleteHandler={deleteHandler}
					/>
				</div>
			</div>
		</div>
	);
}
