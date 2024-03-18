import React from "react";

export default function SettingsNav() {
	return (
		<div className="hidden lg:block w-1/6">
			<ul className="flex flex-col fixed w-full gap-2">
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Project
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Credits
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
					Community
				</li>
				<li className="cursor-pointer text-gray-500 hover:text-[#313131] dark:text-gray-300 dark:hover-text-white">
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
