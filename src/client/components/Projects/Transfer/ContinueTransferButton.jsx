import React from "react";

export default function ContinueTransferButton({ data, index, setIndex }) {
  return (
    <button
      onClick={() => setIndex(index + 1)}
      className="font-inter bg-[#313131] py-[4px] w-[45%] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1 mt-[40px]"
    >
      {index >= 1 ? `Continue` : `Make another transfer`}
    </button>
  );
}
