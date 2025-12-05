import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This hook checks if a user is authenticated by looking for the token.
const useAuth = () => {
  const token = localStorage.getItem('token');
  // Returns an object with the authentication status.
  return { isAuthed: !!token };
};

const ProtectedRoute = ({ children }) => {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    // If not authenticated, redirect to the /auth page.
    // We pass the current location in the state so we can redirect back after login.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;