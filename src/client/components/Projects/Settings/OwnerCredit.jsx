import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "../../../store.js";
import verified from "../../../assets/verified.png";

export default function OwnerCredit({
	currentUser,
	balances,
	ownerBalance,
	setOwnerBalance,
}) {
	const { dark, user } = useStore();

	useEffect(() => {
		let int = 0;
		for (let key in balances) {
			int += balances[key];
		}
		setOwnerBalance(1000 - int);
	}, [balances]);

	if (!currentUser?.avatar) {
		return "loading";
	}
	return (
		<div className="my-4">
			<span className="flex my-1 flex-row justify-between gap-1">
				<span className="w-content flex items-center flex-row gap-1">
					<span className="flex flex-row gap-1">
						<img src={currentUser.avatar} className="h-4 rounded-xl mx-1" />
					</span>
					<span className="text-[#313131] dark:text-white">
						{currentUser.username}
					</span>
					<span>
						<img className="h-4 mx-2" src={verified} />
					</span>
				</span>
				<span className={ownerBalance < 0 && "text-red-500"}>
					{ownerBalance < 0 ? "Insufficient credits" : ownerBalance}
				</span>
			</span>

			<Slider
				disabled={true}
				aria-label="Custom marks"
				size="small"
				marks={[
					{ value: 0, label: 0 },
					{ value: 250, label: 250 },
					{ value: 500, label: 500 },
					{ value: 750, label: 750 },
					{ value: 1000, label: 1000 },
				]}
				max={1000}
				step={10}
				value={ownerBalance}
			/>
		</div>
	);
}
