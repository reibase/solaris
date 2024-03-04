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
		<div className={`flex flex-col p-[5px] ${!votesView && "w-[90%]"}`}>
			<div className="flex flex-start mb-1 items-center flex-row text-slate-400 md:items-start w-full rounded-md gap-[15px] md:gap-[5px]">
				<span className="text-[#20B176]">{totalYesVotes || 0}</span>
				<span className="text-red-400">{totalNoVotes || 0}</span> /
				<span className="text-slate-600">{quorum}</span>
			</div>
			{/* Colored bars representing votes */}
			<div className="flex w-full bg-slate-200 flex-col h-2 overflow-hidden">
				<div style={{ width: `${yes}%` }} className={`bg-[#20B176] h-1`}></div>
				<div style={{ width: `${no}%` }} className={`bg-red-500 h-1`}></div>
			</div>
		</div>
	);
};

export default ProgressBar;
