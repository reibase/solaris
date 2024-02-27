import React from "react";

export default function Complete({ data, index, setIndex }) {
  return (
    <div className="flex flex-col items-center gap-[35px]">
      <p className="font-regular font-[14px]">Transfer Complete</p>
      <p className="font-regular font-[14px] text-center w-[75%]">
        You have sent {data.sentAmount} credits to {data.user} on {data.date} at{" "}
        {data.time}.
      </p>
    </div>
  );
}
