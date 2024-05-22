import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

import { useStore } from "../../store.js";
import httpService from "../../services/httpService.js";
import Plan from "./Plan.jsx";

export default function Votes() {
	const { createCheckoutSession } = httpService();
	const { user } = useStore();
	const [clicked, setClicked] = useState(false);
	const [selected, setSelected] = useState(user?.plan || "free");
	const [enterprise, setEnterprise] = useState(false);
	const plans = [
		{
			id: "free",
			name: "Free",
			tagline: "Get started",
			price: "Free",
			features: ["3 Projects", "5 team members"],
		},
		// {
		// 	id: "premium",
		// 	name: "Premium",
		// 	tagline: "All the tools you need to succeed",
		// 	price: "$20 / month",
		// 	features: ["Unlimited Projects", "Unlimited Team Members"],
		// },
		{
			id: "enterprise",
			name: "Enterprise",
			tagline: "Suitable for business needs",
			price: "Price on request",
			features: [
				"Unlimited Projects",
				"Unlimited Team Members",
				"1:1 Advising with our team",
				"Custom solutions and features based on your unique requirements",
			],
		},
	];
	const form = useRef();

	const { data: planData, isFetching } = useQuery({
		queryKey: [
			"plan",
			{
				userID: user?.id,
				plan: selected,
				mode: "subscription",
				setClicked,
			},
		],
		queryFn: createCheckoutSession,
		manual: true,
		enabled: clicked,
	});

	const clickHandler = (selectedPlan) => {
		setSelected(selectedPlan);
	};

	const continueHandler = () => {
		if (selected === "enterprise") {
			setEnterprise(true);
			return;
		}
		setClicked(true);
	};

	const enterpriseHandler = () => {
		emailjs
			.sendForm("service_wmtm7u2", "template_v1ulh7q", form.current, {
				publicKey: "user_kDFY4AFTuoji3GQqaGDsn",
			})
			.then(
				() => {
					setEnterprise(false);
					setClicked(true);
				},
				(error) => {
					console.log("FAILED...", error);
				}
			);
	};

	return (
		<div className="flex w-full h-full flex items-center gap-[10px]">
			<div className="p-1 md:p-4 block w-full h-full shadow-lg rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] md:justify-center overflow-auto">
				<span className="text-[20px] text-gray-600 m-4 dark:text-gray-300">
					Choose a plan
				</span>
				{enterprise ? (
					<div className="self-center w-2/3 h-full leading-5 text-gray-500 flex flex-col items-center justify-start pt-5 gap-6">
						<h1 className="text-xl font-light text-center w-full text-gray-600 dark:text-white">
							Solaris Enterprise
						</h1>
						<p className="dark:text-gray-300 leading-6 text-center">
							Solaris Enterprise is an exclusive tier offering personal
							collaboration to best integrate the features of Solaris with your
							team's unique needs. Click request access and our team will be in
							touch with you by email to see how Solaris can take your
							development to the next level.
						</p>
						<p>
							We will contact you at{" "}
							<span className="font-bold">{user.email}</span>
						</p>
						<span className="text-[14px] text-gray-700 w-full flex justify-center">
							<button
								onClick={() => enterpriseHandler()}
								className="m-2 w-[220px] py-2 rounded-md text-white rounded-md bg-gray-700 cursor-pointer border border-transparent dark:bg-[#0F172A]/50 dark:text-white dark:border-[#8B929F]"
							>
								Request Enterprise Access
							</button>
						</span>
						{/* Email JS requires the element be a form for this implementation */}
						<form className="hidden" ref={form}>
							<input type="text" name="user_email" value={user.email} />
						</form>
					</div>
				) : (
					<>
						<div className="w-full md:h-full flex flex-col md:flex-row items-start justify-center gap-6">
							{plans.map((plan) => (
								<Plan
									key={plan.id}
									clickHandler={clickHandler}
									plan={plan}
									selected={selected === plan.id ? true : false}
								/>
							))}
						</div>
						<span className="text-[14px] text-gray-700 w-full flex justify-end">
							<button
								onClick={() => continueHandler()}
								className="self-end m-2 w-[160px] py-2 rounded-md text-white rounded-md bg-gray-700 cursor-pointer border border-transparent dark:bg-[#0F172A]/50 dark:text-white dark:border-[#8B929F]"
							>
								Continue
							</button>
						</span>
					</>
				)}
			</div>
		</div>
	);
}
