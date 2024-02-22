import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { useStore } from "./store";
import { React, useEffect } from "react";

import RequestAccess from "./components/RequestAccess.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import AccessCode from "./components/AccessCode.jsx";
import Layout from "./Layout.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Create from "./components/CreateProject/Create.jsx";
import Issues from "./components/Projects/Issues.jsx";
import Votes from "./components/Projects/Votes.jsx";
import Settings from "./components/Projects/Settings.jsx";

function App() {
	const { user, setUserInfo } = useStore();

	const getUser = async () => {
		try {
			await axios.get("/api/auth/me").then(({ data }) => {
				const updatedUserInfo = data?.isLoggedIn
					? {
							isLoggedIn: true,
							info: {
								id: data.id,
								username: data.username,
								avatar: data.avatar,
								verifiedThru: data.verifiedThru,
								email: data.email,
							},
					  }
					: false;
				setUserInfo(updatedUserInfo);
				data?.isLoggedIn &&
					localStorage.setItem("user", JSON.stringify(updatedUserInfo));
			});
		} catch (error) {
			console.log(error);
		}
	};

	const { data, isFetching } = useQuery({
		queryKey: ["userinfo"],
		queryFn: getUser,
		enabled: !user.info.id,
	});

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: !user.isLoggedIn
				? [
						{ index: true, element: <AccessCode /> },
						{ path: "/Profile", element: <Profile /> },
						{ path: "/requestaccess", element: <RequestAccess /> },
						{ path: "/login", element: <Login /> },
						{ path: "/access", element: <AccessCode /> },
				  ]
				: [
						{ index: true, element: <Projects /> },
						{ path: "/profile", element: <Profile /> },
						{ path: "/requestaccess", element: <Profile /> },
						{ path: "/login", element: <Profile /> },
						{ path: "/access", element: <Profile /> },
						{ path: "/projects", element: <Projects /> },
						{ path: "/projects/:id", element: <Issues /> },
						{ path: "/create", element: <Create /> },
						{ path: "/projects/:id/issues/:issueID", element: <Votes /> },
						{ path: "/issues", element: <Issues /> },
				  ],
		},
	]);

	if (isFetching) {
		return "loading";
	}
	return <RouterProvider router={router} />;
}

export default App;
