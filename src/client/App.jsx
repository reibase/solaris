import { useQuery } from "@tanstack/react-query";
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";
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
import Transfer from "./components/Projects/Transfer/Transfer.jsx";
import Settings from "./components/Projects/Settings.jsx";

function App() {
	const { user, setUserInfo } = useStore();

	const getUser = async () => {
		try {
			setTimeout(async () => {
				await axios.get("/api/auth/me").then(({ data }) => {
					const updatedUserInfo = data?.isLoggedIn && {
						isLoggedIn: true,
						info: {
							id: data.id,
							username: data.username,
							avatar: data.avatar,
							verifiedThru: data.verifiedThru,
							email: data.email,
						},
					};
					data?.isLoggedIn && setUserInfo(updatedUserInfo);
					data?.isLoggedIn &&
						localStorage.setItem("user", JSON.stringify(updatedUserInfo));
				});
			}, [1000]);
		} catch (error) {
			console.log(error);
		}
	};

	const { isFetching } = useQuery({
		queryKey: ["userinfo"],
		queryFn: getUser,
		enabled: !user.isLoggedIn,
		retry: 6,
		retryDelay: 1000,
	});

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,

			children: !user.isLoggedIn
				? [
						{
							index: true,
							element: <AccessCode />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/Profile",
							element: <Profile />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/requestaccess",
							element: <RequestAccess />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/login",
							element: <Login />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/access",
							element: <AccessCode />,
							errorElement: <ErrorBoundary />,
						},
				  ]
				: [
						{
							index: true,
							element: <Projects />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/profile",
							element: <Profile />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/requestaccess",
							element: <Profile />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/login",
							element: <Profile />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/access",
							element: <Profile />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/projects",
							element: <Projects />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/projects/:id",
							element: <Issues />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/projects/:id/transfer",
							element: <Transfer />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/projects/:id/issues/:issueID",
							element: <Votes />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/projects/:id/settings",
							element: <Settings />,
							errorElement: <ErrorBoundary />,
						},
						{
							path: "/create",
							element: <Create />,
							errorElement: <ErrorBoundary />,
						},
				  ],
		},
	]);
	function ErrorBoundary() {
		let error = useRouteError();
		console.log(error);
		return (
			<div className="w-full h-full items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				Dang - there was an error. Please return to{" "}
				<a className="underline" href="/">
					home.
				</a>
			</div>
		);
	}
	if (isFetching) {
		return "Loading";
	}
	return <RouterProvider router={router} />;
}

export default App;
