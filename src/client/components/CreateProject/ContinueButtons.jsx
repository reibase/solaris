import React from "react";

export default function ContinueButtons({
	index,
	setIndex,
	canContinue,
	canGoBack,
}) {
	return (
		<div className="flex justify-between justify-end w-full h-1/6">
			<span>
				{index > 0 && index < 3 && (
					<button
						disabled={!canGoBack}
						className="mt-2 py-1.5 w-24 px-3 rounded-md border border-[#313131] dark:text-white dark:border-[#373D47] disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-[#bg-gray-400]"
						onClick={() => setIndex(index - 1)}
					>
						Back
					</button>
				)}
			</span>
			<span>
				{index < 3 && (
					<button
						disabled={!canContinue}
						className="mt-2 py-1.5 w-24 px-3 rounded-md bg-[#313131] text-white border border-transparent dark:bg-[#18181B] dark:border-[#373D47] disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-[#bg-gray-400]"
						onClick={() => setIndex((index += 1))}
					>
						Continue
					</button>
				)}
			</span>
		</div>
	);
}
