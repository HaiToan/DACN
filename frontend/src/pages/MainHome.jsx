import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

// ===============================================
// DỮ LIỆU ĐỘNG (SẼ LẤY TỪ MONGODB QUA API)
// ===============================================

const MainHome = () => {
  // State Header (Giữ nguyên)
  const [headerVisible, setHeaderVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // State cho Dữ liệu Động (Khởi tạo rỗng để tránh lỗi .map())
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [newsAndEvents, setNewsAndEvents] = useState([]);

  // ===============================================
  // LOGIC HOOKS
  // ===============================================

  // 1. Logic Header (Giữ nguyên)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;
      setScrolled(isScrolled);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, scrolled]);

  // 2. Logic Gọi API (Tích hợp chức năng Xem thực đơn, Đánh giá, Tin tức)
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // --- VÍ DỤ TÍCH HỢP API ---
        // Lấy Thực đơn Nổi bật (MON_AN) [cite: 81, 178]
        /* const dishesResponse = await fetch('/api/monan/featured');
        const dishes = await dishesResponse.json();
        setFeaturedDishes(dishes);
        */
        // Lấy Đánh giá (DANH_GIA) [cite: 85, 176]
        /*
        const reviewsResponse = await fetch('/api/danhgia/latest');
        const reviews = await reviewsResponse.json();
        setTestimonials(reviews);
        */
        // Lấy Tin tức/Sự kiện [cite: 86]
        /*
        const newsResponse = await fetch('/api/news');
        const news = await newsResponse.json();
        setNewsAndEvents(news);
        */
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      }
    };

    fetchHomePageData();
  }, []);

  // ===============================================
  // CLASS NAMES (Giữ nguyên)
  // ===============================================

  const baseClasses =
    "w-full flex items-center justify-between px-20 py-4 fixed top-0 left-0 z-50 transition-transform duration-300 transition-colors";
  const visibilityClasses = headerVisible
    ? "translate-y-0"
    : "-translate-y-full";
  const scrollClasses = scrolled ? "bg-white shadow-md" : "bg-transparent";
  const menuLinkClasses = scrolled
    ? "text-gray-800 font-semibold hover:text-yellow-400 transition"
    : "text-white font-semibold hover:text-yellow-400 transition";
  const iconLinkClasses = scrolled
    ? "w-8 h-8 text-gray-800 hover:text-yellow-400 transition"
    : "w-8 h-8 text-white hover:text-yellow-400 transition";

  return (
    <>
      {/* 1. HEADER (Cố định, ẩn/hiện khi cuộn) */}
      <header
        id="main-header"
        className={`${baseClasses} ${scrollClasses} ${visibilityClasses}`}
      >
        <div className="flex items-center gap-3">
          <img
            src="/logotachnen.png"
            alt="Beef Bistro Logo"
            className="w-40 object-contain"
          />
        </div>
        <nav className="flex gap-8 text-xl">
          <Link to="/" className={menuLinkClasses}>
            Trang chủ
          </Link>
          <Link to="/about" className={menuLinkClasses}>
            Thông tin nhà hàng
          </Link>
          <Link to="/menu" className={menuLinkClasses}>
            Thực đơn
          </Link>
          <Link to="/promo" className={menuLinkClasses}>
            Khuyến mãi
          </Link>
          <Link to="/contact" className={menuLinkClasses}>
            Liên hệ
          </Link>
        </nav>
        {/* Nút Đăng nhập/Giỏ hàng liên kết với chức năng Đăng ký/Đăng nhập và Đặt món [cite: 80, 82] */}
        <div className="flex items-center gap-6">
          <Link to="/menu" aria-label="Tìm kiếm">
            <svg
              className={iconLinkClasses}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <Link to="/cart" aria-label="Giỏ hàng" className="relative">
            <svg
              className={iconLinkClasses}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              0
            </span>
          </Link>
          <Link to="/login" aria-label="Đăng nhập">
            <svg
              className={iconLinkClasses}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
            </svg>
          </Link>
          <Link
            to="/booking"
            className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold text-lg shadow"
          >
            Đặt bàn
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <div className="relative h-screen flex flex-col">
        {/* ... (Nội dung Hero Section giữ nguyên) ... */}
        <img
          src="/lobby.jpg"
          alt="Beef Bistro"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 flex flex-grow w-full">
          <div className="w-1/3 bg-white/15 backdrop-blur-sm h-full flex flex-col justify-between">
            <div className="flex flex-col justify-center px-12 pt-28 pb-10 flex-grow">
              <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
                BEEF BISTRO
              </h1>
              <p className="text-lg text-white mb-10 drop-shadow leading-relaxed">
                Nhà hàng bò đặc biệt - Đẳng cấp ẩm thực, không gian sang trọng,
                phục vụ tận tâm. Chúng tôi cam kết mang đến trải nghiệm ẩm thực
                hoàn hảo nhất.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/booking"
                  className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold shadow"
                >
                  Đặt bàn ngay
                </Link>
                <Link
                  to="/menu"
                  className="px-6 py-3 border border-white text-white rounded hover:bg-white hover:text-orange-600 transition font-semibold shadow"
                >
                  Xem thực đơn
                </Link>
              </div>
            </div>
          </div>
          <div className="w-2/3"></div>
        </div>

        <div className="bg-black w-full flex justify-between gap-4 py-6 px-20 relative z-10">
          <div className="text-white text-sm font-semibold whitespace-nowrap">
            HỖ TRỢ NHANH CHÓNG
          </div>
          <div className="text-white text-sm font-semibold whitespace-nowrap">
            THANH TOÁN TIỆN LỢI
          </div>
          <div className="text-white text-sm font-semibold whitespace-nowrap">
            GIAO HÀNG NHANH
          </div>
          <div className="text-white text-sm font-semibold whitespace-nowrap">
            ĐẢM BẢO CHẤT LƯỢNG
          </div>
        </div>
      </div>

      {/* 3. THÔNG TIN NHÀ HÀNG */}
      <section className="py-20 px-20 bg-gray-50 flex items-center gap-12">
        {/* ... (Nội dung Restaurant Info giữ nguyên) ... */}
        <div className="w-1/2 relative">
          <img
            src="/lobby1.jpg"
            alt="Nội thất sang trọng Beef Bistro"
            className="w-full h-auto object-cover rounded-xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -right-6 bg-yellow-500 p-6 rounded-xl text-white text-center shadow-xl">
            <p className="text-4xl font-extrabold">10+</p>
            <p className="text-sm font-medium">Năm Kinh Nghiệm</p>
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">
            Câu Chuyện Của Chúng Tôi
          </p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Khám Phá Hương Vị <br /> Đẳng Cấp Của Bò Mỹ
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Tại **Beef Bistro**, chúng tôi tin rằng ẩm thực là một nghệ thuật.
            Mỗi miếng bò được lựa chọn kỹ lưỡng, nhập khẩu từ các trang trại tốt
            nhất và chế biến bởi những đầu bếp tài hoa. Chúng tôi không chỉ phục
            vụ một bữa ăn, chúng tôi mang đến một trải nghiệm ấm cúng, sang
            trọng và đầy cảm hứng.
          </p>
          <div className="grid grid-cols-2 gap-y-4 mb-8">
            <p className="flex items-center text-gray-700 font-semibold">
              <svg
                className="w-6 h-6 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Nguyên liệu tươi ngon
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg
                className="w-6 h-6 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Không gian ấm cúng
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg
                className="w-6 h-6 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Đầu bếp chuyên nghiệp
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg
                className="w-6 h-6 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Dịch vụ tận tâm
            </p>
          </div>
          <Link
            to="/about"
            className="inline-block px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-yellow-600 transition font-bold text-lg shadow-lg"
          >
            Tìm hiểu thêm
          </Link>
        </div>
      </section>

      {/* 4. THỰC ĐƠN NỔI BẬT (Sử dụng dữ liệu featuredDishes) */}
      <section className="py-20 px-20 bg-white">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">
            Tuyển Chọn Đặc Biệt
          </p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            Thực Đơn Nổi Bật
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Khám phá những món ăn làm nên tên tuổi của Beef Bistro.
          </p>
        </div>

        {/* Cấu trúc hiển thị lặp qua MẢNG featureDishes */}
        {featuredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {dish.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-yellow-600 text-2xl font-extrabold mb-4">
                    {dish.price}
                  </p>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                    {dish.description}
                  </p>

                  <Link
                    to={`/menu/${dish.id}`}
                    className="flex items-center justify-center w-full py-3 bg-gray-800 text-white rounded hover:bg-yellow-500 transition font-semibold"
                  >
                    Chi tiết món
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Đang tải thực đơn nổi bật...
          </p>
        )}
        {/* Kết thúc cấu trúc hiển thị */}

        <div className="text-center mt-16">
          <Link
            to="/menu"
            className="inline-flex items-center px-10 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-bold text-xl shadow-xl"
          >
            Xem Toàn Bộ Thực Đơn
            <ChevronRight className="w-6 h-6 ml-3" />
          </Link>
        </div>
      </section>

      {/* 5. KHỐI ĐẶT BÀN TRỰC TUYẾN (Liên kết với thực thể DAT_BAN) */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="/dinner-table.jpg"
          alt="Không gian đặt bàn sang trọng"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-20 flex flex-wrap lg:flex-nowrap gap-12 items-center">
          <div className="w-full lg:w-1/2 text-white p-6">
            <p className="text-sm uppercase tracking-widest text-yellow-400 font-bold mb-3">
              Trải Nghiệm Ẩm Thực
            </p>
            <h2 className="text-6xl font-extrabold mb-6 leading-tight">
              Đặt Bàn Ngay <br /> Để Có Vị Trí Tốt Nhất
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Chúng tôi luôn sẵn sàng phục vụ quý khách. Vui lòng điền thông tin
              để đặt bàn nhanh chóng. Quý khách có thể gọi trực tiếp nếu cần hỗ
              trợ gấp.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-lg">
                <Phone className="w-6 h-6 mr-3 text-yellow-500" />
                <span className="font-semibold">Hotline:</span> (028) 123 4567
              </div>
              <div className="flex items-center text-lg">
                <Clock className="w-6 h-6 mr-3 text-yellow-500" />
                <span className="font-semibold">Giờ mở cửa:</span> 10:00 - 22:00
                (Hàng ngày)
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-2xl">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Thông Tin Đặt Chỗ
            </h3>

            <form action="/booking" method="POST" className="space-y-5">
              {/* Trường Ngày và Giờ (Ánh xạ tới NgayGioDatBan) [cite: 171] */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ngày
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giờ
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
                      required
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Số lượng khách (Ánh xạ tới SoNguoi) [cite: 171] */}
              <div>
                <label
                  htmlFor="guests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số lượng khách
                </label>
                <div className="relative">
                  <select
                    id="guests"
                    name="guests"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
                    required
                  >
                    <option value="">Chọn số lượng</option>
                    <option value="1-2">1 - 2 người</option>
                    <option value="3-4">3 - 4 người</option>
                    <option value="5-8">5 - 8 người</option>
                    <option value="9+">9+ người (Vui lòng gọi)</option>
                  </select>
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tên (Ánh xạ tới HoTen của KHACH_HANG) [cite: 165] */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Số điện thoại (Ánh xạ tới SDT của KHACH_HANG) [cite: 165] */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="(+84) 901 234 567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-yellow-500 text-white text-xl font-bold rounded-lg hover:bg-yellow-600 transition shadow-lg mt-4"
              >
                Xác Nhận Đặt Bàn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. ĐÁNH GIÁ KHÁCH HÀNG (Sử dụng dữ liệu testimonials) */}
      <section className="py-20 px-20 bg-gray-50">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">
            Khách Hàng Nói Gì
          </p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            Phản Hồi Từ Thực Khách
          </h2>
        </div>

        {/* Cấu trúc hiển thị lặp qua MẢNG testimonials */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500"
              >
                <div className="flex text-yellow-500 mb-4">
                  {/* Hiển thị số sao (Ánh xạ tới SoSao) [cite: 177] */}
                  {Array(t.rating).fill(
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  )}
                </div>
                <p className="italic text-gray-700 mb-4 h-24 overflow-hidden">
                  "{t.comment}"{" "}
                  {/* Nội dung (Ánh xạ tới NoiDung) [cite: 177] */}
                </p>
                <p className="font-semibold text-gray-800">- {t.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Đang tải đánh giá gần nhất...
          </p>
        )}
        {/* Kết thúc cấu trúc hiển thị */}

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="inline-block text-lg font-semibold text-gray-700 hover:text-yellow-600 transition"
          >
            Xem tất cả đánh giá và gửi phản hồi
          </Link>
        </div>
      </section>

      {/* 7. TIN TỨC & SỰ KIỆN (Mục tiêu: Xem tin tức & sự kiện [cite: 86]) */}
      <section className="py-20 px-20 bg-white">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">
            Khuyến Mãi & Tin Tức
          </p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            Sự Kiện Nổi Bật
          </h2>
        </div>

        {/* Cấu trúc hiển thị lặp qua MẢNG newsAndEvents */}
        {newsAndEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {newsAndEvents.map((item) => (
              <div
                key={item.id}
                className="shadow-xl rounded-xl overflow-hidden transform hover:shadow-2xl transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <span
                    className={`text-xs font-semibold text-white px-3 py-1 rounded-full mb-3 inline-block ${
                      item.type === "KHUYẾN MÃI" ? "bg-red-600" : "bg-blue-600"
                    }`}
                  >
                    {item.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                    {item.description}
                  </p>
                  <Link
                    to={`/promo/${item.id}`}
                    className="text-yellow-600 font-semibold flex items-center hover:text-yellow-700"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Đang tải thông tin khuyến mãi và tin tức...
          </p>
        )}
        {/* Kết thúc cấu trúc hiển thị */}
      </section>

      {/* 8. FOOTER (Liên kết với chức năng: Liên hệ [cite: 87]) */}
      <footer className="bg-gray-800 text-white py-12 px-20">
        <div className="grid grid-cols-4 gap-12 border-b border-gray-700 pb-8 mb-8">
          {/* Cột 1: Logo và Mô tả */}
          <div>
            <img
              src="/logotachnen-white.png"
              alt="Beef Bistro Logo"
              className="w-32 mb-4"
            />
            <p className="text-sm text-gray-400">
              Chuyên các món bò cao cấp và không gian ẩm thực sang trọng.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="text-lg font-bold mb-4">Menu Chính</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-yellow-500 transition">
                  Thông tin nhà hàng
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-yellow-500 transition">
                  Thực đơn
                </Link>
              </li>
              <li>
                <Link to="/promo" className="hover:text-yellow-500 transition">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="hover:text-yellow-500 transition"
                >
                  Đặt bàn
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h4 className="text-lg font-bold mb-4">Liên Hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-yellow-500" /> (028) 123
                4567
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-yellow-500" />{" "}
                contact@beefbistro.vn
              </li>
              <li>Giờ mở cửa: 10:00 - 22:00</li>
              <li>123 Đường Nguyễn Huệ, Quận 1, TPHCM</li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div>
            <h4 className="text-lg font-bold mb-4">Đăng ký nhận tin</h4>
            <p className="text-sm text-gray-400 mb-4">
              Nhận các ưu đãi đặc biệt và tin tức mới nhất từ BEEF BISTRO.
            </p>
            <form>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full p-3 rounded-t-lg text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 rounded-b-lg font-semibold hover:bg-yellow-600 transition"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BEEF BISTRO. All rights reserved.
          Phát triển bởi Văn Khắc Hải Toàn - ĐỒ ÁN CHUYÊN NGÀNH.
        </div>
      </footer>
    </>
  );
};

export default MainHome;
