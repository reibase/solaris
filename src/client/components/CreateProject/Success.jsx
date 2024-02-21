import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Success({ project, user }) {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [incomplete, setIncomplete] = useState(true);

	const createProject = async () => {
		try {
			const { status, data } = await axios
				.post(`/api/users/${user.id}/projects`, {
					title: project.title,
					identifier: project.identifier,
					installationID: project.installationID,
					owner: user.id,
					hostID: project.hostID,
					url: project.url,
					host: project.host,
					quorum: project.quorum,
					creditAmount: project.creditAmount,
					clawBack: project.clawBack,
					isPrivate: project.isPrivate,
					headless: project.headless,
				})
				.then((res) => {
					return res;
				});
			status === 200 &&
				setText("You have successfully created a project on Solaris.");
			setIncomplete(false);
			return data;
		} catch (error) {
			setText(`There was an error creating this project: ${error.message}`);
			console.log(error);
		}
	};

	const { status, data, isFetching } = useQuery({
		queryKey: ["project"],
		queryFn: createProject,
		enabled: user.id !== null && incomplete,
	});
	if (isFetching) {
		<div className="flex flex-col justify-center items-center h-full gap-4 w-full mb-4  dark:divide-[#373D47] dark:text-white">
			Loading
		</div>;
	}
	return (
		<div className="flex flex-col justify-center items-center h-full gap-4 w-full mb-4  dark:divide-[#373D47] dark:text-white">
			{text}
			<button onClick={() => navigate("/projects")}>View Projects</button>
		</div>
	);
}
