import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ListingDetailsPage from './pages/ListingDetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

// Define the application's routes using createBrowserRouter
const router = createBrowserRouter([
  {
    // The root path renders the App wrapped with AuthProvider so that
    // AuthContext can safely use react-router hooks like useNavigate.
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'listings/:id',
        element: <ListingDetailsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'checkout/:bookingId',
        element: <CheckoutPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

// The root of the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)