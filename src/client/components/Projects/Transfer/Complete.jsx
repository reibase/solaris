import React from "react";
import { formatDate } from "../formatting.js";
import { useEffect } from "react";

export default function Complete({
	transferRes,
	transferData,
	setTransferData,
	index,
	setIndex,
	recipientName,
	setClicked,
}) {
	useEffect(() => {
		if (transferRes.status === 200) {
			recipientName.current = "";
			setClicked(false);
			setTransferData({
				...transferData,
				amount: 0,
				recipient: null,
				recipientName: recipientName.current,
				recipientFound: false,
			});
		}
	}, [transferRes]);

	if (transferRes.status === 500) {
		return "There was an error processing this transfer.";
	}
	return (
		<div className="flex flex-col items-center gap-[35px]">
			<p className="font-regular font-[14px]  dark:text-white">
				Transfer Complete
			</p>
			<p className="font-regular leading-8 font-[14px] text-center w-[75%] dark:text-white">
				You have sent {transferRes?.amount} credits to{" "}
				{transferRes?.recipient.username} on{" "}
				{formatDate(transferRes?.createdAt.slice(0, 10))}
			</p>
			<p className="dark:text-white">
				Transaction ID: {transferRes?.transactionID}
			</p>
			<div className="flex flex-row w-1/2 justify-between">
				<div>
					<button
						onClick={() => setIndex(0)}
						className="font-inter bg-[#313131] py-[4px] w-[200px] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1 mt-[40px]"
					>
						Make another transfer
					</button>
				</div>
			</div>
		</div>
	);
}
