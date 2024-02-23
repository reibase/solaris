import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../store.js";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import ProgressBar from "./ProgressBar.jsx";

export default function Projects() {
  const { dark, user } = useStore();
  const navigate = useNavigate();

  const icon = {
    github: dark ? githubLogoDarkMode : githubLogo,
    gitlab: gitlabLogo,
  };

  const getUserProjects = async () => {
    try {
      const { data } = await axios
        .get(`/api/users/${user.info.id}/projects`)
        .then(({ data }) => data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: ["userprojects"],
    queryFn: getUserProjects,
  });

  if (isFetching) {
    return "Loading";
  }
  return (
    <div className="w-full h-full justify-start items-start shadow-lg rounded-lg text-sm flex flex-col p-6 bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] gap-[10px]">
      <div className="flex mb-6 flex-row w-full justify-between">
        <h3 className="dark:text-white">My Projects</h3>
        <h3
          className="text-[#313131] dark:text-white cursor-pointer"
          onClick={() => navigate("/create")}
        >
          Create New Project
        </h3>
      </div>
      <div className="h-5/6 pr-4 w-full">
        {data?.length ? (
          data?.map((project, index) => (
            <div className="flex flex-row h-30 w-full justify-between border-b border-[#D4D4D4] dark:border-[#8B929F] pb-4 mb-2">
              <div className="flex flex-row">
                <div className="flex flex-col gap-[15px]">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-[14px]">
                      <span className="font-semibold text-[14px] dark:text-white tracking-wide">
                        {project.identifier}
                      </span>
                      <span className="flex items-center justify-center font-semibold bg-[#EEFDF2] text-[10px] px-[10px] h-[18px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
                        {project.live ? `LIVE` : `TEST`}
                      </span>
                    </div>
                    <span className="text-[10px] leading-6 text-[#8B929F]">
                      Added on {project.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <a href={project.url} target="_blank">
                    <button className="flex border border-[#8D4D4D4] dark:border-[#8B929F] rounded-md py-[2px] px-[12px] w-[180px] md:w-[240px] justify-between items-center">
                      <div className="flex gap-[10px]">
                        <img className="w-[14px]" src={icon[project.host]} />
                        <span className="dark:text-[#8B929F] text-[11px] w-[135px] text-left truncate overflow-hidden">
                          {project.identifier}
                        </span>
                      </div>
                      <img src={dark ? darkExternalLink : ExternalLink} />
                    </button>
                  </a>
                </div>
              </div>
              <div className="flex flex-col justify-start md:gap-0 items-end md:justify-between ">
                <span className="text-[10px] font-medium dark:text-[#8B929F]">
                  {project.creditAmount} Credits
                </span>
                <span
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-center my-auto border border-[#8B929F] dark:border-[#8B929F] rounded-md px-[10px] py-[3px] w-[125px] dark:text-white cursor-pointer"
                >
                  View Project
                </span>
              </div>
            </div>
          ))
        ) : (
          <span className="w-full h-full text-gray-300 flex items-center justify-center text-center text-lg">
            You have not created any projects yet.
          </span>
        )}
      </div>
    </div>
  );
}
