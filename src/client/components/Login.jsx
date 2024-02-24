import githubLogo from "../assets/github.svg";
import githubDarkmode from "../assets/github-darkmode.svg";
import gmailLogo from "../assets/gmail.svg";
import gitlab from "../assets/gitlab.svg";
import { Link } from "react-router-dom";
import { useStore } from "../store.js";
import AccessCode from "./AccessCode.jsx";
const Login = () => {
  const { dark, toggleDark, user } = useStore();
  if (!user.access) {
    return <AccessCode />;
  }
  return (
    <>
      <div className="mx-2 lg:mx-auto  block h-[455px] my-10 shadow-lg rounded-lg text-sm flex flex-col items-center p-[40px] lg:w-1/2 bg-white border border-1 border-transparent dark:bg-[#202530] dark:border-[#373D47]">
        <h1 className="font-inter mb-[25px] text-3xl font-bold text-center dark:text-white">
          SOLARIS
        </h1>
        <p className="font-inter text-center text-sm leading-6 dark:text-[#8B929F]">
          Welcome to the Solaris Technical Preview.
        </p>
        <p className="font-inter mb-[60px] text-center dark:text-[#8B929F]">
          Please log in or sign up to continue.
        </p>
        <div class="flex flex-col gap-[20px]">
          <a href="/api/auth/github">
            <div className="flex flex-row w-[310px] space-between rounded-md p-1.5 border  border-[#313131] dark:bg-[#18181B] dark:border-[#373D47] dark:border-2">
              <span className="font-inter w-5/6 ml-4 dark:text-white">
                Continue with GitHub
              </span>
              <span className="w-1/6  mx-auto flex dark:text-white">
                <img
                  className={`w-[20px] h-[20px]`}
                  src={dark ? githubDarkmode : githubLogo}
                />
              </span>
            </div>
          </a>
          <a href="/api/auth/gitlab">
            <div className="flex flex-row w-[310px] space-between rounded-md p-1.5 border  border-[#313131] dark:bg-[#18181B] dark:border-[#373D47] dark:border-2">
              <span className="font-inter w-5/6 ml-4 dark:text-white">
                Continue with GitLab
              </span>
              <span className="w-1/6  mx-auto flex dark:text-white">
                <img src={gitlab} />
              </span>
            </div>
          </a>
          <a href="/api/auth/google">
            <div className="flex flex-row w-[310px] space-between rounded-md p-1.5 border  border-[#313131] dark:bg-[#18181B] dark:border-[#373D47] dark:border-2">
              <span className="font-inter w-5/6 ml-4 dark:text-white">
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
