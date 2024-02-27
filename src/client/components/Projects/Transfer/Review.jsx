import React from "react";

export default function Review({ data, index, setIndex }) {
	return (
		<div className="flex flex-col items-center gap-[35px] w-[66%]">
			<div className=" flex flex-col gap-[5px] items-center w-full">
				<div className="px-[6px] flex justify-between w-[66%]">
					<p className="font-regular text-[#313131] font-[12px]">Project</p>
					<p className="font-regular font-[14px] text-[#313131]">
						{data.identifier}
					</p>
				</div>
				<div className="px-[6px] flex justify-between w-[66%] bg-[#f0f0f0]">
					<p className="font-regular text-[#313131] font-[12px]">Recipient</p>
					<p className="font-regular font-[14px] text-[#3B82F6]">{data.user}</p>
				</div>
				<div className="px-[6px] flex justify-between w-[66%]">
					<p className="font-regular text-[#313131] font-[12px]">Amount</p>
					<p className="font-regular font-[14px] text-[#313131]">
						{data.sentAmount}
					</p>
				</div>
			</div>
		</div>
	);
}
