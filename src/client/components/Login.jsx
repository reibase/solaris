import Nav from "./Nav.jsx";
import githubLogo from "../assets/github.svg";
import gmailLogo from "../assets/gmail.svg";
import gitlab from "../assets/gitlab.svg";
import { Link } from "react-router-dom";

const Login = () => {
	return (
		<>
			<Nav />
			<div className="mx-auto block h-[455px] my-10 bg-white shadow-lg rounded-lg text-sm flex flex-col items-center p-[40px] lg:w-2/5">
				<h1 className="font-inter mb-[30px] text-3xl font-bold text-center">
					SOLARIS
				</h1>
				<p className="font-inter font-light text-center">
					Welcome to the Solaris Technical Preview.
				</p>
				<p className="font-inter font-light mb-[60px] text-center">
					Please log in or sign up to continue.
				</p>
				<div class="flex flex-col gap-[20px]">
					<a href="/api/auth/github">
						<div className="flex flex-row w-[310px] space-between rounded-md border border-[#313131] p-1">
							<span className="font-inter w-5/6 ml-4">
								Continue with GitHub
							</span>
							<span className="w-1/6  mx-auto flex">
								<img src={githubLogo} />
							</span>
						</div>
					</a>
					<a href="/api/auth/gitlab">
						<div className="flex flex-row w-[310px] space-between rounded-md border border-[#313131] p-1">
							<span className="font-inter w-5/6 ml-4">
								Continue with GitLab
							</span>
							<span className="w-1/6  mx-auto flex">
								<img src={gitlab} />
							</span>
						</div>
					</a>
					<a href="/api/auth/google">
						<div className="flex flex-row w-[310px] space-between rounded-md border border-[#313131] p-1">
							<span className="font-inter w-5/6 ml-4">
								Continue with Google
							</span>
							<span className="w-1/6  mx-auto flex">
								<img src={gmailLogo} />
							</span>
						</div>
					</a>
				</div>
			</div>
		</>
	);
};

export default Login;
