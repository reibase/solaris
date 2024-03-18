import React from "react";
import { useState } from "react";
import SliderComponent from "./SliderComponent";
import { useStore } from "../../../store.js";

import AddUser from "./AddUser.jsx";
export default function ProjectSettings({
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
		<div className="w-full text-[#313131] dark:text-white mb-2">
			<div className="w-full flex flex-col justify-start mb-1 lg:flex-row lg:justify-between lg:items-center">
				<span className="text-[14px]">Project Settings</span>
				<AddUser />
			</div>
			{/* <SliderComponent
				title={"Total Project Credits:"}
				updatedProject={updatedProject}
				min={100}
				max={10_000}
				setUpdatedProject={setUpdatedProject}
				marks={creditAmounts}
				step={null}
				name="creditAmount"
				value={updatedProject.creditAmount}
			/> */}
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
