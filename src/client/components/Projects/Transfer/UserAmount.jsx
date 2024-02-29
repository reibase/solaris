import React from "react";
import { useState, useEffect } from "react";
export default function UserAmount({
	transferData,
	recipientName,
	changeHandler,
	balance,
}) {
	const [amountErrorText, setAmountErrorText] = useState(false);
	const [recipientErrorText, setRecipientErrorText] = useState(false);
	const [amountError, setAmountError] = useState(false);
	const [recipientError, setRecipientError] = useState(false);

	useEffect(() => {
		if (transferData.amount > balance) {
			setAmountError(true);
			setAmountErrorText("Amount exceeds current balance");
		}
		// if (transferData.amount < 1) {
		// 	setAmountError(true);
		// 	setAmountErrorText("Please enter a value greater than 1");
		// }
		if (transferData.amount > 0 && transferData.amount <= balance) {
			setAmountError(false);
		}
		if (recipientName.current.length > 3 && !transferData.recipientFound) {
			setRecipientError(true);
			setRecipientErrorText("User not found");
		}
		if (transferData.recipientFound) {
			setRecipientError(false);
		}
		if (recipientName.current < 3) {
			setRecipientError(false);
		}
	}, [transferData]);

	const handleSearch = (e) => {
		recipientName.current = e.target.value;
		changeHandler(e);
	};
	return (
		<div className="w-1/2 flex h-[300px] flex-col justify-center items-center">
			<div className="w-full text-lg pb-4">Transfer</div>
			<div class="w-full flex flex-col gap-2">
				<label
					for="name"
					className="font-inter font-regular text-[14px] dark:text-[#DDDCDC] text-gray-900"
				>
					Recipient
				</label>
				<input
					type="text"
					id="recipientName"
					className="rounded-md p-1 block w-full border border-gray-300 dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400"
					onChange={(e) => handleSearch(e)}
					required
				/>
				<div className="h-6 mb-2 text-sm text-red-500">
					{recipientError && recipientErrorText}
				</div>
			</div>
			<div class="w-full flex flex-col justify-start items-start gap-2">
				<label
					for="amount"
					id="amount"
					className="font-inter font-regular text-[14px] dark:text-[#DDDCDC] text-gray-900"
				>
					Amount
				</label>
				<input
					id="amount"
					type="number"
					className="w-full p-1 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400"
					onChange={(e) => changeHandler(e)}
					value={transferData.amount}
					required
				/>
				<div className="h-6 mb-2 text-sm text-red-500">
					{amountError && amountErrorText}
				</div>
			</div>
		</div>
	);
}
