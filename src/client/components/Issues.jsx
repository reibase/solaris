import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export default function Projects() {
	const { dark } = useStore();
	let { id } = useParams();

	const getProject = async () => {
		try {
			const { data } = await axios
				.get(`/api/projects/${id}`)
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
	console.log(id, data);

	return (
		<div className="w-full h-full flex flex-col gap-[10px]">
			<div className="w-full shadow-lg rounded-lg text-sm flex flex-col items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between gap-[10px]">
				<div className="flex flex-row w-full justify-between p-4">
					<div className="flex flex-row">
						<div className="flex flex-col gap-[15px]">
							<div className="flex flex-col">
								<div className="flex gap-[10px]">
									<h2 className="font-semibold dark:text-white">
										{data?.title}
									</h2>
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

			<div className="w-full p-4 shadow-lg rounded-lg text-sm flex flex-col items-center md:px-[40px] bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] justify-between overflow-auto">
				<div className="w-full h-full overflow-auto pr-6">
					{data &&
						data?.Issues.map((pullRequest, index) => (
							<div className="flex flex-row w-full justify-between border-b border-[#D4D4D4] pb-4 mb-6 hover:bg-[#161f2d]">
								<div className="flex flex-row">
									<div className="flex flex-col gap-[25px]">
										<div className="flex flex-col">
											<div className="flex gap-[5px]">
												<h2 className="font-semibold dark:text-white">
													{pullRequest.title}
												</h2>
											</div>
											<span className="font-light text-[#313131] dark:text-[#8B929F]">
												#{pullRequest.number} opened on May 23 by ramirc5
											</span>
										</div>
										<button className="flex border border-[#919190] dark:border-[#8B929F] rounded-md text-[10px] px-[12px] w-[180px] md:w-[220px] justify-between items-center gap-[5px]">
											<div className="flex gap-[10px]">
												<img
													className="w-[14px]"
													src={dark ? githubDarkmode : githubLogo}
												/>
												<span className="font-semibold max-w-[125px] text-ellipsis overflow-hidden text-nowrap dark:text-white">
													{pullRequest.title}
												</span>
											</div>
											<img src={dark ? darkExternalLink : ExternalLink} />
										</button>
									</div>
								</div>
								<div className="flex flex-col justify-end gap-[10px] md:gap-0 items-end md:justify-between ">
									<button className="border border-[#D4D4D4] dark:border-[#8B929F] rounded-md  px-[10px] py-[3px] w-[125px] dark:text-white">
										View Pull Request
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
