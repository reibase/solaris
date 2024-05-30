import React from "react";

export default function SelectionButton({
	label,
	value,
	clickHandler,
	selected,
	icon,
}) {
	return (
		<button
			type="button"
			className={`${
				selected && "bg-powder-blue dark:bg-midnight"
			} flex flex-row gap-4 items-center px-4 w-[140px] py-1 border border-1 rounded-md border-slate-gray hover:bg-powder-blue dark:border-slate-gray dark:hover:bg-midnight/75 dark:text-white`}
			value={value}
			onClick={(e) => clickHandler(e)}
		>
			<img className="w-5" src={icon} />
			{label}
		</button>
	);
}
