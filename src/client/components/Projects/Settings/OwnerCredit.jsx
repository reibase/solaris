import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "../../../store.js";
import more from "../../../assets/more.png";
import moredarkmode from "../../../assets/moredarkmode.png";
import verified from "../../../assets/verified.png";

export default function OwnerCredit({
	currentUser,
	setCurrentUser,
	balances,
	disabled = false,
}) {
	const { dark, user } = useStore();
	const [val, setVal] = useState(currentUser.balance);

	useEffect(() => {
		let int = 0;
		for (let key in balances) {
			int += balances[key];
			console.log("int", int);
		}
		setVal(1000 - int);
	}, [balances]);
	console.log("val", val);
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
				<span>{currentUser.balance}</span>
			</span>
			<Slider
				disabled={true}
				aria-label="Custom marks"
				// marks={marks}
				size="small"
				max={1000}
				step={10}
				min={10}
				value={val}
			/>
		</div>
	);
}
