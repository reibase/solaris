import React from "react";
import { useRef, useState } from "react";
import axios from "axios";
import add from "../../../assets/add.png";
import adddarkmode from "../../../assets/adddarkmode.png";
import { useStore } from "../../../store.js";

export default function AddUser() {
	const { dark, toggleDark, user } = useStore();
	const recipientName = useRef("");
	const [recipientErrorText, setRecipientErrorText] = useState(false);
	const [recipientError, setRecipientError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const [recipientData, setRecipientData] = useState({
		recipient: null,
		recipientFound: false,
	});

	const findRecipient = async () => {
		try {
			await axios.get(`/api/users/${recipientName.current}`).then((res) => {
				if (res.data.status === 200) {
					console.log(res.data);
					setRecipientData({
						recipient: res.data.user.id,
						recipientName: res.data.user.username,
						recipientFound: true,
					});
					setErrorText(true);
					setRecipientError(true);
					setRecipientErrorText(true);
					setRecipientData({ recipientFound: false });
				} else {
					console.log(res.data);
					setErrorText(true);
					setRecipientError(true);
					setRecipientErrorText(true);
					setRecipientData({ recipientFound: false });
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = (e) => {
		recipientName.current = e.target.value;
		console.log(e.target.value);

		if (recipientName.current.length > 3) {
			findRecipient();
		}
	};
	console.log(recipientName.current);
	return (
		<span className="flex flex-row items-center gap-2">
			<span className="text-[11px]  text-[#313131] dark:text-white">
				Invite a member:
			</span>
			<span className="">
				<input
					id="recipientName"
					type="text"
					onChange={(e) => handleSearch(e)}
					className={`w-full p-1 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400
					${errorText !== "" && "border-red-500 text-red-500 dark:border-red-500"}`}
				/>
			</span>
			<span className="w-content">
				<img
					className="h-5 ml-1 cursor-pointer"
					src={dark ? adddarkmode : add}
				/>
			</span>
			<div className="h-6 mb-2 text-sm text-red-500">
				{recipientError && recipientErrorText}
			</div>
		</span>
	);
}
