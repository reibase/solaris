import React from "react";

export default function Complete({ transferData, index, setIndex }) {
  const sentAmount = 500;
  const date = "12-25";
  const time = "9pm";
  return (
    <div className="flex flex-col items-center gap-[35px]">
      <p className="font-regular font-[14px]">Transfer Complete</p>
      <p className="font-regular font-[14px] text-center w-[75%]">
        You have sent {sentAmount} credits to {transferData?.recipient.username}{" "}
        on {date} at {time}.
      </p>
    </div>
  );
}
