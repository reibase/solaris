import Nav from "./Nav.jsx";
import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const RequestAccess = () => {
	const [submitted, setSubmitted] = useState(false);
	const [errorText, setErrorText] = useState("");
	const navigate = useNavigate();
	const form = useRef();
	const changeHandler = (e) => {
		e.preventDefault();
		setForm({ ...form, [e.target.id]: e.target.value });
	};

	const submitHandler = (e) => {
		e.preventDefault();
		if (!form.current["email"].value.split("").includes("@")) {
			setErrorText("Please enter a valid email address.");
			return;
		} else {
			setErrorText("");
		}
		emailjs
			.sendForm("service_wmtm7u2", "template_v1ulh7q", form.current, {
				publicKey: "user_kDFY4AFTuoji3GQqaGDsn",
			})
			.then(
				function () {
					console.log("SUCCESS!");
					setSubmitted(true);
				},
				function (error) {
					console.log("FAILED...", error);
					setErrorText("There was an error submitting your request.");
				}
			);
	};

	return (
		<>
			<Nav />
			<div className="mx-auto block h-[455px] my-10 bg-white shadow-lg rounded-lg flex flex-col items-center p-[50px] lg:w-2/5">
				<h1 className="mb-[20px] font-inter text-3xl font-bold text-center">
					SOLARIS
				</h1>

				<div class="flex flex-col gap-[20px]">
					{submitted ? (
						<p className="mx-auto mt-16 font-inter w-5/6 leading-6 text-sm text-center">
							Thank you for your interest in the Solaris technical preview. We
							will be in touch shortly.
						</p>
					) : (
						<>
							<p className="mb-[20px] font-inter text-sm">
								Request Access to Solaris Technical Preview
							</p>
							<form ref={form} onSubmit={submitHandler}>
								<div class="w-[300px] flex flex-col gap-2  mb-4">
									<label for="name" class="font-inter text-sm text-gray-900">
										Name *
									</label>
									<input
										type="text"
										name="user_name"
										id="name"
										class="rounded-md p-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black"
										placeholder=""
										required
									/>
								</div>
								<div class="w-[300px] flex flex-col gap-2">
									<label for="email" class="font-inter text-sm text-gray-900">
										Email Address *
									</label>
									<input
										type="text"
										id="email"
										name="user_email"
										class="rounded-md p-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black"
										placeholder=""
										required
									/>
									<div className="h-6 mb-2 text-sm font-light text-red-500">
										{errorText}
									</div>
								</div>
								<button
									type="submit"
									className="font-light font-inter mt-[30px] mx-auto bg-[#313131] w-[300px] px-[20px] text-white rounded-md px-4 py-[3px]"
								>
									Request Access
								</button>
							</form>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default RequestAccess;
