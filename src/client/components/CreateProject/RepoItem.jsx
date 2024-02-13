import React from "react";

export default function RepoItem({
	project,
	setProject,
	hostID,
	title,
	visible,
	setVisible,
}) {
	const clickHandler = (e) => {
		setVisible(false);
		setProject({ ...project, title: title, hostID: hostID });
	};

	return (
		<div
			className="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-[#373D47] dark:text-[#8B929F] dark:hover:bg-[#0F172A]/75"
			onClick={() => clickHandler()}
		>
			{title === project.title ? "x" : null}
			{title}
		</div>
	);
}
