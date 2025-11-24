import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    // 💡 QUAN TRỌNG: Truyền state { mode: 'register' } để trang AuthPage biết cần mở tab nào
    navigate('/login', { state: { mode: 'register' } });
  };

  return (
    <footer className="bg-gray-800 text-white py-12 px-20">
      <div className="grid grid-cols-4 gap-12 border-b border-gray-700 pb-8 mb-8">
        {/* Cột 1: Logo */}
        <div>
          <img
            src="/logotachnen.png"
            alt="Beef Bistro Logo"
            className="w-32 mb-4"
          />
          <p className="text-sm text-gray-400">
            Chuyên các món bò cao cấp và không gian ẩm thực sang trọng.
          </p>
        </div>

        {/* Cột 2: Liên kết */}
        <div>
          <h4 className="text-lg font-bold mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-yellow-500 transition">Thông tin nhà hàng</Link></li>
            <li><Link to="/menu" className="hover:text-yellow-500 transition">Thực đơn</Link></li>
            <li><Link to="/promo" className="hover:text-yellow-500 transition">Khuyến mãi</Link></li>
            <li><Link to="/booking" className="hover:text-yellow-500 transition">Đặt bàn</Link></li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h4 className="text-lg font-bold mb-4">Liên Hệ</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center"><Phone className="w-5 h-5 mr-2 text-yellow-500" /> (028) 123 4567</li>
            <li className="flex items-center"><Mail className="w-5 h-5 mr-2 text-yellow-500" /> beefbistro@gmail.com</li>
            <li>Giờ mở cửa: 10:00 - 22:00</li>
            <li>180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký */}
        <div>
          <h4 className="text-lg font-bold mb-4">Đăng ký thành viên</h4>
          <p className="text-sm text-gray-400 mb-4">
            Trở thành thành viên để nhận ưu đãi đặc biệt và tích điểm.
          </p>
          <form onSubmit={handleRegisterClick}>
            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 rounded-lg font-bold text-white hover:bg-yellow-600 transition shadow-lg transform hover:-translate-y-1"
            >
              Đăng Ký Ngay
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} BEEF BISTRO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;