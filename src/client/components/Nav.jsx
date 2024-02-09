import { Link } from "react-router-dom";
import lightmode from "../assets/lightmode.svg";
import darkmode from "../assets/darkmode.svg";
import lock from "../assets/lock.png";
import darkmodeLock from "../assets/darkmodelock.png";
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
			<div className="mx-auto flex items-center p-4 lg:items-end lg:py-[30px] lg:w-2/3 justify-between dark:text-white">
				<div className="flex items-start lg:items-center flex-col lg:flex-row lg:gap-[30px]">
					<span>
						<Link to="/">
							<h1 className="font-inter text-[28px] lg:text-[24px] font-bold text-center">
								SOLARIS
							</h1>
						</Link>
					</span>
					<div className="flex space-around gap-[20px] items-center text-gray-600 rounded-2xl border border-1 dark:border-2 h-[23px] px-[20px] dark:border-d3 border-l5">
						<img
							className="w-[14px] h-[14px]"
							src={dark ? darkmodeLock : lock}
						/>
						<h1 className="font-inter text-[12px] font-semibold dark:text-white">
							TECHNICAL PREVIEW
						</h1>
					</div>
				</div>
				<div
					className={`flex  m-2 ${
						user.isLoggedIn ? "flex-row" : "flex-col"
					} lg:flex-row items-end lg:items-center gap-[10px] lg:gap-[50px] lg:self-center`}
				>
					<span>
						<img
							onClick={() => themeHandler()}
							className="w-[16px] h-[16px] cursor-pointer"
							src={dark ? darkmode : lightmode}
						/>
					</span>
					<span>
						{user.isLoggedIn ? (
							<img
								class="w-6 h-6 me-1 rounded-full object-cover"
								src={user.info.avatar}
							/>
						) : (
							<Link to="/">
								<button
									className=" rounded-md border border-l5 px-4 hover:bg-l5 hover:text-white dark:bg-[#18181B] dark:border-d3 dark:border-2 dark:text-white "
									type="button"
								>
									Sign in
								</button>
							</Link>
						)}
					</span>
				</div>
			</div>
		</>
	);
};

export default Nav;
