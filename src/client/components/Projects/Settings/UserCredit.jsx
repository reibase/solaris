import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "../../../store.js";

import UserDropDown from "./UserDropDown.jsx";

export default function UserCredit({
	updatedProject,
	setUpdatedProject,
	member,
	currentUser,
	setCurrentUser,
	members,
	setMembers,
	newTotal,
	setNewTotal,
	setBalances,
	balances,
	disabled = false,
}) {
	const { dark, user } = useStore();
	const [balance, setBalance] = useState(member.balance);

	const handleChange = (event, newValue) => {
		setBalance(newValue);
	};

	useEffect(() => {
		setBalances({ ...balances, [member.username]: balance });
	}, [balance]);

	return (
		<div className="my-4">
			<span className="flex my-1 flex-row justify-between gap-1">
				<span className="w-content flex items-center flex-row gap-1">
					<span className="">
						<img src={member.avatar} className="h-4 rounded-xl mx-1" />
					</span>
					<span className="text-[#313131] dark:text-white">
						{member.username}
					</span>
					<span>
						<UserDropDown />
					</span>
				</span>
				<span>{balance}</span>
			</span>
			<Slider
				disabled={disabled}
				onChange={handleChange}
				aria-label="Custom marks"
				marks={[
					{ value: 0, label: 0 },
					{ value: 250, label: 250 },
					{ value: 500, label: 500 },
					{ value: 750, label: 750 },
					{ value: 1000, label: 1000 },
				]}
				valueLabelDisplay="auto"
				size="small"
				max={1000}
				step={10}
				min={0}
				value={balance}
			/>
		</div>
	);
}
