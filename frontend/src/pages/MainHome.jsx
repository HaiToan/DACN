// pages/MainHome.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  Users,
  Clock,
  Phone,
} from "lucide-react";
// import axios from "axios"; // Tạm tắt API để dùng dữ liệu giả

import Header from "../components/Header";
import Footer from "../components/Footer";

// --- CẤU HÌNH HÌNH ẢNH SLIDESHOW ---
const restaurantSpaces = ["/lobby.jpg", "/lobby2.jpg", "/lobby3.jpg"];

const MainHome = () => {
  // --- 1. DỮ LIỆU GIẢ (MOCK DATA) - THAY CHO API ---
  const featuredDishes = [
    {
      id: 1,
      name: "Bò Wagyu A5 Nướng Đá",
      price: "1.500.000đ",
      category: "Signature",
      image: "/B1.jpg", 
      description: "Thịt bò Wagyu Nhật Bản thượng hạng, nướng trên đá núi lửa giữ nguyên vị ngọt mềm tan.",
    },
    {
      id: 2,
      name: "Sườn Cừu Nướng Thảo Mộc",
      price: "850.000đ",
      category: "Best Seller",
      image: "/cuu_nuong.jpg",
      description: "Sườn cừu Úc tẩm ướp hương thảo mộc, nướng chậm ăn kèm khoai tây nghiền truffle.",
    },
    {
      id: 3,
      name: "Cá Hồi Áp Chảo Sốt Cam",
      price: "650.000đ",
      category: "Mới",
      image: "/ca_hoi_sot_cam.jpg",
      description: "Cá hồi Na Uy tươi ngon áp chảo giòn da, hòa quyện sốt cam chua ngọt tinh tế.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thùy Chi",
      rating: 5,
      comment: "Không gian cực kỳ sang trọng và ấm cúng. Món bò Wagyu thực sự là cực phẩm. Sẽ quay lại!",
    },
    {
      id: 2,
      name: "Trần Minh Tuấn",
      rating: 5,
      comment: "Nhân viên phục vụ rất chuyên nghiệp. Đồ ăn ra nhanh, nóng hổi và trang trí đẹp mắt.",
    },
    {
      id: 3,
      name: "Le Hoang Bao",
      rating: 4,
      comment: "Địa điểm tuyệt vời cho hẹn hò. Rượu vang ở đây rất ngon và đa dạng.",
    },
  ];

  const newsAndEvents = [
    {
      id: 1,
      title: "Ưu Đãi 20% Cho Nhóm 4 Người Trở Lên",
      type: "KHUYẾN MÃI",
      image: "/4nguoi.jpg",
      description: "Giảm ngay 20% trên tổng hóa đơn khi đặt bàn trước cho nhóm từ 4 khách trở lên.",
    },
    {
      id: 2,
      title: "Ra Mắt Menu Mùa Đông",
      type: "SỰ KIỆN",
      image: "/menunoel.jpg",
      description: "Chào đón mùa đông với bộ sưu tập món ăn mới từ nấm Truffle và bí đỏ.",
    },
    {
      id: 3,
      title: "Đêm Nhạc Jazz Cuối Tuần",
      type: "SỰ KIỆN",
      image: "/jazz.jpg",
      description: "Thưởng thức ẩm thực đỉnh cao trong không gian âm nhạc Jazz lãng mạn.",
    },
  ];

  // 2. State cho Slideshow Background
  const [currentSpaceIndex, setCurrentSpaceIndex] = useState(0);

  // --- LOGIC TỰ ĐỘNG CHUYỂN ẢNH (SLIDESHOW) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpaceIndex(
        (prevIndex) => (prevIndex + 1) % restaurantSpaces.length
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. HEADER */}
      <Header />

      {/* 2. HERO SECTION */}
      <div className="relative h-screen flex flex-col">
        <div className="absolute inset-0 w-full h-full z-0">
          {restaurantSpaces.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
        ${index === currentSpaceIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

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
        <div className="w-1/2 relative">
          <div className="relative w-full rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 grid-rows-1 aspect-[3/2]">
            <img
              src="/bowagyua5nuongda.jpg"
              alt="Không gian nhà hàng"
              className="col-start-1 row-start-1 w-full h-full object-cover"
            />
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
            nhất.
          </p>

          <div className="grid grid-cols-2 gap-y-4 mb-8">
            <p className="flex items-center text-gray-700 font-semibold">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
              Nguyên liệu tươi ngon
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
              Không gian sang trọng
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
              Đầu bếp chuyên nghiệp
            </p>
            <p className="flex items-center text-gray-700 font-semibold">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
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

      {/* 4. THỰC ĐƠN NỔI BẬT */}
      <section className="py-20 px-20 bg-white overflow-visible z-20 relative"> 
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">
            Tuyển Chọn Đặc Biệt
          </p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            Thực Đơn Nổi Bật
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            Khám phá những món ăn làm nên tên tuổi của Beef Bistro.
          </p>
        </div>

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
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden line-clamp-2">
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

      {/* 5. KHỐI ĐẶT BÀN */}
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
              để đặt bàn nhanh chóng.
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
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                  <div className="relative">
                    <input type="date" name="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none" required />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
                  <div className="relative">
                    <input type="time" name="time" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none" required />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách</label>
                <div className="relative">
                  <select name="guests" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none" required>
                    <option value="">Chọn số lượng</option>
                    <option value="1-2">1 - 2 người</option>
                    <option value="3-4">3 - 4 người</option>
                    <option value="5-8">5 - 8 người</option>
                  </select>
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                 <input type="text" name="name" placeholder="Nguyễn Văn A" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                 <input type="tel" name="phone" placeholder="(+84) 901 234 567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required />
              </div>
              <button type="submit" className="w-full py-4 bg-yellow-500 text-white text-xl font-bold rounded-lg hover:bg-yellow-600 transition shadow-lg mt-4">
                Xác Nhận Đặt Bàn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. ĐÁNH GIÁ KHÁCH HÀNG (CẬP NHẬT: Thêm nút Xem chi tiết) */}
      <section className="py-20 px-20 bg-gray-50">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">Khách Hàng Nói Gì</p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Phản Hồi Từ Thực Khách</h2>
        </div>
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              // Thêm 'flex flex-col' để đẩy nội dung xuống
              <div key={t.id} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500 flex flex-col h-full">
                <div className="flex text-yellow-500 mb-4">
                  {Array(t.rating).fill(<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>)}
                </div>
                <p className="italic text-gray-700 mb-4 h-24 overflow-hidden">"{t.comment}"</p>
                <p className="font-semibold text-gray-800 mb-4">- {t.name}</p>
                
                {/* --- MỤC MỚI: XEM CHI TIẾT >> --- */}
                <div className="mt-auto text-right">
                    <Link to="#" className="text-sm font-bold text-yellow-600 hover:text-yellow-700 hover:underline transition">
                        Xem chi tiết &gt;&gt;
                    </Link>
                </div>

              </div>
            ))}
          </div>
        ) : <p className="text-center text-gray-500 italic">Đang tải đánh giá...</p>}
        <div className="text-center mt-12">
          <Link to="/contact" className="inline-block text-lg font-semibold text-gray-700 hover:text-yellow-600 transition">Xem tất cả đánh giá</Link>
        </div>
      </section>

      {/* 7. TIN TỨC & SỰ KIỆN */}
      <section className="py-20 px-20 bg-white">
         <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-yellow-600 font-bold mb-2">Khuyến Mãi & Tin Tức</p>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Sự Kiện Nổi Bật</h2>
        </div>
        {newsAndEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {newsAndEvents.map((item) => (
              <div key={item.id} className="shadow-xl rounded-xl overflow-hidden transform hover:shadow-2xl transition duration-300">
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full mb-3 inline-block ${item.type === "KHUYẾN MÃI" ? "bg-red-600" : "bg-blue-600"}`}>{item.type}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden line-clamp-2">{item.description}</p>
                  <Link to={`/promo/${item.id}`} className="text-yellow-600 font-semibold flex items-center hover:text-yellow-700">Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-center text-gray-500 italic">Đang tải tin tức...</p>}
      </section>

      {/* 8. FOOTER */}
      <Footer />
    </>
  );
};

export default MainHome;