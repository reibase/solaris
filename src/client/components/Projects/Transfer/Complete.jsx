import React from "react";

export default function Complete() {
  //props?
  const data = {
    sentAmount: 500,
    user: "ramirc5",
    date: "12/25",
    time: "11pm",
  };
  return (
    <div className="w-full h-[50vh] items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
      <div className="flex flex-col items-center gap-[35px]">
        <p className="font-regular font-[14px]">Transfer Complete</p>
        <p className="font-regular font-[14px] text-center w-[75%]">
          You have sent {data.sentAmount} credits to {data.user} on {data.date}{" "}
          at {data.time}.
        </p>
        <button className="font-inter bg-[#313131] py-[2px] w-[75%] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1">
          Make another transfer
        </button>
      </div>
    </div>
  );
}
