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
	changeHandler,
}) {
	return (
		<div className="w-full flex flex-col mt-2 mb-1 ">
			<span className="mb-1 text-[11px] text-[#313131] dark:text-white">
				{title} {value}
			</span>
			<Box sx={{ width: "100%" }}>
				<Slider
					onChange={changeHandler}
					name={name}
					aria-label="Custom marks"
					marks={marks}
					size="small"
					max={max}
					step={step}
					min={min}
					value={value}
					id={"test"}
				/>
			</Box>
		</div>
	);
}
