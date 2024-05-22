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
				{index > 0 && index < 4 && (
					<button
						disabled={!canGoBack}
						className="mt-2 py-1.5 w-24 px-3 rounded-md border border-charcoal dark:text-white dark:border-dark-gray disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-gray-400"
						onClick={() => setIndex(index - 1)}
					>
						Back
					</button>
				)}
			</span>
			<span>
				{index < 4 && (
					<button
						disabled={!canContinue}
						className="mt-2 py-1.5 w-24 px-3 rounded-md bg-charcoal text-white border border-transparent dark:bg-midnight dark:border-dark-gray disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-midnight/50"
						onClick={() => setIndex((index += 1))}
					>
						Continue
					</button>
				)}
			</span>
		</div>
	);
}
