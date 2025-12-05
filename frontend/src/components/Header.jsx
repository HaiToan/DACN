// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { LogOut, UserCircle, Edit, KeyRound, ReceiptText, ShoppingCart, XCircle, Calendar } from 'lucide-react'; // Import các icon

const Header = () => {
  const { getTotalItems, getCartTotal, cartItems, removeItem } = useCart();
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false); // State for mini-cart visibility
  const hoverTimeout = useRef(null); // Ref to store the timeout ID

  // --- 1. TRẠNG THÁI & HOOKS ---
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuCategories, setMenuCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Trạng thái xác thực
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoten, setHoten] = useState('');

  // Kiểm tra trạng thái xác thực khi component được mount và cập nhật
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedHoten = localStorage.getItem('hoten');
    const storedUsername = localStorage.getItem('username');
    
    if (token && (storedHoten || storedUsername)) {
      setIsLoggedIn(true);
      setHoten(storedHoten || storedUsername); // Sử dụng họ tên, dự phòng là tên người dùng
    } else {
      setIsLoggedIn(false);
      setHoten('');
    }
    
    // Cleanup timeout on component unmount
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);


  // --- 2. LOGIC API & CUỘN TRANG ---
  useEffect(() => {
    // Lấy danh mục từ API
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/menu/categories');
        if (!response.ok) throw new Error('Phản hồi mạng không thành công');
        const data = await response.json();
        const formattedCategories = data.map(cat => ({
          name: cat.tenloai.toUpperCase(),
          link: `/menu?category=${cat.maloai}`
        }));
        setMenuCategories(formattedCategories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        setMenuCategories([]); 
      }
    };

    fetchCategories();

    // Logic ẩn/hiện header khi scroll
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

  // --- 3. LOGIC TÌM KIẾM TRỰC TIẾP ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/menu/search?q=${searchTerm}`);
        if (!response.ok) throw new Error('Yêu cầu tìm kiếm thất bại');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Lỗi khi tải kết quả tìm kiếm:", error);
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('hoten'); // Đồng thời xóa họ tên
    setIsLoggedIn(false);
    setHoten('');
    navigate('/', { replace: true });
  };

  const handleGoToCart = () => {
    navigate('/cart');
    setIsMiniCartOpen(false); // Close mini-cart when navigating
  };

  const handleBooking = () => {
    const token = localStorage.getItem('token');

    if (token) {
      // Nếu đã đăng nhập, chuyển thẳng đến trang đặt bàn
      // Có thể thêm kiểm tra userRole nếu cần, ví dụ: if (userRole === 'customer')
      navigate('/booking');
    } else {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      // và gửi thông tin trang đích để chuyển hướng sau khi đăng nhập thành công
      navigate('/auth', { state: { from: '/booking' } });
    }
  };

  // --- CÁC LỚP CSS ---
  const baseClasses = "w-full flex items-center justify-between px-20 py-4 fixed top-0 left-0 z-50 transition-transform duration-300 transition-colors";
  const visibilityClasses = headerVisible ? "translate-y-0" : "-translate-y-full";
  const backgroundClasses = "bg-white shadow-md";
  const menuLinkClasses = "text-gray-800 font-semibold hover:text-yellow-400 transition cursor-pointer text-xl";
  const iconLinkClasses = "w-8 h-8 text-gray-800 hover:text-yellow-400 transition cursor-pointer";

  const userAuthSection = isLoggedIn ? (
    <>
      {/* Icon Lịch sử Mua hàng */}
      <Link to="/order-history" aria-label="Lịch sử mua hàng" title="Lịch sử mua hàng">
        <ReceiptText className={iconLinkClasses} />
      </Link>
      {/* Icon Lịch sử Đặt bàn */}
      <Link to="/booking-history" aria-label="Lịch sử đặt bàn" title="Lịch sử đặt bàn">
        <Calendar className={iconLinkClasses} />
      </Link>
      
      <div className="relative group">
        <button className="flex items-center space-x-2">
          <UserCircle className={iconLinkClasses} />
        </button>
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-800">Chào, {hoten}</p>
          </div>
          <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Edit className="w-4 h-4 mr-2" /> Thông tin cá nhân
          </Link>
          <Link to="/change-password" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu
          </Link>
          <div className="border-t border-gray-200 my-1"></div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
          </button>
        </div>
      </div>
    </>
  ) : (
    <Link to="/auth">
      <svg className={iconLinkClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
      </svg>
    </Link>
  );

  return (
    <header id="main-header" className={`${baseClasses} ${backgroundClasses} ${visibilityClasses}`}>
      
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Trang chủ">
          <img src="/logotachnen.png" alt="Logo Beef Bistro" className="w-40 object-contain" />
        </Link>
      </div>
      
      {/* MENU ĐIỀU HƯỚNG */}
      <nav className="flex gap-8 items-center h-full">
        <Link to="/" className={menuLinkClasses}>Trang chủ</Link>
        <Link to="/about" className={menuLinkClasses}>Thông tin</Link>
        
        {/* MENU DROPDOWN */}
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
              <Link 
                key={idx} 
                to={cat.link} 
                className="block px-4 py-2 text-base text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition rounded font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu after clicking category
              >
                <span className="mr-2 text-yellow-500">•</span>{cat.name}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/promo" className={menuLinkClasses}>Khuyến mãi</Link>
        <Link to="/contact" className={menuLinkClasses}>Liên hệ</Link>
      </nav>

      {/* KHU VỰC ICON */}
      <div className="flex items-center gap-6">
        
        {/* TÌM KIẾM TRỰC TIẾP */}
        <div className="relative group">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 z-20">
            <svg className="w-5 h-5 text-stone-400 group-hover:text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <input
            type="text"
            placeholder="Tìm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="relative h-10 text-sm bg-stone-100 border border-transparent rounded-full pl-10 pr-4 outline-none 
                       w-10 opacity-50 focus:w-80 focus:opacity-100 group-hover:w-80 group-hover:opacity-100 
                       focus:bg-white focus:border-yellow-500 transition-all duration-300 ease-in-out shadow-sm"
          />
          {isSearchFocused && searchTerm.length > 0 && (
            <div className="absolute top-full mt-2 w-96 max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-3 z-50 border border-stone-200">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-800 px-2">Kết quả gợi ý</h4>
                  {searchResults.map(item => (
                    <Link 
                      key={item.mamon} 
                      to={`/menu?highlight=${item.mamon}`}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-yellow-50 transition"
                      onClick={() => { setSearchTerm(''); setSearchResults([]); setIsSearchFocused(false); }}
                    >
                      <img src={item.hinhanh || '/placeholder.jpg'} alt={item.tenmon} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-stone-900">{item.tenmon}</p>
                        <p className="text-sm text-yellow-700 font-bold">{formatCurrency(item.gia)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-center py-6">Không tìm thấy món ăn nào khớp.</p>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon with Mini-Cart Dropdown */}
        <div 
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
              setIsMiniCartOpen(true);
            }}
            onMouseLeave={() => {
              hoverTimeout.current = setTimeout(() => {
                setIsMiniCartOpen(false);
              }, 200); // Small delay before closing
            }}
        >
            <Link to="/cart" className="relative">
                <ShoppingCart className={iconLinkClasses} />
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {getTotalItems()}
                </span>
            </Link>

            {isMiniCartOpen && (
                <div 
                    className="absolute right-0 mt-3 w-80 bg-white rounded-md shadow-lg py-3 z-50 border border-stone-200"
                    onMouseEnter={() => {
                      if (hoverTimeout.current) clearTimeout(hoverTimeout.current); // Keep open if mouse re-enters dropdown
                    }}
                >
                    <div className="px-4 pb-2 border-b border-gray-200">
                        <h4 className="font-bold text-lg text-gray-800">Giỏ hàng của bạn ({getTotalItems()})</h4>
                    </div>
                    {cartItems.length > 0 ? (
                        <>
                            <div className="max-h-60 overflow-y-auto mt-2">
                                {cartItems.map(item => (
                                    <div key={item.mamon} className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src={item.hinhanh || '/placeholder.jpg'} alt={item.tenmon} className="w-12 h-12 object-cover rounded-md" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{item.tenmon}</p>
                                                <p className="text-xs text-gray-600">{item.soluong} x {formatCurrency(item.gia)}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); removeItem(item.mamon); }}
                                            className="text-red-500 hover:text-red-700"
                                            title="Xóa khỏi giỏ"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-2 pt-2 px-4 flex justify-between items-center">
                                <span className="font-bold text-md text-gray-800">Tổng cộng:</span>
                                <span className="font-bold text-md text-yellow-600">{formatCurrency(getCartTotal())}</span>
                            </div>
                            <div className="px-4 pt-3">
                                <button
                                    onClick={handleGoToCart}
                                    className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition font-semibold"
                                >
                                    Xem giỏ hàng & Thanh toán
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="px-4 py-4 text-center text-gray-500">Giỏ hàng trống.</p>
                    )}
                </div>
            )}
        </div>
        
        {/* Nút Đặt Bàn */}
        <button
          onClick={handleBooking}
          className="bg-yellow-500 text-white font-semibold py-2 px-5 rounded-full hover:bg-yellow-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg text-lg"
        >
          Đặt bàn
        </button>

        {/* ICON NGƯỜI DÙNG ĐỘNG */}
        {userAuthSection}
        </div>
    </header>
  );
}

export default Header;