import React from "react";

const ProgressBar = ({
  yesPercent,
  yesVotes,
  noPercent,
  noVotes,
  totalPercent,
  quorum,
}) => {
  let difference = 1 / quorum;
  yesPercent = yesPercent * 100 * difference;
  noPercent = noPercent * 100 * difference;
  let remainingVotesPercent = (quorum - totalPercent) * 100 * difference;

  return (
    <>
      <div className="flex h-17 w-full mb-4 px-10">
        {yesPercent >= noPercent ? (
          <>
            <div
              className="h-10 bg-white text-green-600 text-right mb-2 font-light flex-grow"
              style={{ flexBasis: `${yesPercent}%` }}
            >
              {yesVotes >= 1 && yesVotes}
            </div>
            <div
              className="h-10 bg-white text-red-600 text-right mb-2 font-light flex-grow"
              style={{ flexBasis: `${noPercent}%` }}
            >
              {noVotes >= 1 && noVotes}
            </div>
          </>
        ) : (
          <>
            <div
              className="h-10 bg-white text-green-600 text-right mb-2 font-light flex-grow"
              style={{ flexBasis: `${yesPercent}%` }}
            >
              {yesVotes >= 1 && yesVotes}
            </div>
            <div
              className="h-10 bg-white text-red-600 text-right mb-2 font-light flex-grow"
              style={{ flexBasis: `${noPercent}%` }}
            >
              {noVotes >= 1 && noVotes}
            </div>
          </>
        )}
      </div>
      <div className="flex h-17 w-full mb-4 px-10">
        {yesPercent >= noPercent ? (
          <>
            <div
              className="h-5 bg-red-500 flex-grow"
              style={{ flexBasis: `${noPercent}%` }}
            ></div>
            <div
              className="h-5 bg-green-500 flex-grow"
              style={{ flexBasis: `${yesPercent}%` }}
            ></div>
          </>
        ) : (
          <>
            <div
              className="h-5 bg-green-500 flex-grow"
              style={{ flexBasis: `${yesPercent}%` }}
            ></div>
            <div
              className="h-5 bg-red-500 flex-grow"
              style={{ flexBasis: `${noPercent}%` }}
            ></div>
          </>
        )}
        <div
          className="h-5 bg-gray-300 flex-grow"
          style={{ flexBasis: `${remainingVotesPercent}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
