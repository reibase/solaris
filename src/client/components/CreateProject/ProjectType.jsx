import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Nav from "../Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";
import { useEffect } from "react";
import repository from "../../assets/repository.png";
import repositorydarkmode from "../../assets/repositorydarkmode.png";
import organizationdarkmode from "../../assets/organizationdarkmode.png";
import organization from "../../assets/organization.png";
import RepoItem from "./RepoItem.jsx";

export default function ProjectType({ project, setProject, dark, user }) {
	const clickHandler = (e) => {
		setProject({ ...project, type: e.target.value });
	};

	return (
		<div className="flex flex-col h-full divide-y gap-4 w-full mb-4 lg:divide-x lg:divide-y-0 lg:flex-row dark:divide-midnight">
			<div className="w-full lg:w-1/3 dark:text-gray-200">
				Select Project Type:
				<button
					type="button"
					className={`${
						project.type === "repository" && "bg-powder-blue dark:bg-midnight"
					} flex flex-row gap-4 mt-6 items-center px-4 w-[140px] py-1 border border-1 rounded-md border-slate-gray hover:bg-powder-blue dark:border-slate-gray dark:hover:bg-midnight/75 dark:text-white`}
					value="repository"
					onClick={(e) => clickHandler(e)}
				>
					<img className="w-5" src={dark ? repositorydarkmode : repository} />
					Repository
				</button>
				<button
					type="button"
					className={`${
						project.type === "organization" && "bg-powder-blue dark:bg-midnight"
					} flex flex-row gap-4 mt-6 items-center px-4 w-[140px] py-1 border border-1 rounded-md border-slate-gray hover:bg-powder-blue dark:border-slate-gray dark:hover:bg-midnight/75 dark:text-white`}
					value="organization"
					onClick={(e) => clickHandler(e)}
				>
					<img
						className="w-5"
						src={dark ? organizationdarkmode : organization}
					/>
					Organization
				</button>
			</div>
			<div className="flex flex-col mt-5 lg:w-4/5 gap-4 lg:px-10 lg:mt-0">
				<div className="flex flex-col w-full">
					<header
						className={`leading-8 text-[14px] ${
							project.type === "repository"
								? "text-charcoal dark:text-white"
								: "text-gray-400 dark:text-gray-200"
						}`}
					>
						Repository
					</header>
					<p
						className={`leading-6 text-[12px] ${
							project.type === "repository"
								? "text-charcoal dark:text-white"
								: "text-gray-400 dark:text-gray-200"
						}`}
					>
						Connect a codebase repository from GitHub or elsewhere to enable
						your team to vote on things like pull requests or merge requests to
						the codebase as well as collaborator roles within the repository.
					</p>
				</div>
				<div className="flex flex-col w-full">
					<header
						className={`leading-8 text-[14px] ${
							project.type === "organization"
								? "text-charcoal dark:text-white"
								: "text-gray-400 dark:text-gray-200"
						}`}
					>
						Organization
					</header>
					<p
						className={`leading-6 text-[12px] ${
							project.type === "organization"
								? "text-charcoal dark:text-white"
								: "text-gray-400 dark:text-gray-200"
						}`}
					>
						Connect an organization to allow your team to vote on things like
						adding new members, changing their role within the organization, and
						other membership administrative actions.
					</p>
				</div>
			</div>
		</div>
	);
}
