import React from "react";

export default function Review() {
  const data = {
    sentAmount: 500,
    user: "ramirc5",
    repo: "demo",
    identifier: "ramirc5/dmeo",
    date: "12/25",
    time: "11pm",
  };
  return (
    <div className="w-full h-[50vh] items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
      <div className="flex flex-col items-center gap-[35px] w-[66%]">
        <div className=" flex flex-col gap-[5px] items-center w-full">
          <div className="px-[6px] flex justify-between w-[66%]">
            <p className="font-regular text-[#313131] font-[12px]">Project</p>
            <p className="font-regular font-[14px] text-[#313131]">
              {data.identifier}
            </p>
          </div>
          <div className="px-[6px] flex justify-between w-[66%] bg-[#f0f0f0]">
            <p className="font-regular text-[#313131] font-[12px]">Recipient</p>
            <p className="font-regular font-[14px] text-[#3B82F6]">
              {data.user}
            </p>
          </div>
          <div className="px-[6px] flex justify-between w-[66%]">
            <p className="font-regular text-[#313131] font-[12px]">Amount</p>
            <p className="font-regular font-[14px] text-[#313131]">
              {data.sentAmount}
            </p>
          </div>
        </div>
        <button className="font-inter font-[16px] bg-[#313131] py-[2px] w-[50%] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1">
          Continue
        </button>
      </div>
    </div>
  );
}
