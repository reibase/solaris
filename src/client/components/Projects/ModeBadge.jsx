import React from "react";

export default function ModeBadge({ project }) {
	return project.live ? (
		<span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] ring-1 ring-inset ring-[#1C7737]/10 dark:bg-[#185B2E] dark:text-[#7FEDA2] dark:ring-[#7FEDA2]/50">
			LIVE
		</span>
	) : (
		<span className="flex items-center justify-center mx-2 font-semibold bg-gray-100 text-[10px] px-[10px] h-[18px] rounded-md text-gray-500 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-200/50">
			TEST
		</span>
	);
}
