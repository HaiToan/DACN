import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const useAuth = () => {
  const isLoggedIn = localStorage.getItem('userToken')? true: false;
  { isLoggedIn };
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
  }
  return children;
}
export default ProtectedRoute;