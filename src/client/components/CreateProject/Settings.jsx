import React from "react";
import { useState } from "react";

export default function Settings({ project, setProject }) {
	const [error, setError] = useState(false);
	const changeHandler = (e) => {
		setProject({ ...project, [e.target.name]: parseInt(e.target.value) });
	};

	return (
		<div className="flex flex-col h-full divide-y gap-4 w-full mb-4 lg:divide-x lg:divide-y-0 lg:flex-row dark:text-white">
			<form>
				<div>
					<span className="">Total amount of credits for this project:</span>
					<div className="flex mt-2 h-8 flex-row gap-5">
						<span>
							<input
								disabled
								className="mr-2"
								name="creditAmount"
								value={100}
								type="radio"
								checked={project.creditAmount === 100}
								onChange={(e) => changeHandler(e)}
							/>
							<label htmlFor="100" />
							100
						</span>
						<span>
							<input
								disabled
								className="mr-2"
								name="creditAmount"
								value={1000}
								type="radio"
								checked={true}
								onChange={(e) => changeHandler(e)}
							/>
							<label htmlFor="1000" />
							1000
						</span>
						<span>
							<input
								disabled
								className="mr-2"
								name="creditAmount"
								value={10000}
								type="radio"
								checked={project.creditAmount === 10000}
								onChange={(e) => changeHandler(e)}
							/>
							<label htmlFor="10000" />
							10,000
						</span>
					</div>
				</div>
				<div className="mt-4">
					<span>
						Number of credits required to close or merge pull requests:
					</span>
					<div>
						<input
							className={`w-20 mt-2 p-2 rounded-md border dark:bg-mid-gray dark:text-white dark:border-dark-gray dark:focus:border-indigo-400
                                                    ${
																											error &&
																											"border-red-500 text-red-500 dark:border-red-500"
																										}`}
							type="number"
							name="quorum"
							disabled
							value={project.quorum}
							onChange={(e) => changeHandler(e)}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
