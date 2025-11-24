// pages/Infor.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      {/* 1. HEADER */}
      <Header />

      {/* Section 1 – Hero/Intro */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden mt-16 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/info_hero.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-stone-900/90"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <span className="uppercase tracking-[0.4em] text-lg md:text-lg font-bold text-yellow-500 mb-6 block animate-pulse">
            Since 2025
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-none tracking-tight">
            Vị Ngon <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              THƯỢNG HẠNG
            </span>
          </h1>
          <p className="text-lg md:text-2xl font-light text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm ẩm thực đỉnh cao với nguyên liệu tươi ngon và không gian
            sang trọng tại Beef Bistro.
          </p>
          <button className="bg-yellow-600 text-white px-8 py-3 rounded-full hover:bg-yellow-700 transition font-bold shadow-lg uppercase tracking-wider transform hover:scale-105 duration-300">
            Xem Thực Đơn
          </button>
        </div>
      </section>

      {/* Section 2 – Interior/Space (Light Background) */}
      <section className="py-24 bg-[#F9F8F6]">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              <img
                src="/info_1.jpg"
                className="rounded-2xl shadow-xl w-full h-64 object-cover mt-12 hover:scale-[1.02] transition duration-500"
                alt="Interior"
              />
              <img
                src="/info_2.jpg"
                className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-[1.02] transition duration-500"
                alt="Food"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
                Không gian sang trọng
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed font-light text-justify mb-6">
                <strong className="text-stone-800 font-medium">
                  Beef Bistro
                </strong>{" "}
                không chỉ nổi tiếng với thực đơn đẳng cấp mà còn bởi không gian
                ấm cúng và sang trọng. Từ ánh đèn vàng ấm áp đến nội thất tinh
                tế, mọi chi tiết đều được chăm chút để mang đến trải nghiệm ẩm
                thực tuyệt vời nhất cho thực khách.
              </p>
            </div>
          </div>
        </div>
      </section>

     <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                Nghệ thuật chế biến
              </span>
              
              {/* Dùng font-playfair ở đây nếu đã config, hoặc style trực tiếp để chắc chắn nhận font */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Đánh thức <span className="italic text-yellow-500">mọi giác quan</span>
              </h2>
              
              <p className="text-stone-400 text-lg leading-relaxed font-light mb-6 text-justify">
                Tại Beef Bistro, mỗi món steak là một tác phẩm nghệ thuật. Chúng tôi áp dụng kỹ thuật 
                <span className="text-white font-medium"> Dry-aging </span> 
                công phu kết hợp với phương pháp nướng trên than hoa truyền thống để giữ trọn hương vị nguyên bản.
              </p>

              <div className="border-l-4 border-yellow-600 pl-6 py-2 mb-8">
                <p 
                  className="italic text-xl text-stone-300 leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif" }} 
                >
                  "Nấu ăn không chỉ là kỹ thuật, đó là sự tôn trọng tuyệt đối đối với nguyên liệu."
                </p>
                <p className="mt-4 text-yellow-500 font-bold text-sm tracking-wider uppercase">
                  — Exec. Chef
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="p-2 border border-yellow-600/50 ">
                <img 
                  src="/daubep.jpg" 
                  alt="Chef cooking" 
                  className="w-full h-[500px] object-cover shadow-xl filter brightness-90 contrast-110 "
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* NEW SECTION 4: MOSAIC GRID (UPDATED CAPTIONS) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nguyên Liệu <br/> <span className="text-yellow-600 italic">Là Linh Hồn.</span>
            </h2>
            <p className="hidden md:block text-stone-500 max-w-md text-right font-light">
              Tuyển chọn khắt khe từ những nguồn cung ứng hàng đầu thế giới để tạo nên chuẩn mực hương vị.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
            
            {/* Card Lớn: Bò (Chiếm 2 phần) */}
            <div className="lg:col-span-2 relative group overflow-hidden rounded-2xl cursor-pointer h-80 lg:h-auto">
              <img src="/bowagyu1.jpg" alt="Beef" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2 font-serif">Bò Wagyu</h3>
                <p className="text-stone-300 font-light max-w-lg text-sm md:text-base opacity-0 group-hover:opacity-100 transition duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Đỉnh cao của nghệ thuật chăn nuôi Nhật Bản với vân mỡ tuyệt đẹp và độ mềm tan chảy.
                </p>
              </div>
            </div>

            {/* Cột bên phải: Chứa 2 card nhỏ xếp chồng */}
            <div className="flex flex-col gap-6 h-full">
              
              {/* Card Nhỏ 1: Rượu */}
              <div className="relative group overflow-hidden rounded-2xl cursor-pointer flex-1 h-60 lg:h-auto">
                <img src="/ruouvang.jpg" alt="Wine" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                {/* Đổi overlay thành Gradient để chữ rõ hơn */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                   <h3 className="text-2xl font-bold text-white font-serif mb-1">Vang Tuyển Chọn</h3>
                   {/* Caption thêm mới */}
                   <p className="text-stone-300 font-light text-xs md:text-sm opacity-0 group-hover:opacity-100 transition duration-500 transform translate-y-4 group-hover:translate-y-0">
                     Hương vị nồng nàn, kết hợp hoàn hảo với từng thớ thịt.
                   </p>
                </div>
              </div>

              {/* Card Nhỏ 2: Rau */}
              <div className="relative group overflow-hidden rounded-2xl cursor-pointer flex-1 h-60 lg:h-auto">
                <img src="/raucu.jpg" alt="Vegetables" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                {/* Đổi overlay thành Gradient để chữ rõ hơn */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                   <h3 className="text-2xl font-bold text-white font-serif mb-1">Organic Farm</h3>
                   {/* Caption thêm mới */}
                   <p className="text-stone-300 font-light text-xs md:text-sm opacity-0 group-hover:opacity-100 transition duration-500 transform translate-y-4 group-hover:translate-y-0">
                     Rau củ tươi xanh từ Đà Lạt, giữ trọn vị ngọt tự nhiên.
                   </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Section 5 – Call to Action */}
      <section className="py-16 text-center bg-yellow-100">
        <h2 className="text-3xl font-bold mb-4 text-stone-800">Đặt bàn ngay hôm nay!</h2>
        <p className="mb-8 text-stone-600 max-w-xl mx-auto">
          Đừng bỏ lỡ cơ hội thưởng thức những miếng steak hảo hạng trong không gian lãng mạn.
        </p>
        <Link 
          to="/booking" 
          className="inline-block bg-yellow-500 text-white px-8 py-3 rounded hover:bg-yellow-600 font-bold shadow-md transition transform hover:-translate-y-1"
        >
          Liên Hệ Đặt Bàn
        </Link>
      </section>

      {/* 6. FOOTER */}
      <Footer />
    </>
  );
};

export default About;