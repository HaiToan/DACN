// pages/AuthPage.jsx

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, Mail, ChevronLeft, Eye, EyeOff } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

const AuthPage = () => {
    // 💡 HOOKS: Lấy thông tin URL và điều hướng
    const navigate = useNavigate();
    const location = useLocation();

    // 💡 CẬP NHẬT LOGIC STATE:
    // Kiểm tra xem có state { mode: 'register' } được gửi tới không.
    // Nếu có (từ Footer), mặc định là 'register'. Nếu không, mặc định là 'login'.
    const [mode, setMode] = useState(location.state?.mode || 'login'); 
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

    // Lấy đường dẫn chuyển hướng mong muốn (nếu có)
    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'login') {
            console.log("Đang xử lý Đăng nhập...");
            // --- LOGIC API ĐĂNG NHẬP ---
            
            console.log("Đăng nhập thành công! Chuyển hướng...");
            navigate(redirectPath, { replace: true });

        } else {
            console.log("Đang xử lý Đăng ký...");
            // --- LOGIC API ĐĂNG KÝ ---

            console.log("Đăng ký thành công! Chuyển sang Đăng nhập.");
            setMode('login'); 
        }
    };

    const isLogin = mode === 'login';

    return (
        <>
            <Header />

            {/* Tôi đã sửa pt-50 (không chuẩn Tailwind) thành pt-48 để khung thấp xuống hợp lý */}
            <main className="min-h-screen pt-48 pb-16 bg-gray-100 flex items-start justify-center">
                
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transform transition duration-300 hover:shadow-3xl">
                    
                    {/* Thanh Tab chuyển đổi Đăng nhập / Đăng ký */}
                    <div className="flex mb-8 border-b border-gray-200">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                                isLogin
                                    ? 'border-b-4 border-yellow-500 text-yellow-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            ĐĂNG NHẬP
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                                !isLogin
                                    ? 'border-b-4 border-yellow-500 text-yellow-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            ĐĂNG KÝ TÀI KHOẢN
                        </button>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        {isLogin ? "Chào mừng trở lại!" : "Tạo Tài Khoản Mới"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Trường Đăng ký: Tên khách hàng */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                    <User className="w-4 h-4 mr-2 text-yellow-500" /> Họ tên
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>
                        )}

                        {/* Trường Email */}
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                <Mail className="w-4 h-4 mr-2 text-yellow-500" /> Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                required
                            />
                        </div>

                        {/* Trường Mật khẩu */}
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                <Lock className="w-4 h-4 mr-2 text-yellow-500" /> Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 pr-10" 
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-600 transition"
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Trường Đăng ký: Xác nhận mật khẩu */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                    <Lock className="w-4 h-4 mr-2 text-yellow-500" /> Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-600 transition"
                                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quên mật khẩu & Ghi nhớ (Chỉ cho Đăng nhập) */}
                        {isLogin && (
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                                        Ghi nhớ
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="font-medium text-yellow-600 hover:text-yellow-500 transition">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-yellow-500 text-white text-xl font-bold rounded-lg hover:bg-yellow-600 transition shadow-lg mt-8"
                        >
                            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
                        </button>
                        
                        {/* Liên kết Đã có tài khoản */}
                        {!isLogin && (
                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-600">
                                    Đã có tài khoản?{" "}
                                    <button 
                                        type="button" 
                                        onClick={() => setMode('login')}
                                        className="font-semibold text-yellow-600 hover:text-yellow-700 transition underline"
                                    >
                                        Đăng nhập ngay
                                    </button>
                                </p>
                            </div>
                        )}
                        
                    </form>

                    {/* Liên kết Quay về Trang chủ */}
                    <div className="mt-8 text-center pt-4 border-t border-gray-100">
                        <Link
                            to="/"
                            className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition font-medium"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1"/> Quay về Trang chủ
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default AuthPage;