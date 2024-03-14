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

export default function Settings() {
	let { id } = useParams();
	const navigate = useNavigate();
	const { dark, user } = useStore();
	const [unsaved, setUnsaved] = useState(false);

	// const getProject = async () => {
	// 	try {
	// 		const { data } = await axios
	// 			.get(`/api/users/${user.info.id}/projects/${id}`)
	// 			.then(({ data }) => data);
	// 		return {
	// 			id: 1,
	// 			title: "jex441/demo",
	// 			creditAmount: 10000,
	// 			quorum: 5001,
	// 			createdAt: "20230303030303202",
	// 		};
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// const { data: project, isFetching } = useQuery({
	// 	queryKey: ["projects"],
	// 	queryFn: getProject,
	// });
	const project = {
		id: 1,
		title: "jex441/demo",
		creditAmount: 10000,
		quorum: 5100,
		createdAt: "20230303030303202",
	};
	const [updatedProject, setUpdatedProject] = useState(project);

	const updateProject = async () => {
		try {
			await axios.put(
				`/api/users/${id}/projects/${project?.id}`,
				updatedProject
			);
		} catch (error) {
			console.log(error);
		}
	};

	const changeHandler = (event, newValue) => {
		let newQuorum = updatedProject.quorum;
		if (event.target.name === "creditAmount") {
			newQuorum = newValue / 2;
			setUpdatedProject({
				...updatedProject,
				[event.target.name]: newValue,
				quorum: newQuorum,
			});
		} else {
			setUpdatedProject({
				...updatedProject,
				[event.target.name]: newValue,
			});
		}
	};
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

	console.log(updatedProject);
	useEffect(() => {
		if (updatedProject.creditAmount !== project.creditAmount) {
			setUnsaved(true);
		}
		if (updatedProject.quorum !== project.quorum) {
			setUnsaved(true);
		}
		if (updatedProject.mode !== project.mode) {
			setUnsaved(true);
		} else {
			setUnsaved(false);
		}
	}, [updatedProject]);
	console.log(updatedProject);
	return (
		<div className="w-full h-full">
			<ProjectHeading project={project} />
			<div className="w-full overflow-y-auto flex flex-row justify-between p-6 shadow-lg rounded-lg text-sm bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47] gap-12">
				<SettingsNav />
				<div className="flex w-1/2 flex-col">
					<ProjectSettings
						changeHandler={changeHandler}
						setUpdatedProject={setUpdatedProject}
						updatedProject={updatedProject}
					/>
					{/* <MergeRequestBehavior />
					<Community />
					<CreditBehavior />*/}
					<Mode
						updatedProject={updatedProject}
						setUpdatedProject={setUpdatedProject}
						deleteHandler={deleteHandler}
					/>
				</div>
				<div className="w-1/6 flex justify-center items-start">
					<button
						type="button"
						className="border border-1 rounded-md px-5 py-1 border-[#313131] disabled:opacity-50"
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
