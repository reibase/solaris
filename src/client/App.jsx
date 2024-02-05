import RequestAccess from "./components/RequestAccess.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import AccessCode from "./components/AccessCode.jsx";
import Thanks from "./components/Thanks.jsx";
import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

function App() {
	const getUser = async () => {
		const { data } = await axios.get("/api/auth/me").then((res) => res);
		return data;
	};

	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const router = createBrowserRouter(
		data?.isLoggedIn
			? [
					{ path: "/", element: <Profile /> },
					{ path: "/profile", element: <Profile /> },
					{ path: "/requestaccess", element: <Profile /> },
					{ path: "/login", element: <Profile /> },
					{ path: "/access", element: <Profile /> },
					{ path: "/thanks", element: <Profile /> },
			  ]
			: [
					{ path: "/", element: <AccessCode /> },
					{ path: "/requestaccess", element: <RequestAccess /> },
					{ path: "/login", element: <Login /> },
					{ path: "/access", element: <AccessCode /> },
					{ path: "/thanks", element: <Thanks /> },
			  ]
	);

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
