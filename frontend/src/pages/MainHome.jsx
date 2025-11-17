import React from 'react';
import { Link } from 'react-router-dom';

const MainHome = () => {
  return (
    <>
      <header id="main-header" className="w-full bg-transparent flex items-center justify-between px-20 py-4 fixed top-0 left-0 z-10 transition-colors duration-300">
        {/* Logo bên trái */}
        <div className="flex items-center gap-3">
          <img src="/logotachnen.png" alt="Beef Bistro Logo" className="w-40 object-contain" />
        </div>
        {/* Menu */}
        <nav className="flex gap-8 text-xl">
          <Link to="/" className="text-white font-semibold hover:text-yellow-400 transition">Trang chủ</Link>
          <Link to="/about" className="text-white font-semibold hover:text-yellow-400 transition">Thông tin nhà hàng</Link>
          <Link to="/menu" className="text-white font-semibold hover:text-yellow-400 transition">Thực đơn</Link>
          <Link to="/promo" className="text-white font-semibold hover:text-yellow-400 transition">Khuyến mãi</Link>
          <Link to="/contact" className="text-white font-semibold hover:text-yellow-400 transition">Liên hệ</Link>
        </nav>
        {/* Tìm kiếm, giỏ hàng, đăng nhập/đăng ký, đặt bàn dạng icon */}
        <div className="flex items-center gap-6">
          <Link to="/menu" aria-label="Tìm kiếm">
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </Link>
          <Link to="/cart" aria-label="Giỏ hàng" className="relative">
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">0</span>
          </Link>
          <Link to="/login" aria-label="Đăng nhập">
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </Link>
          <Link to="/booking" className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold text-lg shadow">Đặt bàn</Link>
        </div>
      </header>
      {/* Script đổi màu header khi cuộn */}
      <script dangerouslySetInnerHTML={{__html:`
        window.addEventListener('scroll', function() {
          const header = document.getElementById('main-header');
          if(window.scrollY > 10) {
            header.classList.add('bg-white');
          } else {
            header.classList.remove('bg-white');
          }
        });
      `}} />
      {/* Body kiểu LAN Perfume */}
      <div className="relative min-h-screen flex flex-col justify-center">
        {/* Background hình ảnh lớn */}
        <img src="/lobby1.jpg" alt="Beef Bistro" className="absolute inset-0 w-full h-full object-cover z-0" />
        {/* Overlay mờ bên trái */}
        <div className="relative z-10 flex flex-col justify-center max-w-2xl ">
          <div className="bg-white/30 backdrop-blur-md  p-10">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">BEEF BISTRO</h1>
            <p className="text-lg text-white mb-8 drop-shadow">Nhà hàng bò đặc biệt - Đẳng cấp ẩm thực, không gian sang trọng, phục vụ tận tâm.</p>
            <div className="flex gap-4">
              <Link to="/booking" className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold shadow">Đặt bàn ngay</Link>
              <Link to="/menu" className="px-6 py-3 border border-white text-white rounded hover:bg-white hover:text-orange-600 transition font-semibold shadow">Xem thực đơn</Link>
            </div>
          </div>
        </div>
        {/* Thông tin nổi bật phía dưới */}
        <div className="absolute bg-black bottom-0 left-0 w-full flex flex-wrap justify-center gap-8 pb-8 z-10">
          <div className="text-white text-sm font-semibold">Thanh toán tiện lợi</div>0
          <div className="text-white text-sm font-semibold">Giao hàng nhanh</div>
          <div className="text-white text-sm font-semibold">Đảm bảo chất lượng</div>
          <div className="text-white text-sm font-semibold">Hỗ trợ nhanh chóng</div>
        </div>
      </div>
    </>
  );
};

export default MainHome;
