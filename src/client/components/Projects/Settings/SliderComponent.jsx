import React from "react";
import Slider from "@mui/material/Slider";
import { Box } from "@mui/material";

export default function SliderComponent({
	title,
	marks,
	step,
	defaultValue,
	setUpdatedProject,
	name,
	min,
	max,
	value,
	updatedProject,
}) {
	const handleChange = (event, newValue) => {
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

	return (
		<div className="w-full flex flex-col">
			<span className="mb-1 text-[11px] text-gray-500 dark:text-gray-300">
				{title} <span className="text-gray-800 dark:text-white">{value}</span>
			</span>
			<Box sx={{ width: "100%" }}>
				<Slider
					onChange={handleChange}
					name={name}
					aria-label="Custom marks"
					marks={marks}
					size="small"
					max={max}
					step={step}
					min={min}
					value={value}
				/>
			</Box>
		</div>
	);
}
