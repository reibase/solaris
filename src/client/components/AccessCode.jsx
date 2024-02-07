import React, { useState } from "react";
import Nav from "./Nav.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";

const AccessCode = () => {
	const [clicked, setClicked] = useState(false);
	const [codeAccepted, setCodeAccepted] = useState(false);
	const [code, setCode] = useState("");
	const navigate = useNavigate();

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
			<div className="mx-auto block h-[455px] my-10 bg-white shadow-lg rounded-lg flex flex-col items-center p-[40px] lg:w-2/5">
				<div className="flex flex-col h-full">
					<div>
						<h1 className="font-inter mb-[20px] text-3xl font-bold text-center">
							SOLARIS
						</h1>
						<p className="font-inter font-light text-sm text-center">
							Welcome to the Solaris Technical Preview{" "}
						</p>
						<p className="font-inter text-sm font-light mb-[50px] text-center">
							Please enter your access code to continue.
						</p>
						<div className="flex flex-col items-center gap-[50px]">
							<div className="flex gap-[20px]">
								<div className="w-[250px] flex flex-col">
									<label
										for="code"
										className="font-inter text-sm font-light text-gray-900"
									></label>
									<input
										type="text"
										id="code"
										className={`font-light block w-full px-[5px] py-[5px] rounded-md border ${
											error || data?.status === 401
												? "border-red-500 text-red-500 focus:border-red-500"
												: "border-black focus:border-blue-500"
										} `}
										placeholder="Access Code"
										onChange={(e) => changeHandler(e)}
									/>
									{data?.status === 401 ? (
										<p className="text-red-500 text-sm mt-[10px]">
											The access code you have entered is invalid.
										</p>
									) : null}
								</div>
								<button
									className="font-inter mx-auto bg-[#313131] h-[36px] w-[125px] px-[30px] text-white rounded-md py-[5px]"
									onClick={() => setClicked(true)}
								>
									Continue
								</button>
							</div>
							{isFetching ? <CircularProgress /> : null}
						</div>
					</div>
				</div>
				<div className="text-slate-600 items-end">
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
