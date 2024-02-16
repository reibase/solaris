import React from "react";

export default function Review({ project, user }) {
	return (
		<div className="flex flex-col h-full gap-4 w-full mb-4  dark:divide-[#373D47] dark:text-white">
			<div>You are creating this project with these settings:</div>
			<div className="flex w-full flex-col gap-2 dark:text-white">
				<span className="flex flex-row gap-4">
					<span>Repo:</span>
					<span>{project.identifier}</span>
				</span>
				<span className="flex flex-row gap-4">
					<span>Credit Amount:</span>
					<span>{project.creditAmount}</span>
				</span>
				<span className="flex flex-row gap-4">
					<span>Number of credits required to end voting:</span>
					<span>{project.quorum}</span>
				</span>
			</div>
		</div>
	);
}
