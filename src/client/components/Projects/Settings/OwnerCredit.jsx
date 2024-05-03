import React, { useEffect } from "react";
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
		<div className="my-1">
			<span className="flex my-1 flex-row justify-between gap-1">
				<span className="w-content flex items-center flex-row gap-1">
					<span className="flex flex-row gap-1">
						<img src={currentUser.avatar} className="h-4 rounded-xl mx-1" />
					</span>
					<span className="text-charcoal dark:text-white">
						{currentUser.username}
					</span>
					<span>
						<img className="h-4 mx-1" src={verified} />
					</span>
					<span
						className={`text-gray-500 dark:text-gray-300 ${
							ownerBalance < 0 && "text-red-500"
						}`}
					>
						{ownerBalance < 0
							? "Insufficient credits"
							: `${ownerBalance} credits`}
					</span>
				</span>
			</span>

			<Slider
				disabled={true}
				aria-label="Custom marks"
				size="small"
				max={1000}
				step={10}
				value={ownerBalance}
			/>
		</div>
	);
}
