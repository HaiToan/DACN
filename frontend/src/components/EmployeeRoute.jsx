// frontend/src/components/EmployeeRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const EmployeeRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated and has the 'NhanVien' role
    const isEmployee = token && userRole === 'NhanVien';

    if (!isEmployee) {
        // If user is not an employee, redirect to login page
        // Pass the original location so they can be redirected back if they log in as an employee
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default EmployeeRoute;
