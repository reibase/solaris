import React from "react";

export default function Panel(
	heights = "h-full lg:h-full",
	widths = "w-full lg:h-full",
	display = "flex",
	props = ""
) {
	return (
		<div
			className={`${heights} ${widths} ${display}
                        mx-2 lg:mx-auto block shadow-lg rounded-lg
                        p-[40px] bg-white dark:bg-[#202530] 
                        border border-transparent border-1 dark:border-[#373D47]
                        ${props}`}
		></div>
	);
}
