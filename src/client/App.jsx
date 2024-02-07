import RequestAccess from "./components/RequestAccess.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import AccessCode from "./components/AccessCode.jsx";
import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { useStore } from "./store";

function App() {
  const { dark } = useStore();

  const getUser = async () => {
    const { data } = await axios.get("/api/auth/me").then((res) => res);
    return data;
  };

	const { data } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const router = createBrowserRouter(
		!data?.isLoggedIn
			? [
					{ path: "/", element: <AccessCode /> },
					{ path: "/requestaccess", element: <RequestAccess /> },
					{ path: "/login", element: <Login /> },
					{ path: "/access", element: <AccessCode /> },
			  ]
			: [
					{ path: "/", element: <Profile data={data} /> },
					{ path: "/profile", element: <Profile data={data} /> },
					{ path: "/requestaccess", element: <Profile data={data} /> },
					{ path: "/login", element: <Profile data={data} /> },
					{ path: "/access", element: <Profile data={data} /> },
			  ]
	);

<<<<<<< HEAD
  return (
    <div className={` ${dark ? "bg-[#0d0d0e]" : "bg-[#f9f9f9]"} min-h-[100vh]`}>
      <RouterProvider router={router} />
    </div>
  );
=======
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
>>>>>>> 00da0dd11200f7b84db89038ed74febfad6a28da
}

export default App;
