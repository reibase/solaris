import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import AccessCode from "./components/AccessCode.jsx";
import RequestAccess from "./components/RequestAccess.jsx";
import Thanks from "./components/Thanks.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// new endpoint: should run on load:
// get /api/auth/me -> if user is logged in, returns a user obj, else returns 404. set isLogged in to true if user obj
// change / route to be loging if not logged in and profile if logged in
const router = createBrowserRouter([
	{ path: "/", element: <AccessCode /> },
	{ path: "/profile", element: <Login /> },
	{ path: "/requestaccess", element: <Login /> },
	{ path: "/login", element: <Login /> },
	{ path: "/access", element: <AccessCode /> },
	{ path: "/thanks", element: <Thanks /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
