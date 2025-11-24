// pages/Promo.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Clock, Gift } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// DỮ LIỆU KHUYẾN MÃI (Bạn có thể chỉnh sửa dễ dàng tại đây)
const PROMOTIONS = [
  {
    id: 1,
    title: "Happy Hour - Giờ Vàng Cho Nhóm Bạn",
    desc: "Giảm ngay 20% trên tổng hóa đơn khi đặt bàn trước cho nhóm từ 4 khách trở lên.",
    time: "14:00 - 17:30 | Thứ 2 - Thứ 6",
    image: "/4nguoi.jpg", 
    tag: "HOT"
  },
  {
    id: 2,
    title: "Sinh Nhật Đáng Nhớ",
    desc: "Tặng ngay bánh sinh nhật cao cấp và gói trang trí bàn tiệc miễn phí.",
    time: "Áp dụng cho nhóm từ 4 khách",
    image: "/sinhnhat.jpg",
    tag: "SPECIAL"
  },
  {
    id: 3,
    title: "Wine Wednesday",
    desc: "Mua 1 tặng 1 đối với các loại rượu vang ly (House Wine).",
    time: "Mỗi tối Thứ 4 hàng tuần",
    image: "/ruouvang2.jpg",
    tag: "WEEKLY"
  }
];

const Promo = () => {

  return (
    <>
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-16 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/lobby2.jpg"
            alt="Promo Background"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { e.target.src = "/lobby2.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-stone-900/50 to-stone-100"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 mb-6 animate-fade-in-up">
            <Gift size={16} />
            <span className="text-sm font-bold tracking-wider uppercase">Special Offers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ưu Đãi <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Đặc Quyền</span>
          </h1>
          <p className="text-stone-300 text-lg font-light max-w-2xl mx-auto">
            Khám phá những chương trình khuyến mãi hấp dẫn dành riêng cho thực khách sành điệu tại Beef Bistro.
          </p>
        </div>
      </section>

      
      {/* 3. PROMO GRID (Danh sách ưu đãi) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ưu Đãi Định Kỳ
            </h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROMOTIONS.map((promo) => (
              <div key={promo.id} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-xl hover:border-yellow-500/30 transition duration-300 flex flex-col">
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"; }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-stone-800 shadow-sm">
                    {promo.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3 group-hover:text-yellow-600 transition">
                    {promo.title}
                  </h3>
                  <p className="text-stone-600 text-sm font-light mb-6 line-clamp-2 flex-1">
                    {promo.desc}
                  </p>
                  
                  <div className="border-t border-stone-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
                      <Clock size={16} className="text-yellow-500" />
                      <span>{promo.time}</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <Footer />
    </>
  );
};

export default Promo;