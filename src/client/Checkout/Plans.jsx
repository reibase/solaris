import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import { useStore } from "../store.js";
import httpService from "../services/httpService.js";
import check from "../assets/check.png";
import x from "../assets/x.png";

export default function Votes() {
	const { createCheckoutSession } = httpService();
	const { user } = useStore();
	const [clicked, setClicked] = useState(false);
	const plan = useRef("free");

	const { data: planData, isFetching } = useQuery({
		queryKey: [
			"plan",
			{
				userID: user?.info.id,
				plan: plan.current,
				mode: "subscription",
				setClicked,
			},
		],
		queryFn: createCheckoutSession,
		manual: true,
		enabled: clicked,
	});

	const clickHandler = async (selectedPlan) => {
		plan.current = selectedPlan;
		setClicked(true);
	};

	return (
		<div className="flex w-full h-full flex items-center gap-[10px]">
			<div className="p-4 block w-full h-5/6 shadow-lg gap-10 rounded-lg text-sm flex flex-row md:flex-row items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] lg:justify-between overflow-auto">
				<div className="w-full h-full p-4 flex flex-col justify-start">
					<span className="text-[14px] text-gray-600">Choose Plan</span>
					<div className="w-full mt-10 flex flex-row items-center justify-center divide-x">
						<div className="w-1/6 pt-7 flex flex-col justify-start">
							<span className="h-16 text-gray-500">Projects</span>
							<span className="h-16 text-gray-500">Team</span>
							<span className="h-16 text-gray-500">Support</span>
						</div>
						<div className="w-1/3 px-4 flex flex-col justify-center items-center">
							<span className="text-lg text-gray-600 mb-8">Free</span>
							<span className="h-16 text-gray-400">5</span>
							<span className="h-16 text-gray-400">10</span>
							<span className="h-16 text-gray-400">
								<img className="h-6" src={x} />
							</span>
							<button
								onClick={() => clickHandler("free")}
								className="mt-4 w-[160px] py-2 rounded-md bg-gray-800 text-white cursor-pointer"
							>
								Select Free
							</button>
						</div>
						<div className="w-1/3 px-4 flex flex-col justify-center items-center">
							<span className="text-lg text-gray-600 mb-8">Premium</span>
							<span className="h-16 text-gray-400">Unlimited</span>
							<span className="h-16 text-gray-400">Unlimited</span>
							<span className="h-16 text-gray-400">
								<img className="h-6" src={x} />
							</span>
							<button
								onClick={() => clickHandler("premium")}
								className="mt-4 w-[160px] py-2 rounded-md bg-gray-800 text-white cursor-pointer"
							>
								Select Premium
							</button>
						</div>
						<div className="w-1/3 px-4 flex flex-col justify-center items-center">
							<span className="text-lg text-gray-600 mb-8">Enterprise</span>
							<span className="h-16 text-gray-400">Unlimited</span>
							<span className="h-16 text-gray-400">Unlimited</span>
							<span className="h-16 text-gray-400">
								<img className="h-6" src={check} />
							</span>
							<button
								onClick={() => clickHandler("enterprise")}
								className="mt-4 w-[160px] py-2 rounded-md bg-gray-800 text-white cursor-pointer"
							>
								Select Enterprise
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
