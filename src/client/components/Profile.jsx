import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import httpService from "../services/httpService.js";
import { useStore } from "../store.js";
import externalLink from "../assets/externallink.png";
import Modal from "../components/Projects/Settings/Modal.jsx";

const Profile = () => {
	const { billingPortalSession, deleteUser } = httpService();
	const [clicked, setClicked] = useState(false);
	const { dark, user } = useStore();
	const [modalOptions, setModalOptions] = useState({ showModal: false });
	const navigate = useNavigate();

	const { data: planData, isFetching } = useQuery({
		queryKey: [
			"plan",
			{
				userID: user?.id,
				setClicked,
			},
		],
		queryFn: billingPortalSession,
		manual: true,
		enabled: clicked,
	});

	const deleteUserHandler = () => {
		setModalOptions({
			title: "Delete Account",
			description:
				"Are you sure you would like to delete your account and all associated data from Solaris? This cannot be undone.",
			setModalOptions: setModalOptions,
			showModal: true,
			cb: deleteUser,
			config: {
				prompts: { 0: "Yes, I am sure", 1: "No, Take me back" },
				args: { userID: user.id },
				colors: {
					primary: "red-500",
					primaryDark: "red-500",
					secondary: "gray-600",
					secondaryDark: "gray-300",
				},
			},
		});
	};

	return (
		<div className="p-4 w-[590px] h-full shadow-lg rounded-lg flex flex-col bg-white dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
			<span
				className="w-full mb-4
            dark:text-[#DDDCDC] text-[16px] text-gray-700 dark:text-white"
			>
				Account
			</span>
			<div className="flex flex-row gap-7 w-full h-full">
				<div className="w-1/3 flex justify-center">
					<img
						className="w-16 h-16 lg:w-28 lg:h-28 rounded-full object-cover bg-gray-300"
						src={user?.avatar}
						alt="User avatar"
					/>
				</div>
				<div className="flex flex-col gap-4 w-full text-[12px]">
					<section className="w-full pb-4 mb-2 border-b gap-2 flex flex-col">
						<span className="text-[16px] text-gray-700 dark:text-white">
							Profile
						</span>
						<div className="flex flex-row gap-4 justify-between">
							<span className="text-gray-400 dark:text-gray-200">Username</span>
							<span className="text-gray-700 dark:text-white">
								{user.username}
							</span>
						</div>
						<div className="flex flex-row gap-4 justify-between">
							<span className="text-gray-400 dark:text-gray-200">Email</span>
							<span className="text-gray-700 dark:text-white">
								{user.email}
							</span>
						</div>
					</section>
					<section className="w-full pb-4 mb-2 border-b gap-2 flex flex-col">
						<span className="text-[16px] text-gray-700 dark:text-white">
							Subscription
						</span>
						<div className="flex flex-row gap-4 justify-between">
							<span className="text-gray-400 dark:text-gray-200">
								Plan Type
							</span>
							<span className="text-gray-700 dark:text-white flex flex-col items-end gap-1">
								<span>{user.plan[0].toUpperCase() + user?.plan.slice(1)}</span>
								{user.plan === "free" && (
									<span
										className="text-gray-400 underline cursor-pointer dark:text-gray-300"
										onClick={() => {
											navigate("/plans");
										}}
									>
										View Plans
									</span>
								)}
							</span>
						</div>
						<div className="flex flex-row gap-4 justify-between">
							{user.plan !== "free" && (
								<span
									onClick={() => setClicked(true)}
									className="text-gray-700 dark:text-gray-200 flex flex-row items-center underline cursor-pointer"
								>
									Manage Subscription{" "}
									<img src={externalLink} className="px-2 h-3" />
								</span>
							)}
						</div>
					</section>

					<div className="flex flex-col gap-[20px] h-full justify-end items-end">
						<div
							onClick={() => deleteUserHandler()}
							className="flex justify-center p-1 w-[150px] rounded-md border border-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
						>
							Delete Account
						</div>
					</div>
					<Modal modalOptions={modalOptions} />
				</div>
			</div>
		</div>
	);
};

export default Profile;
