import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import AccessCode from "./components/AccessCode.jsx";
import RequestAccess from "./components/RequestAccess.jsx";
import "./index.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{ path: "/", element: <AccessCode /> },
	{ path: "/requestaccess", element: <RequestAccess /> },
	{ path: "/login", element: <Login /> },
	{ path: "/profile", element: <Profile /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
