import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import AccessCode from './components/AccessCode.jsx'
import RequestAccess from './components/RequestAccess.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path:"/", element: <App/> },
  { path: "/profile", element: <Profile/> },
  { path: "/requestaccess", element: <RequestAccess/> },
  { path: "/login", element: <Login/> },
  { path: "/access", element: <AccessCode/> }  

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
