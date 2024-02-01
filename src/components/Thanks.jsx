import React from "react";
import Nav from './Nav.jsx'
import { Link } from "react-router-dom";

const Thanks = () => {
    return(
        <>
            <Nav />
            <div className="mx-auto min-h-[60vh] bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
 
                <h1 className="font-inter mb-[20px] text-3xl font-bold text-center">
                    SOLARIS LOGO
                </h1>
                <p className="font-inter font-light w-1/2 text-center">Thank you for your interest in the Solaris
 technical preview. We will be in touch shortly.</p>
               
              

            </div>
        </>
    );
}

export default Thanks