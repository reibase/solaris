import React from "react";

export default function SettingsNav() {
	return (
		<div>
			<ul className="flex flex-col w-full gap-2">
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Project Settings
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Credit Behavior
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Community
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Merge Request Behavior
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Mode
				</li>
			</ul>
		</div>
	);
}
