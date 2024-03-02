import React from "react";
import { useState, useEffect } from "react";
import { useStore } from "../../store.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import ProjectHeading from "./ProjectHeading.jsx";

export default function Settings() {
	let { id } = useParams();
	const navigate = useNavigate();
	const { dark, user } = useStore();

	const getProject = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects/${id}`)
				.then(({ data }) => data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { data: project, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	const [updatedProject, setUpdatedProject] = useState(project);

	useEffect(() => {
		setUpdatedProject(project);
	}, [project]);

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

	const changeHandler = (e) => {
		e.preventDefault();
		setUpdatedProject({ ...updatedProject, [e.target.id]: e.target.value });
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
	return (
		<div className="w-full h-full">
			<ProjectHeading project={project} />
			<div className="w-[50%] p-4 shadow-lg rounded-lg text-sm flex flex-col items-left bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47] justify-between gap-[25px]">
				<h2 className="text-[#313131] font-medium font-[12px] text-left dark:text-white">
					Project Settings
				</h2>
				<div className="w-[70%] mx-auto flex flex-col gap-[10px]">
					<p className="text-[#313131] dark:text-white font-semibold font-[12px]">
						Mode:
					</p>
					<div className="flex mx-auto w-[70%] ">
						<div className="flex flex-col items-center gap-[10px]">
							<div className="flex">
								<label
									for="live"
									className="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
								>
									Live
								</label>
								<input
									onChange={(e) =>
										setUpdatedProject({ ...updatedProject, live: true })
									}
									type="radio"
									id="live"
									value={true}
									checked={updatedProject?.live ? true : false}
									className="h-4 w-4 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:ring-0 ml-2"
								/>
							</div>
							<div className="flex">
								<label
									for="test"
									className="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
								>
									Test
								</label>
								<input
									onChange={(e) =>
										setUpdatedProject({ ...updatedProject, live: false })
									}
									type="radio"
									id="live"
									value={false}
									checked={updatedProject?.live ? false : true}
									className="h-4 w-4 square border-gray-300 focus:ring-0 ml-2"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex">
					<span
						onClick={(e) => deleteHandler(e)}
						className="cursor-pointer font-inter mx-auto text-[#D33131] border border-[#D33131] rounded-md py-[2px] px-[10px]"
					>
						Delete Project
					</span>
					<button
						onClick={(e) => submitHandler(e)}
						className="font-inter bg-[#313131] w-[109px] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
