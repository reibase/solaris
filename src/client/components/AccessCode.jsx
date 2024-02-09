import React, { useState } from "react";
import Nav from "./Nav.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { useStore } from "../store.js";

const AccessCode = () => {
	const [clicked, setClicked] = useState(false);
	const [codeAccepted, setCodeAccepted] = useState(false);
	const [code, setCode] = useState("");
	const navigate = useNavigate();
	const { dark } = useStore();
	const access = async () => {
		setClicked(false);
		if (code.length < 5) {
			return { status: 401 };
		}
		try {
			const res = await axios.post("/api/auth/access-code", { code });
			setCodeAccepted(true);
			return res.data;
		} catch (error) {
			throw new Error("Invalid access code");
		}
	};

	const changeHandler = (e) => {
		setCode(e.target.value);
	};

	const { data, error, isFetching } = useQuery({
		queryKey: ["confirmed"],
		queryFn: access,
		enabled: clicked,
	});

	if (data && data.status === 200 && codeAccepted) {
		setCodeAccepted(false);
		navigate("/login");
	}

	return (
		<>
			<Nav />
			<div className="mx-auto block h-[455px] my-10 shadow-lg rounded-lg text-sm flex flex-col items-center p-[40px] lg:w-2/5 bg-white dark:bg-[#202530] dark:border-[#373D47] dark:border-2">
				<div className="flex items-center flex-col h-full w-full">
					<h1 className="font-inter mb-[20px] text-3xl font-bold text-center dark:text-[#DDDCDC]">
						SOLARIS
					</h1>
					<p className="font-inter text-sm text-center dark:text-white">
						Welcome to the Solaris Technical Preview{" "}
					</p>
					<p className="font-inter text-sm  mb-[50px] text-center dark:text-white">
						Please enter your access code to continue.
					</p>
					{/* Wraps input and button */}
					<div className="flex w-5/6 flex-col items-start lg:gap-[20px] lg:flex-row lg:h-20">
						{/* Wraps input and error text */}
						<span className="w-full lg:w-3/5">
							<label
								for="code"
								className="font-inter text-sm  text-gray-900"
							></label>
							<input
								type="text"
								id="code"
								className={` w-full bg- p-2 rounded-md border dark:bg-[#202530] dark:text-white dark:border-[#373D47] dark:focus:border-indigo-400
					${data?.status === 401 && "border-red-500 text-red-500 dark:border-red-500"}`}
								placeholder="Access Code"
								onChange={(e) => changeHandler(e)}
							/>
							<span className=" block h-14 ">
								{data?.status === 401 && (
									<p className="text-red-500 text-sm">
										The access code you have entered is invalid.
									</p>
								)}
							</span>
						</span>
						<span className="lg:w-2/5 w-full">
							<button
								className="font-inter bg-[#313131] p-2 w-full text-white rounded-md dark:bg-[#18181B] dark:border-[#373D47] dark:border-2"
								onClick={() => setClicked(true)}
							>
								Continue
							</button>
						</span>
						{isFetching ? <CircularProgress /> : null}
					</div>
				</div>
				<div className="dark:text-white text-slate-600items-end">
					<p className="font-inter text-sm">
						Don't have an access code? Request access
						<Link to="/requestaccess">
							{" "}
							<span className="font-inter underline"> here.</span>
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default AccessCode;
