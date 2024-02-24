import React from "react";
import githubLogo from "../../assets/github.svg";
import githubDarkmode from "../../assets/github-darkmode.svg";
import { useStore } from "../../store.js";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkDataTransfer from "../../assets/darkDataTransfer.svg";
import darkGroup from "../../assets/darkGroup.svg";
import darkSettings from "../../assets/darkSettings.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import Group from "../../assets/Group.svg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatDate } from "./formatting.js";

export default function Settings() {
  let { id } = useParams();

  const { dark, user } = useStore();
  const icon = {
    github: dark ? githubDarkmode : githubLogo,
    gitlab: gitlabLogo,
  };

  const getProject = async () => {
    try {
      const { data } = await axios
        .get(`/api/users/${user.info.id}/projects/${id}`)
        .then(({ data }) => data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: getProject,
  });
  console.log(data);
  return (
    <div className="flex w-full h-full flex-col gap-[10px]">
      {/* header */}
      <div className="w-full h-50 items-start justify-start p-4 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] gap-[10px]">
        {/* top row of header */}
        <div className="flex flex-row w-full justify-between">
          {/* top left of header */}
          <div className="flex flex-row items-center gap-[20px]">
            <span className="font-semibold text-lg tracking-wide dark:text-white">
              {data?.title}
            </span>
            <span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
              {data?.live ? `LIVE` : `TEST`}
            </span>
          </div>
          {/* top right of header */}
          <span className="text-[12px] font-semibold text-slate-500 dark:text-[#DDDCDC] whitespace-nowrap">
            {data?.user?.balance} Credits
          </span>
        </div>

        <span className="mt-1 mb-3 text-[#313131] dark:text-[#8B929F]">
          Added on {formatDate(data?.createdAt.slice(0, 10))}
        </span>

        {/* bottom row of header  */}
        <div className="flex flex-row h-full items-end flex-wrap gap-[15px]">
          <a href={data?.url} target="_blank">
            <div className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
              <div className="flex gap-[10px]">
                <img className="w-[14px]" src={icon[data?.host]} />
                <span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
                  {data?.identifier} on {data?.host}
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
            <div
              className="flex gap-[7px] cursor-pointer"
              onClick={() => navigate(`/projects/${data?.id}/settings`)}
            >
              <img src={darkSettings} />
              <p className="text-[#313131] dark:text-[#D9D9D9] text-[12px] font-medium">
                Settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-2 w-[50%] shadow-lg rounded-lg text-sm flex flex-col items-left md:px-[40px] py-[20px] lg:w-[45%] bg-white/90 dark:bg-[#202530] border border-1 dark:border-[#373D47] justify-between gap-[25px]">
        <h2 className="text-[#313131] font-medium font-[12px] text-left dark:text-white">
          Project Settings
        </h2>
        <div className="w-[70%] mx-auto flex flex-col gap-[10px]">
          <p className="text-[#313131] dark:text-white font-semibold font-[12px]">
            Mode:
          </p>
          <div className="flex mx-auto w-[70%] ">
            <div class="flex flex-col items-center gap-[10px]">
              <div className="flex">
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
              </div>
              <div className="flex">
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
                  class="h-4 w-4 square border-gray-300 focus:ring-0 ml-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <span className="font-inter mx-auto text-[#D33131] border border-[#D33131] rounded-md py-[2px] px-[10px]">
            Delete Account
          </span>
          <button className="font-inter bg-[#313131] w-[109px] text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-1">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
