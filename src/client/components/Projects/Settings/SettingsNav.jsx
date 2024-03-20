import React from "react";

export default function SettingsNav() {
	return (
		<div className="hidden lg:block lg:w-1/5">
			<ul className="flex flex-col fixed gap-2">
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Project
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Credits
				</li>
				<li className="cursor-auto text-gray-300 hover:text-[#313131] dark:text-gray-400 dark:hover-text-white">
					Community
				</li>
				<li className="cursor-pointer text-gray-300 hover:text-[#313131] dark:text-gray-400 dark:hover-text-white">
					Merge Requests
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Mode
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Delete Project
				</li>
			</ul>
		</div>
	);
}
