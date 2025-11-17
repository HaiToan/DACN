import React from 'react';

const LoginRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-700">Đăng nhập / Đăng ký</h2>
        {/* Form đăng nhập/đăng ký sẽ đặt ở đây */}
        <form className="space-y-4">
          <input type="text" placeholder="Email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="password" placeholder="Mật khẩu" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <button type="submit" className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Đăng nhập</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          <span>Chưa có tài khoản? <a href="#" className="text-yellow-600 hover:underline">Đăng ký</a></span>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
