import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../store.js";
import httpService from "../../services/httpService.js";
import check from "../../assets/check.png";

export default function WelcomeEnterprise() {
	const { user, setUserInfo } = useStore();
	const { getUser } = httpService();
	const navigate = useNavigate();

	const { data: userData, isFetching } = useQuery({
		queryKey: ["user", { userID: user?.info.id }],
		queryFn: getUser,
	});

	useEffect(() => {
		if (userData?.user) {
			let data = { isLoggedIn: true, info: userData?.user };
			setUserInfo(data);
			localStorage.setItem("user", JSON.stringify(data));
		}
	}, [userData]);

	return (
		<div className="flex w-full h-full flex items-center justify-center">
			<div className="p-10 flex w-2/3 h-5/6 gap-5 shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				<div className="flex flex-col items-center">
					<img src={check} className="h-14 w-14" />
					<span className="text-gray-600 leading-6 text-center text-[14px] font-light mt-2  dark:text-gray-300">
						Your request for Enterprise Access has been submitted and we will be
						in touch shortly. For now, enjoy the Free Tier while we process your
						request.
					</span>
				</div>
				<div className="text-[30px] font-light my-3 text-gray-500 dark:text-white">
					Welcome to Solaris
				</div>
				<div className="">
					<button
						onClick={() => navigate("/projects")}
						className="my-8 w-[220px] py-2 rounded-md text-white rounded-md bg-gray-700 cursor-pointer border border-transparent dark:bg-[#0F172A]/90 dark:text-white dark:border-[#8B929F]"
					>
						Continue to my projects
					</button>
				</div>
			</div>
		</div>
	);
}
