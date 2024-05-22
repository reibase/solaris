import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Nav from "../Nav.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useStore } from "../../store.js";
import { useEffect } from "react";
import githubLogo from "../../assets/github.svg";
import githubLogoDarkMode from "../../assets/github-darkmode.svg";
import gitlabLogo from "../../assets/gitlab.svg";
import RepoItem from "./RepoItem.jsx";

export default function ProjectType({ project, setProject, dark, user }) {
	const [text, setText] = useState("");

	const clickHandler = (e) => {
		setProject({ ...project, type: e.target.value });
	};
	useEffect(() => {
		if (project.type === "repository") {
			setText(
				"Connecting a code repository allows your team to vote on pull requests in that codebase."
			);
		}
		if (project.type === "organization") {
			setText(
				"Connecting an organization allows your team to vote on adding members to the organization and their respective roles."
			);
		}
	}, [project.type]);

	return (
		<div className="flex flex-col h-full divide-y gap-4 w-full mb-4 lg:divide-x lg:divide-y-0 lg:flex-row dark:divide-midnight">
			<div className="w-full lg:w-1/3 dark:text-gray-200">
				Select Project Type:
				<button
					type="button"
					className={`${
						project.type === "repository" && "bg-powder-blue dark:bg-midnight"
					} flex flex-row gap-8 items-center mt-6 px-4 w-32 py-1 border border-1 rounded-md border-slate-gray hover:bg-powder-blue dark:border-slate-gray dark:hover:bg-midnight/75 dark:text-white`}
					value="repository"
					onClick={(e) => clickHandler(e)}
				>
					Repository
				</button>
				<button
					type="button"
					className={`${
						project.type === "organization" && "bg-powder-blue dark:bg-midnight"
					} flex flex-row gap-8 items-center mt-6 px-4 w-32 py-1 border border-1 rounded-md border-slate-gray hover:bg-powder-blue dark:border-slate-gray dark:hover:bg-midnight/75 dark:text-white`}
					value="organization"
					onClick={(e) => clickHandler(e)}
				>
					Organization
				</button>
			</div>
			<div className="flex flex-col mt-5 lg:w-3/5 lg:px-10 lg:mt-0">{text}</div>
		</div>
	);
}
