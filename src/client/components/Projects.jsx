import React from "react";
import githubLogo from "../assets/github.svg";
import githubDarkmode from "../assets/github-darkmode.svg";
import { useStore } from "../store.js";

export default function Projects() {
  const { dark, toggleDark, user } = useStore();

  return (
    <div className="mx-2 lg:mx-auto block h-{{HEIGHT}} w-{{WIDTH}} shadow-lg rounded-lg text-sm flex items-center px-[40px] py-[20px] lg:w-3/5 bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between">
      <div className="flex flex-row">
        <div className="flex flex-col gap-[15px]">
          <h3>My Projects</h3>
          <div className="flex flex-col">
            <div className="flex gap-[5px]">
              <h2 className="font-semibold">OWNER</h2>
              <h2 className="font-semibold">/</h2>
              <h2 className="font-semibold">REPO-NAME</h2>
              <span className="font-semibold bg-[#EEFDF2] px-[15px] rounded-md text-[#1C7737]">
                LIVE
              </span>
            </div>
            <span className="font-light">Added on January 24</span>
          </div>
          <button className="flex border border-[#D4D4D4] rounded-md text-[10px] px-[12px] w-[220px] justify-between">
            <div className="flex gap-[12px]">
              <img className="w-[14px]" src={githubLogo} />
              <span className="font-semibold">repo-name on GitHub</span>
            </div>
            🔗
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[50px]">
        <h3 className="text-[#55555]">Create New Project</h3>
        <div className="flex flex-col items-end gap-[15px]">
          <p className="text-[10px] font-medium">50000 Credits</p>
          <button className="border border-[#D4D4D4] rounded-md  px-[10px] py-[3px] w-[125px]">
            View Project
          </button>
        </div>
      </div>
    </div>
  );
}
