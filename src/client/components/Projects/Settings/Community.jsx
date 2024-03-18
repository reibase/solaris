import React, { useEffect } from "react";
import { useStore } from "../../../store.js";
import UserCredit from "./UserCredit.jsx";
import OwnerCredit from "./OwnerCredit.jsx";
import add from "../../../assets/add.png";
import adddarkmode from "../../../assets/adddarkmode.png";
import { useState } from "react";
import Slider from "@mui/material/Slider";
export default function Community({
	updatedProject,
	setUpdatedProject,
	currentUser,
	setCurrentUser,
	setMembers,
	members,
	newTotal,
	setNewTotal,
}) {
	const { dark, user } = useStore();
	const [errorText, setErrorText] = useState("");
	const [balances, setBalances] = useState({});

	useEffect(() => {
		const obj = {};
		updatedProject?.members.forEach((mem) => {
			console.log(mem.username);
			if (mem.id !== currentUser.id) {
				obj[mem.username] = mem.balance;
			}
		});
		setBalances(obj);
	}, []);

	return (
		<div className="flex flex-col gap-1">
			<div className="w-full flex flex-col justify-start lg:flex-row lg:justify-between lg:items-center">
				<span className="text-[14px] text-[#313131] dark:text-white">
					Community
				</span>
				<span className="flex flex-row items-center gap-2">
					<span className="text-[11px]  text-[#313131] dark:text-white">
						Add member:
					</span>
					<span className="">
						<input
							type="text"
							className={` w-full p-1 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400
					${errorText !== "" && "border-red-500 text-red-500 dark:border-red-500"}`}
						/>
					</span>
					<span className="w-content">
						<img
							className="h-5 ml-1 cursor-pointer"
							src={dark ? adddarkmode : add}
						/>
					</span>
				</span>
			</div>
			<span className="text-[11px] text-[#313131] dark:text-white">
				Credit Allocation
			</span>
			<div>
				<OwnerCredit
					owner={true}
					member={currentUser}
					updatedProject={updatedProject}
					setUpdatedProject={setUpdatedProject}
					setCurrentUser={setCurrentUser}
					currentUser={currentUser}
					balances={balances}
				/>
				{members
					?.filter((member) => member.id !== user.info.id)
					.map((member) => (
						<UserCredit
							newTotal={newTotal}
							setNewTotal={setNewTotal}
							setMembers={setMembers}
							members={members}
							key={member.id}
							currentUser={currentUser}
							member={member}
							updatedProject={updatedProject}
							setUpdatedProject={setUpdatedProject}
							setCurrentUser={setCurrentUser}
							balances={balances}
							setBalances={setBalances}
						/>
					))}
			</div>
			<span>
				<button
					type="button"
					className="border border-1 rounded-md py-1 px-3 border-[#313131] dark:border-white disabled:opacity-50 dark:text-white"
				>
					Save Changes
				</button>
			</span>
		</div>
	);
}
