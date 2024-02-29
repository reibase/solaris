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
				{index > 0 && (
					<button
						onClick={() => backHandler()}
						className="mt-2 py-1.5 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47] disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-[#bg-gray-400]"
					>
						Make a change
					</button>
				)}
			</div>
			<div>
				<button
					onClick={() => continueHandler()}
					className="mt-2 py-1.5 w-24 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47] disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-[#bg-gray-400]"
					disabled={disabled}
				>
					{index < 1 ? `Continue` : `Submit`}
				</button>
			</div>
		</div>
	);
}
