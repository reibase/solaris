import React from "react";
import SliderComponent from "./SliderComponent";

export default function ProjectSettings({
	updatedProject,
	project,
	changeHandler,
	setUpdatedProject,
}) {
	// const creditAmounts = [
	// 	{
	// 		value: 100,
	// 		label: "100",
	// 	},
	// 	{
	// 		value: 1000,
	// 		label: "1000",
	// 	},
	// 	{
	// 		value: 10_000,
	// 		label: "10,000",
	// 	},
	// ];
	if (!updatedProject?.creditAmount) {
		return "loading";
	}
	return (
		<div className="w-full text-[#313131] dark:text-white">
			<span className="text-[14px]">Project Settings</span>
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
			<div className="w-full text-[11px] my-3">Total Project Credits: 1000</div>
			<SliderComponent
				updatedProject={updatedProject}
				name="quorum"
				setUpdatedProject={setUpdatedProject}
				title={"Minimum required to close voting:"}
				value={updatedProject?.quorum}
				min={updatedProject.creditAmount / 100}
				step={updatedProject.creditAmount / 100}
				max={updatedProject?.creditAmount}
				marks={[
					{
						value: updatedProject.creditAmount / 100,
						label: updatedProject.creditAmount / 100,
					},
					{
						value: updatedProject.creditAmount / 2,
						label: updatedProject.creditAmount / 2,
					},
					{
						value: updatedProject?.creditAmount,
						label: updatedProject?.creditAmount,
					},
				]}
			/>
		</div>
	);
}
