import React from "react";

export default function Review({ transferData, setClicked }) {
	return (
		<div className="w-1/2 flex h-[300px] flex-col justify-center items-start">
			<div className="w-full text-lg pb-4">Transfer Summary:</div>
			<div className="flex justify-center flex-col items-center gap-[35px] w-full">
				<div className=" flex flex-col gap-[5px] items-center w-full">
					<div className="p-2 flex justify-between w-full">
						<p className="font-regular text-[#313131] font-[12px]">Project</p>
						<p className="font-regular font-[14px] text-[#3B82F6]">
							{transferData?.project}
						</p>
					</div>
					<div className="p-2 flex justify-between w-full bg-[#f0f0f0]">
						<p className="font-regular text-[#313131] font-[12px]">Recipient</p>
						<p className="font-regular font-[14px] text-[#313131] ">
							{transferData?.recipientName}
						</p>
					</div>
					<div className="p-2 flex justify-between w-full">
						<p className="font-regular text-[#313131] font-[12px]">Amount</p>
						<p className="font-regular font-[14px] text-[#313131]">
							{transferData.amount}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
