import React from "react";
import githubLogo from "../../assets/github.svg";
import githubDarkmode from "../../assets/github-darkmode.svg";
import { useStore } from "../../store.js";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkDataTransfer from "../../assets/darkDataTransfer.svg";
import darkGroup from "../../assets/darkGroup.svg";
import darkSettings from "../../assets/darkSettings.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import Group from "../../assets/Group.svg";

export default function Settings() {
  const { dark } = useStore();
  const data = [1, 2, 3, 4, 5, 6, 7, 8]; // dummy map data
  const icon = {
    github: dark ? githubDarkmode : githubLogo,
    gitlab: gitlabLogo,
  };
  const project = {
    userID: 1,
    createdAt: "january 1 2024",
    creditAmount: 10000,
    url: "https://github.com/ramirc5/demo",
    id: 3,
    identifier: "ramirc5/demo",
    live: true,
    quorum: 501,
    updatedAt: "february 2 2024",
    user: {
      balance: 100,
    },
    host: "github",
    title: "ramirc5/demo",
    isPrivate: false,
    installationID: "1231234",
    description: "its just a demo",
    issues: data,
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="w-full h-60 items-start justify-start p-4 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
        {/* top row of header */}
        <div className="flex flex-row w-full justify-between">
          {/* top left of header */}
          <div className="flex flex-row items-center gap-[20px]">
            <span className="font-semibold text-lg tracking-wide dark:text-white">
              {project?.title}
            </span>
            <span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
              {project?.live ? `LIVE` : `TEST`}
            </span>
          </div>
          {/* top right of header */}
          <span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
            {project?.user?.balance} Credits
          </span>
        </div>

        <span className="mt-2 text-[#313131] dark:text-[#8B929F]">
          Added on {project?.createdAt.slice(0, 10)}
        </span>

        {/* bottom row of header  */}
        <div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
          <a href={project?.url} target="_blank">
            <div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
              <div className="flex gap-[10px]">
                <img className="w-[14px]" src={icon[project?.host]} />
                <span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
                  {project?.identifier} on {project?.host}
                </span>
              </div>
              <img src={dark ? darkExternalLink : ExternalLink} />
            </div>
          </a>

          <div className="flex items-center gap-[20px]">
            <div className="flex gap-[7px]">
              <img className="w-[20px]" src={dark ? darkGroup : Group} />
              <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                Community
              </p>
            </div>
            <div className="flex gap-[7px]">
              <img src={darkDataTransfer} />
              <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                Transfer
              </p>
            </div>
            <div className="flex gap-[7px]">
              <img src={darkSettings} />
              <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                Settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-2 lg:mx-auto block  w-[50%] shadow-lg rounded-lg text-sm flex flex-col items-center md:px-[40px] lg:w-[65%] bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between gap-[10px]">
        <h2 className="text-[#313131] dark:text-white">Project Settings</h2>
        <div>
          <p className="text-[#313131] dark:text-white font-semibold font-[12px]">
            Mode:
          </p>
          <div className="flex ">
            <div class="flex items-center">
              <label
                for="live"
                class="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
              >
                Live
              </label>
              <input
                type="radio"
                id="live"
                name="status"
                value="live"
                class="h-4 w-4 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:ring-0 ml-2"
              />

              <label
                for="test"
                class="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
              >
                Test
              </label>
              <input
                type="radio"
                id="test"
                name="status"
                value="test"
                class="h-4 w-4 rounded-square border-gray-300 focus:ring-0 ml-4"
              />
            </div>
          </div>
        </div>
        <span className="font-inter mx-auto text-red-500 border border-red-500 rounded-md py-[4px] px-[8px]">
          Delete Account
        </span>
      </div>
    </div>
  );
}
