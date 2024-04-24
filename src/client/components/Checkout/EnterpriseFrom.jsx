import React from "react";

export default function EnterpriseFrom() {
	return (
		<div className="flex w-full h-full flex items-center gap-[10px]">
			<div className="p-1 md:p-4 block w-full h-full shadow-lg rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] md:justify-center overflow-auto">
				<span className="text-[20px] text-gray-600 m-4 dark:text-gray-300">
					Choose a plan
				</span>
				<div className="w-full md:h-full flex flex-col md:flex-row items-start justify-center gap-6"></div>
				<span className="text-[14px] text-gray-700 w-full flex justify-end">
					<button
						onClick={() => continueHandler()}
						className="self-end m-2 w-[160px] py-2 rounded-md text-white rounded-md bg-gray-700 cursor-pointer border border-transparent dark:bg-[#0F172A]/50 dark:text-white dark:border-[#8B929F]"
					>
						Continue
					</button>
				</span>
			</div>
		</div>
	);
}
