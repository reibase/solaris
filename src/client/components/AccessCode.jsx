import React from "react";
import Nav from './Nav.jsx'
import { Link } from "react-router-dom";

const AccessCode = () => {
    return(
        <>
            <Nav />
            <div className="mx-auto shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
 
                <h1 className="mb-[20px] text-3xl font-bold text-center">
                    SOLARIS
                </h1>
                <p className="mb-[40px]">Welcome to the Solaris Technical Preview </p>
                <p className="mb-[40px]">Please enter your access code to continue.</p>
                <div class="flex gap-[20px]">
                    <div class="w-[300px] flex flex-col gap-2">
                        <label for="name" class="text-sm font-light text-gray-900">Name *</label>
                        <input type="text" id="name" class="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black" placeholder="Access Code"/>
                    </div>
                    <Link to="/profile">
                        <button class="mt-[30px] mx-auto bg-[#313131] w-[175px] px-[20px] text-white rounded-md px-4 py-[0px]">Continue</button>
                    </Link>
                </div>
                <div className='text-slate-600 mt-[100px]'>
                    <p>Don't have an access code? Request access  
                        <Link to="/requestaccess"> <span className="underline"> here.</span></Link>
                    </p>
                </div>

            </div>
        </>
    );
}

export default AccessCode