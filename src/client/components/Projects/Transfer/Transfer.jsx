import React from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import githubLogo from "../../../assets/github.svg";
import githubLogoDarkMode from "../../../assets/github-darkmode.svg";
import gitlabLogo from "../../../assets/gitlab.svg";
import { useStore } from "../../../store.js";
import Complete from "./Complete.jsx";
import UserAmount from "./UserAmount.jsx";
import Review from "./Review.jsx";
import ContinueTransferButton from "./ContinueTransferButton.jsx";
import ProjectHeading from "../ProjectHeading.jsx";

export default function Transfer() {
	const recipientName = useRef("");
	const [index, setIndex] = useState(0);
	const { dark, user } = useStore();
	let { id } = useParams();

	const [transferData, setTransferData] = useState({
		project: "",
		amount: 0,
		sender: user.info.id,
		recipient: null,
		recipientName: recipientName.current,
		recipientFound: false,
	});

	const getProject = async () => {
		try {
			const { data } = await axios
				.get(`/api/users/${user.info.id}/projects/${id}`)
				.then(({ data }) => {
					setTransferData({ ...transferData, project: data.data.title });
					return data;
				});
			return data;
		} catch (error) {
			console.log(error);
		}
	};
	const { data: project, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProject,
	});

	const findRecipient = async () => {
		try {
			await axios.get(`/api/users/${recipientName.current}`).then((res) => {
				if (res.data.status === 200) {
					console.log(res.data);
					setTransferData({
						...transferData,
						recipient: res.data.user.id,
						recipientName: res.data.user.username,
						recipientFound: true,
					});
				} else {
					setTransferData({ ...transferData, recipientFound: false });
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	const [clicked, setClicked] = useState(false);

	/// Transfer API logic:
	const postTransfer = async () => {
		try {
			const transferRes = await axios
				.post(`/api/projects/${project?.id}/transfer`, {
					sender: transferData.sender,
					recipient: transferData.recipient,
					amount: transferData.amount,
				})
				.then((res) => {
					console.log(res);
					if (res.data.status === 200) {
						setIndex(2);
					}
					return res.data;
				});
			return transferRes;
		} catch (error) {
			console.log(error);
		}
	};

	const { data: transferRes } = useQuery({
		queryKey: ["transfer"],
		queryFn: postTransfer,
		enabled: clicked,
	});

	const changeHandler = (e) => {
		if (e.target.id === "recipientName" && e.target.value.length > 3) {
			findRecipient();
		}
		setTransferData({
			...transferData,
			[e.target.id]: e.target.value,
		});
	};

	const transferComponentHandler = () => {
		switch (index) {
			case 0:
				return (
					<UserAmount
						transferData={transferData}
						setTransferData={setTransferData}
						changeHandler={changeHandler}
						index={index}
						setIndex={setIndex}
						recipientName={recipientName}
						balance={project?.user?.balance}
					/>
				);
			case 1:
				return (
					<Review
						transferData={transferData}
						index={index}
						setIndex={setIndex}
						setClicked={setClicked}
					/>
				);
			case 2:
				return (
					<Complete
						transferRes={transferRes}
						index={index}
						setIndex={setIndex}
						transferData={transferData}
						setTransferData={setTransferData}
						changeHandler={changeHandler}
						recipientName={recipientName}
						setClicked={setClicked}
					/>
				);
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			{/* header */}
			<ProjectHeading project={project} />

			<div className="w-full h-full items-center justify-center px-1 lg:px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{transferComponentHandler()}
				<ContinueTransferButton
					clicked={clicked}
					setClicked={setClicked}
					transferData={transferData}
					setIndex={setIndex}
					index={index}
					balance={project?.user.balance}
				/>
			</div>
		</div>
	);
}
