import { Link } from "react-router-dom";
import lightmode from "../assets/lightmode.svg";
import darkmode from "../assets/darkmode.svg";
import lock from "../assets/lock.png";
import darkmodeLock from "../assets/darkmodelock.png";
import { useStore } from "../store";
import logo from "../assets/logo.png";
import darkmodelogo from "../assets/darkmodelogo.png";
import DropDown from "./DropDown.jsx";

const Nav = ({ themeHandler }) => {
	const { dark, user } = useStore();

	return (
		<>
			<div className="mx-auto justify-between flex items-end h-[11vh] w-full px-2 lg:p-0 lg:items-end lg:w-[66%] mb-[27px] md:mb-[20px] dark:text-white">
				<div className="grid justify-items-start flex-col gap-[10px] lg:flex lg:items-end lg:flex-row lg:gap-[30px] lg:h-1/3">
					<span className="text-[28px] font-bold lg:text-[24px]">
						<Link to="/">
							<img src={dark ? darkmodelogo : logo} />
						</Link>
					</span>
					<span className="flex space-around gap-[20px] items-center text-charcoal rounded-2xl border border-1 px-[20px] dark:border-dark-gray border-charcoal">
						<img
							className="w-[14px] h-[14px]"
							src={dark ? darkmodeLock : lock}
						/>
						<h1 className="font-inter text-[12px] dark:text-white">
							Technical Preview
						</h1>
					</span>
				</div>
				<div
					className={`grid items-end justify-items-end h-full ${
						user.isLoggedIn ? "flex-row" : "flex-col"
					} lg:flex lg:flex-row lg:h-1/3 lg:items-end  lg:gap-[50px]`}
				>
					<span className="m-1">
						<img
							onClick={() => themeHandler()}
							className="w-[16px] h-[16px] cursor-pointer"
							src={dark ? darkmode : lightmode}
						/>
					</span>
					<span className="flex">
						{user.isLoggedIn ? (
							<DropDown />
						) : (
							<Link to="/login">
								<button
									className=" rounded-md border border-charcoal px-4 hover:bg-charcoal hover:text-white dark:bg-charcoal dark:border-dark-gray dark:border-2 dark:text-white "
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
