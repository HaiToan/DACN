// frontend/src/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <main className="p-8">
                <Outlet /> {/* Nested admin pages will be rendered here */}
            </main>
        </div>
    );
};

export default AdminLayout;
