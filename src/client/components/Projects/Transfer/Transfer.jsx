import React from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import githubLogo from "../../../assets/github.svg";
import githubLogoDarkMode from "../../../assets/github-darkmode.svg";
import gitlabLogo from "../../../assets/gitlab.svg";
import { useStore } from "../../../store.js";
import ExternalLink from "../../../assets/ExternalLink.svg";
import darkDataTransfer from "../../../assets/darkDataTransfer.svg";
import darkGroup from "../../../assets/darkGroup.svg";
import darkSettings from "../../../assets/darkSettings.svg";
import darkExternalLink from "../../../assets/darkExternalLink.svg";
import Group from "../../../assets/Group.svg";
import Complete from "./Complete.jsx";
import UserAmount from "./UserAmount.jsx";
import Review from "./Review.jsx";
import ContinueTransferButton from "./ContinueTransferButton.jsx";

export default function Transfer() {
	const recipientName = useRef("");
	const [index, setIndex] = useState(0);
	const { dark, user } = useStore();
	let { id } = useParams();

	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};

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
	const { data, isFetching } = useQuery({
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
				.post(`/api/projects/${data?.id}/transfer`, {
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
						balance={data?.user?.balance}
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
		// wrapper
		<div className="w-full h-full flex flex-col gap-[10px]">
			{/* header */}
			<div className="w-full h-50 items-start justify-start px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{/* top row of header */}
				<div className="flex flex-row w-full justify-between">
					{/* top left of header */}
					<div className="flex flex-row items-center gap-[20px]">
						<span className="font-semibold text-lg tracking-wide dark:text-white">
							{data?.title}
						</span>
						<span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
							{data?.live ? `LIVE` : `TEST`}
						</span>
					</div>
					{/* top right of header */}
					<span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
						{data?.user?.balance} Credits
					</span>
				</div>

				<span className="mt-1 mb-3 text-[#313131] dark:text-[#8B929F]">
					Added on {data?.createdAt.slice(0, 10)}
				</span>

				{/* bottom row of header  */}
				<div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
					<a href={data?.url} target="_blank">
						<div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
							<div className="flex gap-[10px]">
								<img className="w-[14px]" src={icon[data?.host]} />
								<span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
									{data?.identifier} on {data?.host}
								</span>
							</div>
							<img src={dark ? darkExternalLink : ExternalLink} />
						</div>
					</a>

					<div className="flex items-center gap-[20px]">
						<div className="flex gap-[7px]">
							<img className="w-[20px]" src={dark ? darkGroup : Group} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Community
							</p>
						</div>
						<div className="flex gap-[7px]">
							<img src={darkDataTransfer} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Transfer
							</p>
						</div>
						<div className="flex gap-[7px]">
							<img src={darkSettings} />
							<p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
								Settings
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full h-full items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				{transferComponentHandler()}
				<ContinueTransferButton
					clicked={clicked}
					setClicked={setClicked}
					transferData={transferData}
					setIndex={setIndex}
					index={index}
					balance={data?.user.balance}
				/>
			</div>
		</div>
	);
}