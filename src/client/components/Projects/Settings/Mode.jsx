import React from "react";

export default function Mode({
	setUpdatedProject,
	updatedProject,
	deleteHandler,
	changeHandler,
}) {
	return (
		<div className="w-full m-5 p-5 border border-1 border-red-500 rounded-md">
			<div className="flex justify-start items-start flex-col">
				<span className="text-[#313131] dark:text-white font-[14px]">
					Change Mode:
				</span>
				<div className="flex">
					<div className="flex flex-col items-center gap-[10px]">
						<div className="flex">
							<label
								for="live"
								className="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
							>
								Live
							</label>
							<input
								onChange={(e) =>
									setUpdatedProject({ ...updatedProject, live: true })
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
								className="text-[#313131] dark:text-white text-sm font-medium text-gray-700"
							>
								Test
							</label>
							<input
								onChange={(e) =>
									setUpdatedProject({ ...updatedProject, live: false })
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
			<div className="flex w-full h-20 items-center">
				<span
					onClick={(e) => deleteHandler(e)}
					className="cursor-pointer font-inter text-[#D33131] border border-[#D33131] rounded-md py-[2px] px-[10px]"
				>
					Delete Project
				</span>
			</div>
		</div>
	);
}
