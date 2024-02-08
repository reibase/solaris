import RequestAccess from "./components/RequestAccess.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import AccessCode from "./components/AccessCode.jsx";
import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { useStore } from "./store";
import { React, useEffect } from "react";

function App() {
  const { dark, user, setUserInfo } = useStore();

  const getUser = async () => {
    const { data } = await axios.get("/api/auth/me").then((res) => res);
    return data;
  };

  const { data } = useQuery({
    queryKey: ["userinfo"],
    queryFn: getUser,
  });

  useEffect(() => {
    if (data && data.isLoggedIn == true) {
      const updatedUserInfo = {
        isLoggedIn: true,
        info: {
          username: data.username,
          avatar: data.avatar,
          verifiedThru: data.verifiedThru,
          email: data.email,
        },
      };
      setUserInfo(updatedUserInfo);
    }
  }, [data]);

  const router = createBrowserRouter(
    !user.isLoggedIn
      ? [
          { path: "/", element: <AccessCode /> },
          { path: "/requestaccess", element: <RequestAccess /> },
          { path: "/login", element: <Login /> },
          { path: "/access", element: <AccessCode /> },
        ]
      : [
          { path: "/", element: <Profile /> },
          { path: "/profile", element: <Profile /> },
          { path: "/requestaccess", element: <Profile /> },
          { path: "/login", element: <Profile /> },
          { path: "/access", element: <Profile /> },
        ]
  );

  return (
    <div className={` ${dark ? "bg-[#131723]" : "bg-[#f9f9f9]"} min-h-[100vh]`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
