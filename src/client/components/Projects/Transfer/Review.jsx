import React from "react";

export default function Review({ transferData, setClicked }) {
	return (
		<div className="w-full lg:w-1/2 flex h-[300px] flex-col justify-center items-start">
			<div className="w-full text-lg dark:text-white">Transfer Summary:</div>
			<div className="text-slate-400 mt-1 pb-4">
				Please review before submiitting.
			</div>
			<div className="flex justify-center flex-col items-center gap-[35px] w-full">
				<div className=" flex flex-col gap-[5px] items-center w-full">
					<div className="p-2 flex justify-between w-full">
						<p className="font-regular text-[#313131] font-[12px] dark:text-white">
							Project
						</p>
						<p className="font-regular font-[14px] text-[#3B82F6]">
							{transferData?.project}
						</p>
					</div>
					<div className="p-2 flex justify-between w-full bg-[#f0f0f0] dark:bg-gray-900">
						<p className="font-regular text-[#313131] font-[12px] dark:text-white">
							Recipient
						</p>
						<p className="font-regular font-[14px] text-[#313131] dark:text-white">
							{transferData?.recipientName}
						</p>
					</div>
					<div className="p-2 flex justify-between w-full">
						<p className="font-regular text-[#313131] font-[12px] dark:text-white">
							Amount
						</p>
						<p className="font-regular font-[14px] text-[#313131] dark:text-white">
							{transferData.amount}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
