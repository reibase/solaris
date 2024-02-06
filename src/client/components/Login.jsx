import Nav from "./Nav.jsx";
import githubLogo from "../assets/github.svg";
import gmailLogo from "../assets/gmail.svg";
import gitlab from "../assets/gitlab.svg";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Nav />
      <div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[40px] w-2/3 md:w-1/2 lg:w-1/2 min-h-[505px]">
        <h1 className="font-inter mb-[30px] text-3xl font-bold text-center">
          SOLARIS
        </h1>
        <p className="font-inter font-light text-center">
          Welcome to the Solaris Technical Preview{" "}
        </p>
        <p className="font-inter font-light mb-[60px] text-center">
          Please log in or sign up to continue.
        </p>
        <div class="flex flex-col gap-[25px]">
          <a
            href="/api/auth/github"
            className="flex gap-[10px] w-[300px] px-[20px] items-center w-full rounded-md border border-[#313131]"
          >
            <span className="font-inter">Continue with GitHub</span>
            <img src={githubLogo} />
          </a>
          <a
            href="/api/auth/gitlab"
            className="flex gap-[10px] w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black"
          >
            <span className="font-inter">Continue with GitLab</span>
            <img src={gitlab} />
          </a>
          <a
            href="/api/auth/google"
            className="flex gap-[10px] w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black"
          >
            <span className="font-inter">Continue with Google</span>
            <img src={gmailLogo} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Login;
