import React from "react";
import Nav from "./Nav.jsx";
import { Link } from "react-router-dom";

// task at hand: query POST /api/auth/access-code
// with a request body which has a 'code' field with the code supplied in the input

// if res.status === 200 -> then navigate('/login') state.update('access = true')
// if res.status === 401 -> then display text which says 'The access code you have entered is invalid.'
const AccessCode = () => {
	return (
		<>
			<Nav />
			<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
				<h1 className="font-inter mb-[20px] text-3xl font-bold text-center">
					SOLARIS
				</h1>
				<p className="font-inter font-light">
					Welcome to the Solaris Technical Preview{" "}
				</p>
				<p className="font-inter font-light mb-[50px]">
					Please enter your access code to continue.
				</p>
				<div class="flex gap-[20px]">
					<div class="w-[300px]">
						<label
							for="name"
							class="font-inter text-sm font-light text-gray-900"
						></label>
						<input
							type="text"
							id="name"
							class="font-light px-[5px] py-[5px] rounded-md border border-black focus:ring-blue-500 focus:border-blue-500 block w-full border border-black"
							placeholder="Access Code"
						/>
					</div>
					<Link to="/profile">
						<button class="font-inter mx-auto bg-[#313131] w-[175px] px-[25px] text-white rounded-md py-[5px]">
							Continue
						</button>
					</Link>
				</div>
				<div className="text-slate-600 mt-[100px]">
					<p className="font-inter">
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
