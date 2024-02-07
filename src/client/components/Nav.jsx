import { Link } from "react-router-dom";
import lightmode from "../assets/lightmode.svg";
import darkmode from "../assets/darkmode.svg";
import circle from "../assets/circle.svg";
import lock from "../assets/Lock.svg";
import darkmodeLock from "../assets/darkmodeLock.svg";
import { useStore } from "../store";

const Nav = () => {
  const { dark, toggleDark } = useStore();

  return (
    <>
      <div
        className={`mx-auto flex items-center py-[30px] w-2/3 justify-between ${
          dark ? "bg-[#0d0d0e] text-white" : null
        }`}
      >
        <div className="flex items-center gap-[30px]">
          <Link to="/">
            <h1 className="font-inter text-[24px] font-bold text-center">
              SOLARIS
            </h1>
          </Link>
          <div
            className={`flex space-around gap-[20px] items-center text-gray-600 rounded-2xl border  px-[20px] ${
              dark ? "border-white" : "border-black"
            }`}
          >
            <img
              className="w-[15px] h-[15px] "
              src={dark ? darkmodeLock : lock}
            />
            <h1
              className={`font-inter text-[12px] font-bold ${
                dark ? "text-white" : null
              }`}
            >
              TECHNICAL PREVIEW
            </h1>
          </div>
        </div>
        <div className="flex gap-[15px] cursor-pointer" onClick={toggleDark}>
          <img
            className="w-[15px] h-[15px]"
            src={dark ? darkmode : lightmode}
          />
        </div>
      </div>
    </>
  );
};

export default Nav;
