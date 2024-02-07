import Nav from "./Nav.jsx";
import githubLogo from "../assets/github.svg";
import gitlabLogo from "../assets/gitlab.svg";
import gmailLogo from "../assets/gmail.svg";

const Profile = ({ data: { verifiedThru, username, avatar } }) => {
	const logo =
		verifiedThru === "github"
			? githubLogo
			: verifiedThru === "gitlab"
			? gitlabLogo
			: verifiedThru === "google"
			? gmailLogo
			: null;
	return (
		<>
			<Nav />
			<div className="mx-auto bg-white h-[550px] w-[375px] my-10 shadow-lg rounded-lg flex flex-col items-center py-[40px]">
				<h1 className="font-inter mb-[50px] w-4/5 text-xl font-bold text-left">
					Profile
				</h1>
				<img
					class="mb-[35px] w-28 h-28 rounded-full object-cover"
					src={avatar}
					alt="User avatar"
				/>

				<div className="font-inter gap-[15px] flex mb-[90px] font-medium text-center">
					{logo && <img src={logo} alt={verifiedThru} />}
					{username}
				</div>
				<div class="flex flex-col gap-[20px]">
					<a
						href="/api/auth/logout"
						className="flex font-bold w-[150px] text-sm font-medium rounded-md border-2 border-gray-500"
					>
						<span className="font-inter mx-auto text-gray-500">Log out</span>
					</a>
					<a
						href="/api/auth/etc"
						className="flex font-bold w-[150px] text-sm font-medium rounded-md border-2 border-red-500"
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
