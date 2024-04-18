import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import { useStore } from "../store.js";
import httpService from "../services/httpService.js";
import check from "../assets/check.png";
import x from "../assets/x.png";

export default function Votes() {
	const { user } = useStore();

	return (
		<div className="flex w-full h-full flex items-center gap-[10px]">
			<div className="p-4 block w-full h-5/6 shadow-lg gap-10 rounded-lg text-sm flex flex-row md:flex-row items-center bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47] lg:justify-between overflow-auto">
				oof
			</div>
		</div>
	);
}
