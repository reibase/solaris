import { useQuery } from "@tanstack/react-query";
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";
import axios from "axios";
import { useStore } from "./store";
import { React, useEffect, useState } from "react";

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
import Settings from "./components/Projects/Settings/Settings.jsx";

function App() {
	const { user, setUserInfo } = useStore();

	const getUser = async () => {
		try {
			const { data } = await axios.get("/api/auth/me").then((res) => {
				console.log(res);
				return res;
			});
			console.log(data);
			return data;
		} catch (error) {
			console.log(error);
		}
	};

	const { data, isFetching: loading } = useQuery({
		queryKey: ["userinfo"],
		queryFn: getUser,
		enabled: !user.isLoggedIn,
	});

	if (data?.isLoggedIn && !user.isLoggedIn) {
		console.log("data", data);
		setUserInfo(data);
		localStorage.setItem("user", JSON.stringify(data));
	}

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: !user.isLoggedIn
				? [
						{
							index: true,
							element: <Login loading={loading} />,
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
		return (
			<div className="w-full h-full items-center justify-center px-4 py-2 shadow-md rounded-lg text-sm flex flex-col bg-white/90 dark:bg-[#202530] border border-transparent border-1 dark:border-[#373D47]">
				Dang - there was an error. Please return to{" "}
				<a className="underline" href="/">
					home.
				</a>
			</div>
		);
	}
	if (loading) {
		return "loading";
	}
	return <RouterProvider router={router} />;
}

export default App;
