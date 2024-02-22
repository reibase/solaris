import React from "react";
import githubLogo from "../assets/github.svg";
import githubDarkmode from "../assets/github-darkmode.svg";
import { useStore } from "../store.js";
import ExternalLink from "../assets/ExternalLink.svg";
import darkDataTransfer from "../assets/darkDataTransfer.svg";
import darkGroup from "../assets/darkGroup.svg";
import darkSettings from "../assets/darkSettings.svg";
import darkExternalLink from "../assets/darkExternalLink.svg";
import Group from "../assets/Group.svg";
import ProgressBar from "./ProgressBar.jsx";

export default function Settings() {
  const { dark } = useStore();
  const data = [1, 2, 3, 4, 5, 6, 7, 8]; // dummy map data
  //const {data, status} = useQuery({})

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="mx-2 lg:mx-auto block  w-{{WIDTH}} shadow-lg rounded-lg text-sm flex flex-col items-center md:px-[40px] lg:w-[65%] bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between gap-[10px]">
        <div className="flex flex-row w-full justify-between p-4">
          <div className="flex flex-row">
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col">
                <div className="flex gap-[10px]">
                  <h2 className="font-semibold dark:text-white">OWNER</h2>
                  <h2 className="font-semibold dark:text-white">/</h2>
                  <h2 className="font-semibold dark:text-white">REPO-NAME</h2>
                  <span className="font-semibold bg-[#EEFDF2] px-[15px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
                    LIVE
                  </span>
                </div>
                <span className="font-light text-[#313131] dark:text-[#8B929F]">
                  Added on January 24
                </span>
              </div>
              <div className="flex flex-row flex-wrap gap-[15px]">
                <button className="flex border border-[#919190] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center">
                  <div className="flex gap-[10px]">
                    <img
                      className="w-[14px]"
                      src={dark ? githubDarkmode : githubLogo}
                    />
                    <span className="font-semibold dark:text-white">
                      repo-name on GitHub
                    </span>
                  </div>
                  <img src={dark ? darkExternalLink : ExternalLink} />
                </button>
                <div className="flex items-center gap-[20px]">
                  <div className="flex gap-[5px]">
                    <img className="w-[20px]" src={dark ? darkGroup : Group} />
                    <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                      Community
                    </p>
                  </div>
                  <div className="flex gap-[5px]">
                    <img src={darkDataTransfer} />
                    <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                      Transfer
                    </p>
                  </div>
                  <div className="flex gap-[5px]">
                    <img src={darkSettings} />
                    <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                      Settings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[12px] font-semibold dark:text-[#DDDCDC] whitespace-nowrap">
            50000 Credits
          </p>
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
