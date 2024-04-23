import React from "react";
import check from "../assets/check.png";

export default function Plan({ plan, selected, clickHandler }) {
	return (
		<div
			onClick={() => clickHandler(plan.id)}
			className={`w-full md:w-60 h-auto border rounded-md p-1 flex flex-col justify-start cursor-pointer hover:bg-[#E7F0FF]/50 dark:hover:dark:bg-[#0F172A]/50 dark:border-[#8B929F] ${
				selected && "bg-[#E7F0FF]/50 dark:bg-[#0F172A]/50"
			}`}
		>
			<div className="w-full md:mt-10 flex flex-row items-center justify-center divide-x">
				<div className="w-full h-auto md:h-80 flex flex-col justify-start items-start">
					<span className="text-lg text-gray-500 self-center  dark:text-gray-300">
						{plan.name}
					</span>
					<span className="mb-6 self-center text-gray-400 self-center">
						{plan.tagline}
					</span>
					<div className="h-50 block h-full px-3">
						{plan.features.map((feature) => (
							<span
								key={feature}
								className="mb-3 leading-5 text-gray-500 flex flex-row items-start gap-4  dark:text-gray-300"
							>
								<img className="h-4" src={check} />
								{feature}
							</span>
						))}
					</div>
					<button
						onClick={() => clickHandler(plan.id)}
						className={`self-center my-4 w-[160px] py-2 rounded-md text-gray-400 border rounded-md border-gray-300 cursor-pointer dark:border-[#8B929F] ${
							selected && "bg-gray-700 text-white dark:bg-[#0F172A]/50"
						}`}
					>
						{plan.price}
					</button>
				</div>
			</div>
		</div>
	);
}
