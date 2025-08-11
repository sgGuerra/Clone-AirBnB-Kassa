import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ListingDetailsPage from './pages/ListingDetailsPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

// Define the application's routes using createBrowserRouter
const router = createBrowserRouter([
  {
    // The root path renders the App component, which acts as the main layout
    // (including Header, Footer, and the Outlet for child routes).
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // The default child route to render at '/'
        element: <HomePage />,
      },
      {
        path: 'listings/:id', // Route for viewing a single property's details
        element: <ListingDetailsPage />,
      },
      {
        path: 'profile', // User profile page
        element: <ProfilePage />,
      },
      {
        path: 'login', // Login and registration page
        element: <LoginPage />,
      },
    ],
  },
])

// The root of the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider makes authentication context available to the entire app */}
    <AuthProvider>
      {/* RouterProvider provides the routing configuration to the app */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)