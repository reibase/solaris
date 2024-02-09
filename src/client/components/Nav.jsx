import { Link } from "react-router-dom";
import lightmode from "../assets/lightmode.svg";
import darkmode from "../assets/darkmode.svg";
import lock from "../assets/Lock.svg";
import darkmodeLock from "../assets/lock-darkmode.svg";
import { useStore } from "../store";

const Nav = () => {
	const { dark, toggleDark, user } = useStore();

	const themeHandler = () => {
		toggleDark();

		localStorage.theme === "light"
			? document.documentElement.classList.add("dark")
			: document.documentElement.classList.remove("dark");

		localStorage.theme === "dark"
			? (localStorage.theme = "light")
			: (localStorage.theme = "dark");
	};
	return (
		<>
			<div
				className="mx-auto flex items-center py-[30px] w-2/3 justify-between
					dark:text-white"
			>
				<div className="flex items-center gap-[30px]">
					<Link to="/">
						<h1 className="font-inter text-[24px] font-bold text-center">
							SOLARIS
						</h1>
					</Link>
					<div className="flex space-around gap-[20px] items-center text-gray-600 rounded-2xl border-2 dark:border-2 h-[23px] px-[20px] dark:border-[#373D47] border-[#313131]">
						<img
							className="w-[14px] h-[14px]  dark:border-2"
							src={dark ? darkmodeLock : lock}
						/>
						<h1
							className="font-inter text-[12px] font-medium
								dark:text-white"
						>
							TECHNICAL PREVIEW
						</h1>
					</div>
				</div>
				<div className="flex gap-[15px] cursor-pointer">
					<img
						onClick={() => themeHandler()}
						className="w-[15px] h-[15px]"
						src={dark ? darkmode : lightmode}
					/>
					{user.isLoggedIn ? (
						<img
							class="mb-[35px] w-4 h-4 rounded-full object-cover"
							src={user.info.avatar}
							alt="User avatar"
						/>
					) : null}
				</div>
			</div>
		</>
	);
};

export default Nav;
