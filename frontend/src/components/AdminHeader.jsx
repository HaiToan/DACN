// frontend/src/components/AdminHeader.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, KeyRound, UserCircle } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const userRole = localStorage.getItem("userRole"); // Get user role

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logotachnen.png"
            alt="Beef Bistro Logo"
            className="h-12 w-auto"
          />
          <span className="text-xl font-bold ml-3 text-yellow-400">
            Admin Dashboard
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {(userRole === "Admin" || userRole === "NhanVien") && (
            <NavLink
              to={userRole === "NhanVien" ? "/employee/bookings" : "/admin/bookings"}
              className={({ isActive }) =>
                `text-lg font-medium transition hover:text-yellow-400 ${
                  isActive ? "text-yellow-400" : "text-gray-300"
                }`
              }
            >
              Đặt bàn
            </NavLink>
          )}
          {(userRole === "Admin" || userRole === "NhanVien") && (
            <NavLink
              to={userRole === "NhanVien" ? "/employee/orders" : "/admin/orders"}
              className={({ isActive }) =>
                `text-lg font-medium transition hover:text-yellow-400 ${
                  isActive ? "text-yellow-400" : "text-gray-300"
                }`
              }
            >
              Đơn hàng
            </NavLink>
          )}
          {userRole === "Admin" && (
            <NavLink
              to="/admin/menu"
              className={({ isActive }) =>
                `text-lg font-medium transition hover:text-yellow-400 ${
                  isActive ? "text-yellow-400" : "text-gray-300"
                }`
              }
            >
              Thực đơn
            </NavLink>
          )}
          {userRole === "Admin" && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `text-lg font-medium transition hover:text-yellow-400 ${
                  isActive ? "text-yellow-400" : "text-gray-300"
                }`
              }
            >
              Người dùng
            </NavLink>
          )}
        </nav>

        {/* User Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition">
            <UserCircle className="h-7 w-7 text-yellow-400" />
            <span className="font-semibold">{username}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-95 group-hover:scale-100">
            <button
              onClick={() => navigate("/admin/change-password")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
