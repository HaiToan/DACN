import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- Layouts ---
import AdminLayout from "./AdminLayout";
import UserPageLayout from "./UserPageLayout";

// --- Route Protectors ---
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

// --- Pages ---
// User-facing pages (Giả sử bạn có các trang này)
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import MenuPage from "../pages/MenuPage";

// Admin pages
import AdminUsers from "../pages/admin/AdminUsers";

// Placeholder cho các trang bạn chưa tạo
const Placeholder = ({ title }) => (
  <div className="text-3xl font-bold">{title}</div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* === USER-FACING ROUTES === */}
        <Route
          path="/"
          element={
            <UserPageLayout>
              <HomePage />
            </UserPageLayout>
          }
        />
        <Route
          path="/auth"
          element={
            <UserPageLayout>
              <AuthPage />
            </UserPageLayout>
          }
        />
        <Route
          path="/menu"
          element={
            <UserPageLayout title="Thực Đơn">
              <MenuPage />
            </UserPageLayout>
          }
        />
        {/* Thêm các route người dùng khác ở đây */}

        {/* === ADMIN ROUTES === */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route
            path="menu"
            element={<Placeholder title="Quản lý Thực đơn" />}
          />
          <Route
            path="bookings"
            element={<Placeholder title="Quản lý Đặt bàn" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
