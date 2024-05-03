import React from "react";
import { useState } from "react";
import SliderComponent from "./SliderComponent";
import { useStore } from "../../../store.js";

import AddUser from "./AddUser.jsx";
export default function ProjectSettings({
	updateProject,
	updatedProject,
	project,
	changeHandler,
	setUpdatedProject,
}) {
	const { dark, user } = useStore();

	const [errorText, setErrorText] = useState("");

	if (!updatedProject?.creditAmount) {
		return "loading";
	}
	return (
		<div className="w-full justify-between text-charcoal dark:text-white mb-1">
			<div className="w-full flex mb-1 flex-row justify-between">
				<span className="text-[14px]">Project Settings</span>
				<AddUser
					updateProject={updateProject}
					setUpdatedProject={setUpdatedProject}
					updatedProject={updatedProject}
				/>
			</div>
			<div className="text-gray-500 text-[11px] dark:text-gray-300 mb-1">
				Total Project Credits:{" "}
				<span className="text-gray-800 dark:text-white">
					{updatedProject?.creditAmount}
				</span>
			</div>
			<SliderComponent
				updatedProject={updatedProject}
				name="quorum"
				setUpdatedProject={setUpdatedProject}
				title={"Minimum required to close voting:"}
				value={updatedProject?.quorum}
				min={0}
				step={updatedProject.creditAmount / 100}
				max={updatedProject?.creditAmount}
				marks={[
					{ value: 0, label: 0 },
					{ value: 250, label: 250 },
					{ value: 500, label: 500 },
					{ value: 750, label: 750 },
					{ value: 1000, label: 1000 },
				]}
			/>
		</div>
	);
}
