import React from "react";

export default function RepoItem({
	project,
	setProject,
	hostID,
	title,
	visible,
	installationID,
	setVisible,
	isPrivate,
	url,
}) {
	const clickHandler = (e) => {
		setVisible(false);
		setProject({
			...project,
			title: title,
			hostID: hostID,
			installationID: installationID,
			identifier: title,
			url: url,
			isPrivate: isPrivate,
		});
	};

	return (
		<div
			className="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:bg-midnight/40 dark:text-gray-200 dark:hover:bg-midnight/75"
			onClick={() => clickHandler()}
		>
			{title === project.title ? "x" : null}
			{title}
		</div>
	);
}
