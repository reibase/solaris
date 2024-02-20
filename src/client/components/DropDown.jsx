import React from "react";
import { useStore } from "../store";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function DropDown() {
	const { dark, toggleDark, user } = useStore();
	const [visible, setVisible] = useState(false);

	const logoutHandler = () => {
		localStorage.removeItem("user");
		setVisible(false);
	};

	return (
		<div class="relative inline-block text-left">
			<img
				onClick={() => setVisible(!visible)}
				type="button"
				id="menu-button"
				aria-expanded="true"
				aria-haspopup="true"
				className="w-6 h-6 rounded-full object-cover cursor-pointer"
				src={user.info.avatar}
			/>
			{visible ? (
				<div
					class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-[#0F172A] rounded-md bg-white dark:bg-[#373D47] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<div class="py-1" onClick={() => setVisible(false)} role="none">
						<Link
							to="/projects"
							class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0"
						>
							My Projects
						</Link>
						<Link
							to="/create"
							class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-1"
						>
							Create New Project
						</Link>
					</div>
					<div class="py-1" onClick={() => setVisible(false)} role="none">
						<Link
							to="/profile"
							class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-2"
						>
							Profile
						</Link>
					</div>
					<div class="py-1" onClick={(e) => logoutHandler(e)} role="none">
						<a
							href="/api/auth/logout"
							class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-6"
						>
							Sign Out
						</a>
					</div>
				</div>
			) : null}
		</div>
	);
}
