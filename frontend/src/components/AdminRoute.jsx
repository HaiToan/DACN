// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    const isAuthed = token && userRole === 'Admin';

    if (!isAuthed) {
        // If user is not an admin, redirect to login page
        // Pass the original location so they can be redirected back if they log in as an admin
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default AdminRoute;
