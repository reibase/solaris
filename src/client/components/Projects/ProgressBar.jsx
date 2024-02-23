import React from "react";

const ProgressBar = ({
  yesPercent,
  yesVotes,
  noPercent,
  noVotes,
  totalPercent,
  quorum,
  votesView,
}) => {
  const difference = 1 / quorum;
  const yesPercentFull = yesPercent * 100;
  const noPercentFull = noPercent * 100;

  const yesPercentCalc = yesPercentFull * difference;
  const noPercentCalc = noPercentFull * difference;
  const remainingVotesPercent = (quorum - totalPercent) * 100 * difference;

  return (
    <div className="flex flex-col p-[5px]">
      <div className="flex flex-start items-center w-full rounded-md gap-[15px]">
        {yesVotes >= noVotes ? (
          <>
            <div className="text-right text-[#DC2626]">
              {noVotes >= 1 && noPercentFull}%
            </div>
            <div className="text-right text-[#20B176]">
              {yesVotes >= 1 && yesPercentFull}%
            </div>
          </>
        ) : (
          <>
            <div className="text-right text-[#20B176]">
              {yesVotes >= 1 && yesPercentFull}%
            </div>
            <div className="text-right text-[#DC2626]">
              {noVotes >= 1 && noPercentFull}%
            </div>
          </>
        )}
      </div>
      {/* Colored bars representing votes */}
      <div className="flex items-center justify-between h-5 w-full rounded-md">
        <div
          style={{ flexBasis: `${noPercentCalc}%` }}
          className="bg-[#DC2626] h-[4px] rounded-tl-md rounded-bl-md"
        ></div>
        <div
          style={{ flexBasis: `${yesPercentCalc}%` }}
          className="bg-[#20B176] h-[4px]"
        ></div>
        <div
          style={{ flexBasis: `${remainingVotesPercent}%` }}
          className="bg-gray-400 h-[4px] rounded-tr-md rounded-br-md"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
