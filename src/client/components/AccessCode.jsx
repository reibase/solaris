import React, { useState } from "react";
import Nav from "./Nav.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from '@mui/material/CircularProgress';


const AccessCode = () => {
  const [clicked, setClicked] = useState(false);
  const [codeAccepted, setCodeAccepted] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const access = async () => {
    if (code.length < 5) {
      throw new Error("Invalid access code");
    }
    try {
      const res = await axios.post("/api/auth/access-code", { code });
      setClicked(false);
      setCodeAccepted(true);
      return res.data;
    } catch (error) {
      setClicked(false);
      throw new Error("Invalid access code");
    }
  };

  const changeHandler = (e) => {
    setCode(e.target.value);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["confirmed"],
    queryFn: access,
    enabled: clicked,
  });

  if (data && data.status === 200 && codeAccepted) {
    setCodeAccepted(false);
    navigate("/login");
  }

  return (
    <>
      <Nav />
      <div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
        <h1 className="font-inter mb-[20px] text-3xl font-bold text-center">
          SOLARIS
        </h1>
        <p className="font-inter font-light">
          Welcome to the Solaris Technical Preview{" "}
        </p>
        <p className="font-inter font-light mb-[50px]">
          Please enter your access code to continue.
        </p>
        <div className="flex gap-[20px]">
          <div className="w-[300px] flex flex-col">
            <label
              for="code"
              className="font-inter text-sm font-light text-gray-900"
            ></label>
            <input
              type="text"
              id="code"
              className={`font-light block w-full px-[5px] py-[5px] rounded-md border ${
                error
                  ? "border-red-500 text-red-500 focus:border-red-500"
                  : "border-black focus:border-blue-500"
              } `}
              placeholder="Access Code"
              onChange={(e) => changeHandler(e)}
            />
            {error ? (
              <p className="text-red-500">
                The access code you have entered is invalid.
              </p>
            ) : null}
          </div>
          <button
            className="font-inter mx-auto bg-[#313131] h-[36px] w-[175px] px-[25px] text-white rounded-md py-[5px]"
            onClick={() => setClicked(true)}
          >
            Continue
          </button>
		  {isLoading ? <CircularProgress /> : null}
        </div>
        <div className="text-slate-600 mt-[100px]">
          <p className="font-inter">
            Don't have an access code? Request access
            <Link to="/requestaccess">
              {" "}
              <span className="font-inter underline"> here.</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AccessCode;
