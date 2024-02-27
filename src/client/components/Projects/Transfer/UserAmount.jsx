import React from "react";

export default function UserAmount() {
  const errorText = "error";
  return (
    <div className="w-full h-[50vh] items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47]">
      <form className="flex flex-col gap-[35px]">
        <div class="w-[300px] flex flex-col gap-2">
          <label
            for="name"
            className="font-inter font-regular text-[14px] dark:text-[#DDDCDC] text-gray-900"
          >
            Recipient
          </label>
          <input
            type="text"
            name="user_name"
            id="name"
            className="rounded-md p-1 block w-full border border-gray-300 dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400"
            placeholder=""
            required
          />
        </div>
        <div class="w-[300px] flex flex-col gap-2">
          <label
            for="email"
            className="font-inter font-regular text-[14px] dark:text-[#DDDCDC] text-gray-900"
          >
            Amount
          </label>
          <input
            type="text"
            id="email"
            name="user_email"
            className={` w-full p-1 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400
					${errorText !== "" && "border-red-500 text-red-500 dark:border-red-500"}`}
            placeholder=""
            required
          />
          <div className="h-6 mb-2 text-sm  text-red-500">{errorText}</div>
        </div>
        <button
          type="submit"
          className=" font-inter text-[16px] mx-auto bg-[#313131] w-[125px] px-[20px] text-white rounded-md py-2 dark:bg-[#18181B] dark:border-[#373D47] dark:border-2"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
