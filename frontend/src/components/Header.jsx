// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Thêm useNavigate

const Header = () => {
  // --- 1. STATE & HOOKS ---
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 State lưu từ khóa tìm kiếm
  
  const navigate = useNavigate(); // Hook để chuyển trang

  // --- 2. LOGIC ẨN/HIỆN HEADER (Giữ nguyên) ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- 3. LOGIC TÌM KIẾM (Mới) ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển hướng đến trang thực đơn với query tìm kiếm
      // Ví dụ: /menu?search=thit-bo
      navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Xóa ô tìm kiếm sau khi enter (tuỳ chọn)
    }
  };

  // --- DATA & CLASSES (Giữ nguyên) ---
  const menuCategories = [
    { name: "KHAI VỊ", link: "/menu/khai-vi" },
    { name: "SALAD", link: "/menu/salad" },
    { name: "SÚP", link: "/menu/sup" },
    { name: "HẢI SẢN CÁC LOẠI", link: "/menu/hai-san" },
    { name: "THỊT BÒ", link: "/menu/thit-bo" },
    { name: "THỊT HEO", link: "/menu/thit-heo" },
    { name: "MÌ SPAGHETTI", link: "/menu/spaghetti" },
    { name: "PIZZA", link: "/menu/pizza" },
    { name: "TRÁNG MIỆNG", link: "/menu/trang-mieng" },
    { name: "ĐỒ UỐNG", link: "/menu/do-uong" },
  ];

  const baseClasses = "w-full flex items-center justify-between px-20 py-4 fixed top-0 left-0 z-50 transition-transform duration-300 transition-colors";
  const visibilityClasses = headerVisible ? "translate-y-0" : "-translate-y-full";
  const backgroundClasses = "bg-white shadow-md";
  const menuLinkClasses = "text-gray-800 font-semibold hover:text-yellow-400 transition cursor-pointer text-xl";
  const iconLinkClasses = "w-8 h-8 text-gray-800 hover:text-yellow-400 transition cursor-pointer";

  return (
    <header id="main-header" className={`${baseClasses} ${backgroundClasses} ${visibilityClasses}`}>
      
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Trang chủ">
          <img src="/logotachnen.png" alt="Logo" className="w-40 object-contain" />
        </Link>
      </div>
      
      {/* NAV MENU */}
      <nav className="flex gap-8 items-center h-full">
        <Link to="/" className={menuLinkClasses}>Trang chủ</Link>
        <Link to="/about" className={menuLinkClasses}>Thông tin</Link>
        
        {/* DROPDOWN MENU */}
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer py-4">
            <Link to="/menu" className={menuLinkClasses}>Thực đơn</Link>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 text-gray-800 transition-transform duration-200 mt-1 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          <div className={`absolute top-full -left-10 bg-white shadow-xl rounded-lg p-5 transform transition-all duration-200 origin-top border-t-4 border-yellow-400 w-[600px] grid grid-cols-2 gap-x-8 gap-y-2 ${isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
            {menuCategories.map((cat, idx) => (
              <Link key={idx} to={cat.link} className="block px-4 py-2 text-base text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition rounded font-medium">
                <span className="mr-2 text-yellow-500">•</span>{cat.name}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/promo" className={menuLinkClasses}>Khuyến mãi</Link>
        <Link to="/contact" className={menuLinkClasses}>Liên hệ</Link>
      </nav>

      {/* ICONS AREA */}
      <div className="flex items-center gap-6">
        
        {/* === 🔍 TÌM KIẾM: PHIÊN BẢN CẢI TIẾN (TRƯỢT SANG TRÁI) === */}
        <div className="relative group flex items-center justify-end">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            
            {/* 1. Ô Input (Dùng Absolute để không đẩy layout) */}
            <input
              type="text"
              placeholder="Tìm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                absolute right-10 top-1/2 -translate-y-1/2
                h-10 text-sm bg-white border border-yellow-500 rounded-full px-4 outline-none
                /* Ẩn hiện */
                w-0 opacity-0 p-0
                /* Hiệu ứng khi hover vào group hoặc focus vào input */
                group-hover:w-64 group-hover:opacity-100 group-hover:p-2
                focus:w-64 focus:opacity-100 focus:p-2
                transition-all duration-500 ease-in-out shadow-sm
              "
            />

            {/* 2. Nút Icon Search (Luôn hiển thị) */}
            <button
              type="submit"
              className="
                relative z-10 w-10 h-10 flex items-center justify-center 
                bg-white rounded-full hover:bg-gray-100 transition
                /* Nếu input đang mở thì icon có màu vàng */
                group-hover:text-yellow-500
              "
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
        {/* === KẾT THÚC TÌM KIẾM === */}

        <Link to="/cart" className="relative">
          <svg className={iconLinkClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">0</span>
        </Link>
        
        <Link to="/login">
          <svg className={iconLinkClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
          </svg>
        </Link>
        
        <Link to="/booking" className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold text-lg shadow">
          Đặt bàn
        </Link>
      </div>
    </header>
  );
};

export default Header;