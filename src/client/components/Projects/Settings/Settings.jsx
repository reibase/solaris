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
	let { id } = useParams();
	const navigate = useNavigate();
	const { dark, user } = useStore();
	const [unsaved, setUnsaved] = useState(false);
	const { getUserProject } = httpService();

	const { data: project, isFetching } = useQuery(
		["project", { userID: user?.info.id, projectID: id }],
		getUserProject
	);

	const [updatedProject, setUpdatedProject] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [members, setMembers] = useState([]);

	useEffect(() => {
		setUpdatedProject(project);
		setMembers(project?.members);
		setCurrentUser(project?.user);
	}, [project]);

	console.log("proj", project);
	const [ownerBalance, setOwnerBalance] = useState(0);

	const [balances, setBalances] = useState({});

	const updateProject = async () => {
		try {
			await axios.put(`/api/users/${id}/projects/${project?.id}`, {
				...updatedProject,
				balances,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const changeHandler = (event, newValue) => {};

	const submitHandler = (e) => {
		e.preventDefault();
		updateProject();
	};

	const deleteHandler = async (e) => {
		e.preventDefault();
		try {
			await axios
				.delete(`/api/users/${user.info.id}/projects/${id}`)
				.then((res) => {
					if (res.data.status === 200) {
						navigate("/");
					}
				});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// if (updatedProject.creditAmount !== project.creditAmount) {
		// 	setUnsaved(true);
		// 	return;
		// }
		if (updatedProject?.quorum !== project?.quorum) {
			setUnsaved(true);
			return;
		}
		if (updatedProject?.live !== project?.live) {
			setUnsaved(true);
			return;
		}
		if (ownerBalance !== currentUser?.balance) {
			setUnsaved(true);
			return;
		} else {
			setUnsaved(false);
		}
	}, [ownerBalance, updatedProject]);

	return (
		<div className="w-full h-full flex flex-col">
			<ProjectHeading project={project} />
			<div className="w-full h-full overflow-y-auto flex lg:flex-row flex-col justify-between p-4 shadow-lg rounded-lg text-sm bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47] gap-12">
				<SettingsNav />
				<div className="flex w-full lg:w-3/4 flex-col gap-6">
					<ProjectSettings
						changeHandler={changeHandler}
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
						changeHandler={changeHandler}
						setUpdatedProject={setUpdatedProject}
						updatedProject={updatedProject}
					/>
					{/* 	<CreditBehavior />*/}
					<Mode
						updatedProject={updatedProject}
						setUpdatedProject={setUpdatedProject}
						deleteHandler={deleteHandler}
					/>
				</div>
				<div className="w-1/6 flex justify-center items-start">
					<button
						type="button"
						className="border lg:fixed border-1 rounded-md px-5 py-1 border-[#313131] dark:border-white disabled:opacity-50 dark:text-white"
						onClick={(e) => submitHandler(e)}
						disabled={!unsaved}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
