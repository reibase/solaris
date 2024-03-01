import React from "react";

const ProgressBar = ({ yesPercent, noPercent, votesView }) => {
	console.log(yesPercent, noPercent);
	return (
		<div className={`flex flex-col p-[5px] ${!votesView ? "w-[90%]" : null}`}>
			<div className="flex flex-start items-center md:flex-col md:items-start w-full rounded-md gap-[15px] md:gap-[5px]">
				<div className="text-right text-[#20B176]">{yesPercent * 100}%</div>
				<div className="text-right text-red-400">{noPercent * 100}%</div>
			</div>
			{/* Colored bars representing votes */}
			<div className="flex items-center justify-between h-5 w-full rounded-md">
				<div
					style={{ flexBasis: `${noPercent * 100}%` }}
					className="bg-[#DC2626] h-[4px] rounded-tl-md rounded-bl-md"
				></div>
				<div
					style={{ flexBasis: `${yesPercent * 100}%` }}
					className="bg-[#20B176] h-[4px]"
				></div>
				<div
					style={{
						flexBasis: `${100 - (yesPercent * 100 + noPercent * 100)}%`,
					}}
					className="bg-gray-400 h-[4px] rounded-tr-md rounded-br-md"
				></div>
			</div>
		</div>
	);
};

export default ProgressBar;
