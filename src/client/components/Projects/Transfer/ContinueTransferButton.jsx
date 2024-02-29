import React from "react";
import { useState, useEffect } from "react";

export default function ContinueTransferButton({
	transferData,
	index,
	setIndex,
	balance,
	setClicked,
}) {
	const [disabled, setDisabled] = useState(true);

	const backHandler = () => {
		if (index < 1) {
			return;
		}
		if (index === 1) {
			setIndex(index - 1);
		}
	};

	const continueHandler = () => {
		if (index === 0) {
			setIndex(index + 1);
		}
		if (index === 1) {
			setClicked(true);
		}
	};

	useEffect(() => {
		if (
			transferData.recipient !== null &&
			transferData.amount > 0 &&
			transferData.amount <= balance
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	});

	if (index === 2) {
		return null;
	}

	return (
		<div className="flex flex-row w-1/2 justify-between">
			<div>
				<button
					onClick={() => backHandler()}
					className="font-inter bg-[#313131] py-[4px] w-[200px] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1 mt-[40px]"
				>
					Back
				</button>
			</div>
			<div>
				<button
					onClick={() => continueHandler()}
					className="font-inter bg-[#313131] py-[4px] w-[200px] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1 mt-[40px]"
					disabled={disabled}
				>
					{index < 1 ? `Continue` : `Submit`}
				</button>
			</div>
		</div>
	);
}
