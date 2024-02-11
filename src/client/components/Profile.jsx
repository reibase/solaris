import githubLogo from "../assets/github.svg";
import gitlabLogo from "../assets/gitlab.svg";
import githubDarkmode from "../assets/github-darkmode.svg";
import gmailLogo from "../assets/gmail.svg";
import { useStore } from "../store.js";

const Profile = () => {
	const { dark, user } = useStore();
	const logo = (() => {
		switch (user.info.verifiedThru) {
			case "github":
				return dark ? githubDarkmode : githubLogo; // Use a conditional expression within the case
			case "gitlab":
				return gitlabLogo;
			case "google":
				return gmailLogo;
			default:
				return null;
		}
	})();

	return (
		<>
			<div className="mx-auto w-[375px] shadow-lg rounded-lg backdrop-blur-lg flex flex-col items-center py-[40px] bg-white/75 dark:bg-[#202530]/75 border border-transparent border-1 dark:border-[#373D47]">
				<h1
					className="font-inter mb-[50px] w-4/5 text-xl text-left
            dark:text-[#DDDCDC]"
				>
					Profile
				</h1>
				<img
					class="mb-[35px] w-28 h-28 rounded-full object-cover"
					src={user.info.avatar}
					alt="User avatar"
				/>
				<div
					className="font-inter gap-[15px] flex mb-[90px] text-center
            dark:text-white"
				>
					<img
						src={logo}
						className="w-[20px] h-[20px]"
						alt={user.info.verifiedThru}
					/>
					{user.info.username}
				</div>
				<div class="flex flex-col gap-[20px]">
					<a
						href="/api/auth/logout"
						className="flex px-1 w-[150px] rounded-md border border-1 border-gray-500"
					>
						<span className="font-inter mx-auto text-gray-500">Log out</span>
					</a>
					<a
						href="/api/auth/etc"
						className="flex px-1 w-[150px] rounded-md border border-1 border-red-500"
					>
						<span className="font-inter mx-auto text-red-500">
							Delete Account
						</span>
					</a>
				</div>
			</div>
		</>
	);
};

export default Profile;
