// pages/Contact.jsx

import React from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden mt-16 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/lobby.jpg" 
            alt="Contact Background"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-stone-900/40 to-stone-100"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <span className="text-yellow-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block animate-pulse">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Liên Hệ
          </h1>
          <p className="text-stone-300 text-lg font-light max-w-xl mx-auto">
            Hãy liên hệ với chúng tôi cho mọi thắc mắc hoặc đặt bàn trước để có trải nghiệm tốt nhất tại Beef Bistro.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* --- LEFT COLUMN: Contact Info --- */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 relative inline-block">
                Thông Tin Liên Hệ
                <span className="absolute top-10 left-0 w-1/2 h-1 bg-yellow-500"></span>
              </h2>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg mb-1">Địa chỉ nhà hàng</h3>
                    <p className="text-stone-600 font-light leading-relaxed">
                      180 Cao Lỗ, Phường 4, Quận 8,<br /> TP. Hồ Chí Minh, Việt Nam.
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg mb-1">Hotline đặt bàn</h3>
                    <p className="text-stone-600 font-light text-xl font-serif text-yellow-700">
                      (028) 123 4567
                    </p>
                    <p className="text-stone-500 text-sm italic">Hỗ trợ 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg mb-1">Email hỗ trợ</h3>
                    <p className="text-stone-600 font-light">
                      beefbistro@gmail.com<br/>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition duration-300">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg mb-1">Giờ mở cửa</h3>
                    <p className="text-stone-600 font-light">
                      <span className="font-medium text-stone-800">Thứ 2 - Thứ 6:</span> 10:00 - 22:00 <br/>
                      <span className="font-medium text-stone-800">Thứ 7 - Chủ Nhật:</span> 09:00 - 23:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-12 pt-8 border-t border-stone-200">
                <h3 className="font-bold text-stone-800 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex gap-4">
                  
                  {/* Facebook */}
                  <a href="#" className="w-12 h-12 rounded-full bg-white text-stone-700 shadow-md flex items-center justify-center hover:bg-yellow-500 hover:text-white hover:-translate-y-1 transition duration-300">
                    <Facebook size={20} />
                  </a>
                  
                  {/* Instagram */}
                  <a href="#" className="w-12 h-12 rounded-full bg-white text-stone-700 shadow-md flex items-center justify-center hover:bg-yellow-500 hover:text-white hover:-translate-y-1 transition duration-300">
                    <Instagram size={20} />
                  </a>
            

                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Google Map --- */}
            <div className="h-[500px] lg:h-auto min-h-[500px] w-full bg-white p-2 rounded-2xl shadow-2xl">
                <div className="w-full h-full rounded-xl overflow-hidden border border-stone-200 relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.954067902482!2d106.67529047480434!3d10.7379971894085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad027e3727%3A0x2a77b414e887f86d!2zMTgwIENhbyBMw7csIFBoxrDhu51uZyA0LCBRdeG6rW4gOCwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1709308000000!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full filter grayscale-[20%] contrast-110"
                        title="Beef Bistro Map"
                    ></iframe>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border-l-4 border-yellow-500">
                        <p className="text-xs font-bold text-stone-800">BEEF BISTRO</p>
                        <p className="text-[10px] text-stone-500">180 Cao Lỗ, Q.8</p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;