import React from "react";
import { useState } from "react";

export default function Modal({ modalOptions }) {
	const {
		setModalOptions,
		showModal,
		title,
		description,
		cb,
		config = {
			prompts: { 0: "Yes", 1: "No" },
			args: null,
		},
	} = modalOptions;

	const { prompts, args } = config;

	const callbackHandler = () => {
		console.log(args);
		cb(args);
		setModalOptions({ showModal: false });
	};

	if (!showModal) {
		return;
	}

	return (
		<>
			<div
				onClick={() => setModalOptions({ showModal: false })}
				className="w-100vw h-100vh bg-black/40 absolute z-10 left-0 top-0 right-0 bottom-0 dark:bg-black/70"
			></div>
			<div className="w-100vw h-100vh flex items-center justify-center absolute z-10 left-0 top-0 right-0 bottom-0">
				<div className="flex mx-auto justify-items-stretch flex-col gap-4 w-[420px] h-[250px] bg-white rounded-md dark:bg-dark-gray dark:text-white p-6">
					<div className="text-[14px] text-gray-500 dark:text-white mb-2">
						{title}
					</div>
					<div className="text-[11px] flex-grow text-charcoal dark:text-white mb-2">
						{description}
					</div>
					<div className="flex h-12 items-start gap-6 flex-row">
						<span>
							<button
								className={`px-5 py-1 rounded text-[11px] bg-charcoal text-white dark:bg-gray-900 dark:hover:bg-gray-950`}
								onClick={() => callbackHandler(args)}
								type="button"
							>
								{prompts[0]}
							</button>
						</span>
						<span>
							<button
								className={`px-5 py-1 rounded text-[11px] border border-charcoal hover:bg-charcoal hover:text-white dark:text-white dark:bg-transparent dark:border-gray-900 dark:hover:border-gray-950`}
								onClick={() => setModalOptions({ showModal: false })}
								type="button"
							>
								{prompts[1]}
							</button>
						</span>
					</div>
				</div>
			</div>
		</>
	);
}
