import { Link } from "react-router-dom";

const Nav = () => {

    return(
        <>
            <div class="mx-auto flex items-center py-[5px] w-5/6 justify-between">
                    <div className="flex items-center gap-[30px]">
                        <Link to="/">
                            <h1 className="text-[24px] font-bold text-center">
                                SOLARIS
                            </h1>
                        </Link>
                        <div className="flex space-around gap-[20px] items-center text-gray-600 rounded-2xl border border-black px-[20px]">   
                            <span>🔒</span>
                            <h1 className="text-[12px] font-bold">TECHNICAL PREVIEW</h1>
                        </div>
                            
                    </div>    
                    <div className="flex gap-[15px]">
                        <span>🔆</span>
                        <span>⚫</span>
                    </div>            
            </div>
        </>
    );
}

export default Nav