import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "../../../store.js";
import "./slider.css";
import UserDropDown from "./UserDropDown.jsx";

export default function UserCredit({
	member,
	setBalances,
	balances,
	updateProject,
	setUpdatedProject,
	updatedProject,
	disabled = false,
}) {
	const { dark, user } = useStore();
	const [balance, setBalance] = useState(member.balance);

	const handleChange = (event, newValue) => {
		setBalance(newValue);
		setBalances({ ...balances, [member.id]: newValue });
	};

	return (
		<div className="my-1">
			<span className="flex my-1 flex-row justify-between gap-1">
				<span className="w-content flex items-center flex-row gap-1">
					<span className="">
						<img src={member.avatar} className="h-4 rounded-xl mx-1" />
					</span>
					<span className="text-charcoal dark:text-white">
						{member.username}
					</span>
					<UserDropDown
						updateProject={updateProject}
						setUpdatedProject={setUpdatedProject}
						updatedProject={updatedProject}
						member={member}
					/>
					<span className="mx-2 text-gray-500 dark:text-gray-300">
						{balance} credits
					</span>
				</span>
			</span>
			<Slider
				disabled={disabled}
				onChange={handleChange}
				aria-label="Custom marks"
				valueLabelDisplay="auto"
				size="small"
				max={1000}
				step={10}
				min={0}
				value={balance}
				className={dark ? "sliderDark" : "slider"}
			/>
		</div>
	);
}
