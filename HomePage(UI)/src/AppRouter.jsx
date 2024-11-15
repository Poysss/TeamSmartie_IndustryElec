// src/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

//used to restrict access to certain pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;//checks if the user is authenticated by looking for an authToken in localStorage
  //if true successfully login, false not logged in
  //if true {children} passed ProtectedRoute
};

const AppRouter = () => {
  return (
    //uses the browser's history API to manage navigation and URL changes
    <BrowserRouter>

    {/*Contains all the defined routes in the app*/}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}//rederiction
        />
        
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;