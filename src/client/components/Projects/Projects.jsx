import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import githubLogo from "../../assets/github.svg";
import githubDarkmode from "../../assets/github-darkmode.svg";
import { useStore } from "../../store.js";
import ExternalLink from "../../assets/ExternalLink.svg";
import darkExternalLink from "../../assets/darkExternalLink.svg";

export default function Projects() {
  const { dark, user } = useStore();
  const navigate = useNavigate();

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
    <div className="mx-2 mb-2 h-[75vh] w-full justify-start items-start shadow-lg rounded-lg text-sm flex flex-col md:px-[40px] py-[20px] lg:w-[65%] lg:mx-auto bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] overflow-auto gap-[10px]">
      <div className="flex flex-row w-full justify-between px-[10px] md:px-[15px]">
        <h3 className="dark:text-white">My Projects</h3>
        <h3
          className="text-[#55555] dark:text-white cursor-pointer"
          onClick={() => navigate("/create")}
        >
          Create New Project
        </h3>
      </div>
      {data?.length
        ? data?.map((project, index) => (
            <div className="flex flex-row h-30 w-full justify-between border border-[#D4D4D4] border-t-0 border-b-1 border-l-0 border-r-0 p-4">
              <div className="flex flex-row">
                <div className="flex flex-col gap-[15px]">
                  <div className="flex flex-col">
                    <div className="flex gap-[10px]">
                      <h2 className="font-semibold dark:text-white">
                        {project.identifier}
                      </h2>
                      <span className="font-semibold bg-[#EEFDF2] px-[15px] rounded-md text-[#1C7737] dark:bg-[#185B2E] dark:text-[#7FEDA2]">
                        {project.live ? `LIVE` : `TEST`}
                      </span>
                    </div>
                    <span className="font-light text-[#8B929F]">
                      Added on January 24
                      {/* should be: {project.createdAt} */}
                    </span>
                  </div>
                  {/* should be an href target _blank: */}
                  <button className="flex border border-[#8B929F] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center">
                    <div className="flex gap-[10px]">
                      <img
                        className="w-[14px]"
                        src={dark ? githubDarkmode : githubLogo}
                      />
                      <span className="font-semibold dark:text-white">
                        {project.identifier}
                      </span>
                    </div>
                    <img src={dark ? darkExternalLink : ExternalLink} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-start gap-[10px] md:gap-0 items-end md:justify-between ">
                <p className="text-[10px] font-medium dark:text-[#8B929F]">
                  {project.creditAmount} Credits
                </p>
                <button className="border border-[#8B929F] dark:border-[#8B929F] rounded-md  px-[10px] py-[3px] w-[125px] dark:text-white">
                  View Project
                </button>
              </div>
            </div>
          ))
        : "You have not created any projects yet."}
    </div>
  );
}
