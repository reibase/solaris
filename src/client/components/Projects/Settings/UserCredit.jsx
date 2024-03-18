import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "../../../store.js";

import UserDropDown from "./UserDropDown.jsx";

export default function UserCredit({
	member,
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
		setBalances({ ...balances, [member.id]: balance });
	}, [balance]);
	console.log(balances);
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
