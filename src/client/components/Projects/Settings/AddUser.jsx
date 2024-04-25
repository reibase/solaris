import React from "react";
import { useRef, useState } from "react";
import axios from "axios";
import add from "../../../assets/add.png";
import adddarkmode from "../../../assets/adddarkmode.png";
import { useStore } from "../../../store.js";

export default function AddUser({
	updateProject,
	setUpdatedProject,
	updatedProject,
}) {
	const { dark, toggleDark, user } = useStore();
	const recipientName = useRef("");
	const [recipientErrorText, setRecipientErrorText] = useState("");

	const [recipientData, setRecipientData] = useState({
		recipient: null,
		recipientFound: false,
	});

	const findRecipient = async () => {
		try {
			setRecipientErrorText("");
			setRecipientData({ recipientFound: false });
			await axios
				.get(`/api/users/username/${recipientName.current}`)
				.then((res) => {
					console.log(res);
					if (res.data.status === 200) {
						setRecipientData({
							recipient: res.data.user.id,
							recipientName: res.data.user.username,
							recipientFound: true,
						});
						recipientName.current = "";
						setRecipientErrorText("");
						setUpdatedProject({
							...updatedProject,
							newMember: { id: res.data.user.id },
						});
					} else {
						setRecipientErrorText("User not found");
						setRecipientData({ recipientFound: false });
					}
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = (e) => {
		recipientName.current = e.target.value;
		if (recipientName.current.length > 3) {
			findRecipient();
		}
	};

	return (
		<div className="flex flex-col justify-between">
			<span className="flex flex-row items-center justify-end gap-1 w-full">
				<span className="text-[11px] text-[#313131] dark:text-white">
					Add a new member:
				</span>
				<span className="">
					<input
						id="recipientName"
						type="text"
						placeholder="username"
						onChange={(e) => handleSearch(e)}
						className={`w-full p-1 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400
					${
						recipientErrorText !== "" &&
						"border-red-500 text-red-500 dark:border-red-500"
					}`}
						disabled={updatedProject.members.length >= 5}
					/>
				</span>
				<span
					className=""
					disabled={updatedProject.members.length >= 5}
					onClick={() => {
						updateProject();
					}}
				>
					<img
						className="h-5 ml-1 cursor-pointer"
						src={dark ? adddarkmode : add}
					/>
				</span>
			</span>
			<div className="h-4 text-sm text-red-500">
				{recipientErrorText !== "" && recipientErrorText}
				{updatedProject?.members.length >= 5 &&
					"Plesase upgrade to add more team members."}
			</div>
		</div>
	);
}
