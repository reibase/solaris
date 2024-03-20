import React from "react";
import Modal from "./Modal.jsx";
import { useState } from "react";

export default function Mode({
	setUpdatedProject,
	updatedProject,
	deleteHandler,
	changeHandler,
	updateProject,
}) {
	const [modalOptions, setModalOptions] = useState({ showModal: false });

	return (
		<>
			<div className="w-full my-4 border-t dark:border-[#919190]">
				<div className="flex my-4 justify-start items-start flex-col">
					<span className="text-[#313131] mb-2 dark:text-white font-[14px]">
						Project Mode:
					</span>
					<div className="flex">
						<div className="flex flex-col items-center gap-[10px]">
							<div className="flex">
								<label
									for="live"
									className="text-[#313131] dark:text-white text-[11px] font-medium text-gray-700"
								>
									Live
								</label>
								<input
									onChange={() =>
										setModalOptions({
											title: "Change Project Mode",
											description:
												"Are you sure you would like to change this project's mode from live to test?",
											setModalOptions: setModalOptions,
											showModal: true,
											cb: updateProject,
											config: {
												prompts: { 0: "Yes, I am sure", 1: "No, Take me back" },
												args: { ...updatedProject, live: true },
											},
										})
									}
									type="radio"
									name="live"
									value={true}
									checked={updatedProject?.live ? true : false}
									className="h-4 w-4 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:ring-0 ml-2"
								/>
							</div>
							<div className="flex">
								<label
									for="test"
									className="text-[#313131] dark:text-white text-[11px] font-medium text-gray-700"
								>
									Test
								</label>
								<input
									onChange={() =>
										setModalOptions({
											title: "Change Project Mode",
											description:
												"Are you sure you would like to change this project's mode from live to test?",
											setModalOptions: setModalOptions,
											cb: updateProject,
											showModal: true,
											config: {
												prompts: { 0: "Yes, I am sure", 1: "No, Take me back" },
												args: { ...updatedProject, live: false },
											},
										})
									}
									type="radio"
									name="live"
									value={false}
									checked={updatedProject?.live ? false : true}
									className="h-4 w-4 square border-gray-300 focus:ring-0 ml-2"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full h-20 my-4 items-center border-t dark:border-[#919190]">
					<span
						onClick={() =>
							setModalOptions({
								title: "Delete Project",
								description:
									"Are you sure you would like to delete this project from Solaris? This can not be undone.",
								setModalOptions: setModalOptions,
								showModal: true,
								cb: deleteHandler,
								config: {
									prompts: { 0: "Yes, I am sure", 1: "No, Take me back" },
									colors: {
										primary: "red-500",
										primaryDark: "red-500",
										secondary: "gray-600",
										secondaryDark: "gray-300",
									},
								},
							})
						}
						className="cursor-pointer font-inter text-red-500 border border-red-500 rounded-md py-1 px-3 hover:text-white hover:bg-red-500"
					>
						Delete Project
					</span>
				</div>
			</div>
			<Modal modalOptions={modalOptions} />
		</>
	);
}
