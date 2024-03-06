import React from "react";

const ProgressBar = ({
	yesPercent,
	noPercent,
	votesView,
	totalYesVotes,
	totalNoVotes,
	quorum,
}) => {
	const yes = yesPercent * 100;
	const no = noPercent * 100;

	return (
		<div className="flex w-full flex-col h-full items-center justify-center">
			<div className="flex flex-start mb-1 items-center justify-between flex-row text-slate-400 md:items-start w-full rounded-md gap-[15px] md:gap-[5px]">
				<div>
					{" "}
					<span className="text-[#20B176] text-[11px]">
						{totalYesVotes || 0}
					</span>{" "}
					-{" "}
					<span className="text-red-400 text-[11px]">{totalNoVotes || 0}</span>
				</div>
				<div>
					<span className="text-slate-400 dark:text-[#8B929F]">{quorum}</span>
				</div>
			</div>
			{/* Colored bars representing votes */}
			<div className="flex w-full bg-slate-200 flex-col h-2 overflow-hidden dark:bg-[#373D47]">
				<div style={{ width: `${yes}%` }} className={`bg-[#20B176] h-1`}></div>
				<div style={{ width: `${no}%` }} className={`bg-red-500 h-1`}></div>
			</div>
		</div>
	);
};

export default ProgressBar;
