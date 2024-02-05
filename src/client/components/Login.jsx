import Nav from "./Nav.jsx";
import githubLogo from "../assets/github.svg";
import gmailLogo from "../assets/gmail.svg";
import gitlab from "../assets/gitlab.svg"
import { Link } from "react-router-dom";

// To do:
// 1. a href links need to point to serivce, github etc, not 'etc'
// 2. add gitlab button, with endpoint /api/auth/gitlab
// 3. Practice signing in to each service, log out of GitHub or Google to make sure it works because it
// redirects to "/" so it's hard to tell what happened.

const Login = () => {
	return (
		<>
			<Nav />
			<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
				<h1 className="font-inter mb-[70px] text-3xl font-bold underline text-center">
					Solaris Logo
				</h1>
				<div class="flex flex-col gap-[20px]">
					<a
						href="/api/auth/github"
						className="flex gap-[10px] w-[300px] px-[20px] items-center w-full rounded-md border border-black"
					>
						<span className="font-inter">Continue with GitHub</span>
						<img src={githubLogo} />
					</a>
					<a
						href="/api/auth/etc"
						className="flex gap-[10px] w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black"
					>
						<span className="font-inter">Continue with GitLab</span>
						<img src={gitlab} />
					</a>
					<a
						href="/api/auth/etc"
						className="flex gap-[10px] w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black"
					>
						<span className="font-inter">Continue with Google</span>
						<img src={gmailLogo} />
					</a>
				</div>
				<Link to="/requestaccess">
					<button class="font-inter mt-[30px] mx-auto bg-[#313131] w-[350px] px-[20px] text-white rounded-md px-4 py-[3px]">
						Request Access
					</button>
				</Link>
			</div>
		</>
	);
};

export default Login;
