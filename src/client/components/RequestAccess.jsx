import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";

const RequestAccess = () => {
	const [submitted, setSubmitted] = useState(false);
	const [errorText, setErrorText] = useState("");
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
			<div className="mx-2 lg:mx-auto block h-[455px] my-10 shadow-lg rounded-lg text-sm flex flex-col items-center p-[40px] lg:w-1/2 bg-white border border-1 border-transparent dark:bg-mid-gray dark:border-dark-gray">
				<h1 className="mb-[20px] font-inter text-3xl font-bold text-center dark:text-light-gray">
					SOLARIS
				</h1>

				<div className="flex flex-col gap-[20px]">
					{submitted ? (
						<p className="mx-auto mt-16 font-inter w-5/6 leading-6 text-sm text-center dark:text-light-gray">
							Thank you for your interest in the Solaris technical preview. We
							will be in touch shortly.
						</p>
					) : (
						<>
							<p className="mb-[20px] text-center font-inter text-sm dark:text-light-gray">
								Request Access to Solaris Technical Preview
							</p>
							<form ref={form} onSubmit={submitHandler}>
								<div className="w-[300px] flex flex-col gap-2  mb-4">
									<label
										for="name"
										className="font-inter text-sm dark:text-light-gray text-gray-900"
									>
										Name *
									</label>
									<input
										type="text"
										name="user_name"
										id="name"
										className="rounded-md p-2 block w-full border border-gray-300 dark:bg-mid-gray dark:text-white dark:border-dark-gray dark:focus:border-indigo-400"
										placeholder=""
										required
									/>
								</div>
								<div className="w-[300px] flex flex-col gap-2">
									<label
										for="email"
										className="font-inter text-sm dark:text-light-gray text-gray-900"
									>
										Email Address *
									</label>
									<input
										type="text"
										id="email"
										name="user_email"
										className={` w-full p-2 rounded-md border dark:bg-mid-gray dark:text-white dark:border-dark-gray dark:focus:border-indigo-400
					${errorText !== "" && "border-red-500 text-red-500 dark:border-red-500"}`}
										placeholder=""
										required
									/>
									<div className="h-6 mb-2 text-sm  text-red-500">
										{errorText}
									</div>
								</div>
								<button
									type="submit"
									className=" font-inter mt-[30px] mx-auto bg-charcoal w-[300px] px-[20px] text-white rounded-md py-2 dark:bg-dark-gray dark:border-dark-gray dark:border-2"
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
