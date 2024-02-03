import { Link } from "react-router-dom";
import lightmode from "../assets/lightmode.svg"
import darkmode from "../assets/darkmode.svg"
import lock from "../assets/Lock.svg"
const Nav = () => {

    return(
        <>
            <div className="mx-auto flex items-center py-[30px] w-3/5 justify-between">
                    <div className="flex items-center gap-[30px]">
                        <Link to="/">
                            <h1 className="font-inter text-[24px] font-bold text-center">
                                SOLARIS
                            </h1>
                        </Link>
                        <div className="flex space-around gap-[20px] items-center text-gray-600 rounded-2xl border border-black px-[20px]">   
                            <img className="w-[15px] h-[15px] "src={lock}/>
                            <h1 className="font-inter text-[12px] font-bold">TECHNICAL PREVIEW</h1>
                        </div>
                            
                    </div>    
                    <div className="flex gap-[15px]">
                        <img className="w-[15px] h-[15px] "src={lightmode}/>
                        <img className="w-[15px] h-[15px] "src={darkmode}/>
                    </div>            
            </div>
        </>
    );
}

export default Nav