import React from "react";
import { useStore } from "../../../store";
import { useState } from "react";
import { Link } from "react-router-dom";
import more from "../../../assets/more.png";
import moredarkmode from "../../../assets/moredarkmode.png";

export default function UserDropDown() {
	const { dark, toggleDark, user } = useStore();
	const [visible, setVisible] = useState(false);
	const logoutHandler = () => {
		localStorage.removeItem("user");
		setVisible(false);
	};

	return (
		<div className="relative inline-block text-left">
			<img
				onClick={() => setVisible(!visible)}
				type="button"
				id="menu-button"
				aria-expanded="true"
				aria-haspopup="true"
				className="h-4 cursor-pointer"
				src={dark ? more : moredarkmode}
			/>
			{visible ? (
				<div
					className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-[#0F172A] rounded-md bg-white dark:bg-[#373D47] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<div className="py-1" onClick={() => setVisible(false)} role="none">
						<Link
							to="/projects"
							className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0"
						>
							Remove User
						</Link>
					</div>
					<div className="py-1" onClick={() => setVisible(false)} role="none">
						<Link
							to="/"
							className="opacity-50 cursor-auto text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
							role="menuitem"
							tabindex="-1"
							id="menu-item-2"
						>
							Profile - coming soon
						</Link>
					</div>
				</div>
			) : null}
		</div>
	);
}
