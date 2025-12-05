// pages/AuthPage.jsx

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, Mail, ChevronLeft, Eye, EyeOff } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentForm, setCurrentForm] = useState(
    location.state?.mode || "login"
  );

  // Refactored state for form inputs
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    email: "",
    matkhau: "",
    confirmPassword: "",
    hoten: "",
    sodienthoai: "",
    diachi: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // State for API feedback
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const redirectPath = location.state?.from || '/';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (currentForm === "login") {
      // Explicit validation for empty fields
      if (!formData.usernameOrEmail || !formData.matkhau) {
        setDialogTitle("Lỗi!");
        setDialogMessage("Vui lòng cung cấp tên đăng nhập và mật khẩu.");
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }

      // Client-side validation for usernameOrEmail
      if (formData.usernameOrEmail.includes("@")) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.usernameOrEmail)) {
          setDialogTitle("Lỗi!");
          setDialogMessage("Email không hợp lệ.");
          setIsSuccess(false);
          setShowDialog(true);
          setLoading(false);
          return;
        }
      } else {
        if (formData.usernameOrEmail.length < 3) {
          setDialogTitle("Lỗi!");
          setDialogMessage("Tên đăng nhập phải có ít nhất 3 ký tự.");
          setIsSuccess(false);
          setShowDialog(true);
          setLoading(false);
          return;
        }
      }
      try {
        console.log("Sending login data:", {
          usernameOrEmail: formData.usernameOrEmail,
          matkhau: formData.matkhau,
        });
        const response = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernameOrEmail: formData.usernameOrEmail,
            matkhau: formData.matkhau,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Đăng nhập thất bại.");
        }

        // Store token and role in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("hoten", data.hoten);
        localStorage.setItem("maTK", data.maTK);

        // Redirect based on role
        if (data.role === "Admin") {
          navigate("/admin/menu", { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      } catch (err) {
        setDialogTitle("Lỗi!");
        setDialogMessage(err.message);
        setIsSuccess(false);
        setShowDialog(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Registration mode
      if (formData.matkhau !== formData.confirmPassword) {
        setDialogTitle("Lỗi!");
        setDialogMessage("Mật khẩu xác nhận không khớp.");
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }

      if (formData.usernameOrEmail.length < 3) {
        setDialogTitle("Lỗi!");
        setDialogMessage("Tên đăng nhập phải có ít nhất 3 ký tự.");
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setDialogTitle("Lỗi!");
        setDialogMessage("Email không hợp lệ.");
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }

      const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!isStrongPassword.test(formData.matkhau)) {
        setDialogTitle("Lỗi!");
        setDialogMessage(
          "Mật khẩu phải dài ít nhất 8 ký tự, chứa ít nhất một chữ cái và một số."
        );
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }

      if (formData.sodienthoai && !/^\d{10,11}$/.test(formData.sodienthoai)) {
        setDialogTitle("Lỗi!");
        setDialogMessage(
          "Số điện thoại không hợp lệ (phải là 10 hoặc 11 chữ số)."
        );
        setIsSuccess(false);
        setShowDialog(true);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:3001/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tendangnhap: formData.usernameOrEmail,
              email: formData.email,
              matkhau: formData.matkhau,
              hoten: formData.hoten,
              sodienthoai: formData.sodienthoai,
              diachi: formData.diachi,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Đăng ký thất bại.");
        }

        // Store token and role in localStorage for immediate login
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("hoten", data.hoten);
        localStorage.setItem("maTK", data.maTK);

        // Redirect based on role (similar to login)
        if (data.role === "Admin") {
          navigate("/admin/menu", { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }

        // Clear form fields
        setFormData({
          usernameOrEmail: "",
          email: "",
          matkhau: "",
          confirmPassword: "",
          hoten: "",
          sodienthoai: "",
          diachi: "",
        });
        setDialogTitle("Thành công!");
        setDialogMessage(
          "Đăng ký tài khoản thành công! Bạn sẽ được chuyển hướng ngay."
        );
      } catch (err) {
        setDialogTitle("Lỗi!");
        setDialogMessage(err.message);
        setIsSuccess(false);
        setShowDialog(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Simulate API call for forgot password
      const response = await fetch(
        "http://localhost:3001/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gửi yêu cầu đặt lại mật khẩu thất bại."
        );
      }

      setDialogTitle("Thành công!");
      setDialogMessage(
        "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến."
      );
      setIsSuccess(true);
      setShowDialog(true);
      setForgotPasswordEmail(""); // Clear email field
    } catch (err) {
      setDialogTitle("Lỗi!");
      setDialogMessage(err.message);
      setIsSuccess(false);
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = currentForm === "login";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-48 pb-16 bg-gray-100 flex items-start justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => {
                setCurrentForm("login");
                setError("");
              }}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                isLogin
                  ? "border-b-4 border-yellow-500 text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ĐĂNG NHẬP
            </button>
            <button
              onClick={() => {
                setCurrentForm("register");
                setError("");
              }}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                !isLogin
                  ? "border-b-4 border-yellow-500 text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ĐĂNG KÝ TÀI KHOẢN
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin
              ? "Chào mừng trở lại!"
              : currentForm === "register"
              ? "Tạo Tài Khoản Mới"
              : "Quên Mật khẩu?"}
          </h1>

          {currentForm === "forgotPassword" ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="forgotPasswordEmail"
                  className="text-sm font-medium text-gray-700 flex items-center mb-1"
                >
                  <Mail className="w-4 h-4 mr-2 text-yellow-500" /> Email
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {!showDialog && error && (
                <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 text-white text-xl font-bold rounded-lg hover:bg-yellow-600 transition shadow-lg mt-8 disabled:bg-yellow-300"
              >
                {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentForm("login");
                    setError("");
                  }}
                  className="text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  Quay lại Đăng nhập
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="text-sm font-medium text-gray-700 flex items-center mb-1"
                >
                  <User className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                  {isLogin ? "Tên đăng nhập hoặc Email" : "Tên đăng nhập"}
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              {/* Email Field (Only for Registration) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center mb-1"
                  >
                    <Mail className="w-4 h-4 mr-2 text-yellow-500" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
              )}
              {/* Full Name Field (Only for Registration) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="hoten"
                    className="text-sm font-medium text-gray-700 flex items-center mb-1"
                  >
                    <User className="w-4 h-4 mr-2 text-yellow-500" /> Họ và tên
                  </label>
                  <input
                    type="text"
                    id="hoten"
                    value={formData.hoten}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
              )}
              {/* Phone Number Field (Only for Registration) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="sodienthoai"
                    className="text-sm font-medium text-gray-700 flex items-center mb-1"
                  >
                    <User className="w-4 h-4 mr-2 text-yellow-500" /> Số điện
                    thoại
                  </label>
                  <input
                    type="tel"
                    id="sodienthoai"
                    value={formData.sodienthoai}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              )}
              {/* Address Field (Only for Registration) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="diachi"
                    className="text-sm font-medium text-gray-700 flex items-center mb-1"
                  >
                    <User className="w-4 h-4 mr-2 text-yellow-500" /> Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="diachi"
                    value={formData.diachi}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              )}
              {/* Password Field */}
              <div>
                <label
                  htmlFor="matkhau"
                  className="text-sm font-medium text-gray-700 flex items-center mb-1"
                >
                  <Lock className="w-4 h-4 mr-2 text-yellow-500" /> Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="matkhau"
                    value={formData.matkhau}
                    onChange={(e) =>
                      setFormData({ ...formData, matkhau: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentForm("forgotPassword");
                        setError("");
                      }}
                      className="absolute bottom-0 right-0 p-2 text-xs text-yellow-600 hover:text-yellow-700 font-semibold"
                      style={{ transform: "translateY(100%)" }} // To push it slightly below the input field
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>{" "}
                {/* Closes the relative div */}
              </div>{" "}
              {/* Closes the outer password field div */}{" "}
              {/* Confirm Password Field (Only for Registration) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 flex items-center mb-1"
                  >
                    <Lock className="w-4 h-4 mr-2 text-yellow-500" /> Xác nhận
                    mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-600 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {!isLogin && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentForm("login");
                      setError("");
                    }}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              )}
              {/* Error Message Display (only if no dialog is open) */}
              {!showDialog && error && (
                <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 text-white text-xl font-bold rounded-lg hover:bg-yellow-600 transition shadow-lg mt-8 disabled:bg-yellow-300"
              >
                {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center pt-4 border-t border-gray-100">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Quay về Trang chủ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={isSuccess ? "border-green-500" : "border-red-500"}
        >
          <DialogHeader>
            <DialogTitle
              className={isSuccess ? "text-green-600" : "text-red-600"}
            >
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setShowDialog(false);
                if (isSuccess) {
                  setCurrentForm("login"); // Switch to login mode after successful registration
                }
              }}
              className={`${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white font-semibold py-2 px-4 rounded-lg`}
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthPage;
