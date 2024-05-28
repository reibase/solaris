import React, { useState, useEffect } from "react";

export default function Navigation({ index, project, setIndex }) {
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (index > 1) {
			setDisabled(false);
			return;
		}
		setDisabled(true);
		if (index === 0 && project.type) {
			setDisabled(false);
		} else if (index === 1 && project.host && project.hostID) {
			setDisabled(false);
		}
	}, [project, index]);

	return (
		<div className="flex justify-between justify-end w-full h-1/6">
			<span>
				{index === 1 && (
					<button
						className="mt-2 py-1.5 w-24 px-3 rounded-md border border-charcoal dark:text-white dark:border-dark-gray disabled:bg-gray-300 disabled:cursor-auto disabled:dark:bg-gray-400"
						onClick={() => setIndex(index - 1)}
					>
						Back
					</button>
				)}
			</span>
			<span>
				{index < 2 && (
					<button
						disabled={disabled}
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
