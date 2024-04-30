import Nav from "./components/Nav";
import { Outlet } from "react-router-dom";

const Layout = ({ themeHandler }) => {
	return (
		<div className="dark:bg-[#131723] bg-[#f9f9f9] min-h-[100vh] items-center">
			<Nav themeHandler={themeHandler} />
			<div className="flex items-center justify-center absolute top-[13.5%] lg:top-[13.5%] left-[2%] lg:left-[17%] bottom-[4%] lg:bottom-[14%] right-[2%] lg:right-[17%]">
				<Outlet />
			</div>
			{/* top */}
			<div className="top-[12%] lg:top-[11%] left-0 right-0 absolute w-[100vw] h-[1px] opacity-50 bg-[#DDDCDC] dark:bg-[#373D47]"></div>
			<div className="top-[13.5%] lg:top-[13.5%] left-0 right-0 absolute w-[100vw] h-[1px] opacity-30 bg-[#DDDCDC] dark:bg-[#373D47]"></div>

			{/* right */}
			<div className="right-[2%] lg:right-[17%] absolute top-0 bottom-0  h-[100vh] w-[1px] opacity-50 bg-[#DDDCDC] dark:bg-[#373D47]"></div>
			<div className="right-[4%] lg:right-[15.5%] hidden lg:block absolute top-0 bottom-0  h-[100vh] w-[1px] opacity-30 bg-[#DDDCDC] dark:bg-[#373D47]"></div>

			{/* bottom */}
			<div className="bottom-[4%] lg:bottom-[14%] absolute w-[100vw] h-[1px] opacity-50 bg-[#DDDCDC] dark:bg-[#373D47]"></div>
			<div className="bottom-[2%] lg:bottom-[11.5%] absolute w-[100vw] h-[1px] opacity-30 bg-[#DDDCDC] dark:bg-[#373D47]"></div>

			{/* left */}
			<div className="left-[2%] lg:left-[17%] absolute top-0 bottom-0  h-[100vh] w-[1px] opacity-50 bg-[#DDDCDC] dark:bg-[#373D47]"></div>
			<div className="left-[4%] lg:left-[15.5%] absolute top-0 bottom-0 hidden lg:block  h-[100vh] w-[1px] opacity-30 bg-[#DDDCDC] dark:bg-[#373D47]"></div>
		</div>
	);
};

export default Layout;
