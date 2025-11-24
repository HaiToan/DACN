// pages/Booking.jsx

import React, { useState } from "react";
import { Calendar, Clock, Users, User, Phone, FileText, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Booking = () => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "1",
    name: "",
    phone: "",
    note: ""
  });

  // State quản lý trạng thái gửi thành công
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gọi API đặt bàn
    console.log("Booking Data:", formData);
    
    // Hiển thị thông báo thành công
    setIsSubmitted(true);
    
    // Scroll lên đầu form để thấy thông báo
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
     

      {/* 2. BOOKING FORM SECTION */}
      <section className="py-20 bg-stone-50 min-h-[600px]">
        <div className="container pt-30 mx-auto px-4 lg:px-20">
          
          {/* Khung chứa Form - Màu trắng, đổ bóng */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
            
            {!isSubmitted ? (
              /* --- TRẠNG THÁI 1: FORM ĐIỀN THÔNG TIN --- */
              <div className="flex flex-col md:flex-row">
                
                {/* Cột trái: Hình ảnh trang trí (Ẩn trên mobile) */}
                <div className="hidden md:block w-1/3 bg-stone-900 relative">
                  <img 
                    src="/datban.jpg" 
                    alt="Dining" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1974&auto=format&fit=crop"; }}
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                    <h3 className="text-2xl font-serif font-bold mb-2">Lưu ý</h3>
                    <ul className="text-sm text-stone-300 space-y-2 list-disc pl-4 font-light">
                      <li>Giữ bàn tối đa 15 phút so với giờ đặt.</li>
                    </ul>
                  </div>
                </div>

                {/* Cột phải: Form nhập liệu */}
                <div className="w-full md:w-2/3 p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-stone-800 mb-6 border-b pb-4 border-stone-100">
                    Thông tin đặt bàn
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Row 1: Ngày & Giờ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-yellow-600"/> Ngày
                        </label>
                        <input 
                          type="date" 
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Clock size={16} className="text-yellow-600"/> Giờ
                        </label>
                        <select 
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Chọn giờ</option>
                          <option value="17:00">17:00</option>
                          <option value="17:30">17:30</option>
                          <option value="18:00">18:00</option>
                          <option value="18:30">18:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                          <option value="20:30">20:30</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Số khách */}
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                        <Users size={16} className="text-yellow-600"/> Số lượng khách
                      </label>
                      <select 
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                      >
                        {[1,2,3,4,5,6,7,8,9,10, "10+"].map(num => (
                           <option key={num} value={num}>{num} Khách</option>
                        ))}
                      </select>
                    </div>

                    {/* Row 3: Thông tin liên hệ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <User size={16} className="text-yellow-600"/> Họ và tên
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          placeholder="VD: Nguyễn Văn A"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-yellow-600"/> Số điện thoại
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          placeholder="VD: 0909..."
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Row 4: Ghi chú */}
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                        <FileText size={16} className="text-yellow-600"/> Ghi chú thêm (Tuỳ chọn)
                      </label>
                      <textarea 
                        name="note"
                        rows="3"
                        placeholder="Dị ứng, bàn cạnh cửa sổ, trang trí sinh nhật..."
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-lg transform hover:-translate-y-1"
                    >
                      Xác Nhận Đặt Bàn
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* --- TRẠNG THÁI 2: THÔNG BÁO THÀNH CÔNG --- */
              <div className="p-16 flex flex-col items-center justify-center text-center bg-white min-h-[500px]">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Đặt Bàn Thành Công!
                </h2>
                <p className="text-stone-600 text-lg mb-8 max-w-md">
                  Cảm ơn <strong>{formData.name}</strong> đã lựa chọn Beef Bistro. <br/>
                  Chúng tôi đã nhận được yêu cầu và sẽ liên hệ xác nhận qua số điện thoại <strong>{formData.phone}</strong> trong ít phút.
                </p>
                
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 w-full max-w-sm mb-8">
                   <div className="flex justify-between mb-2 border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Ngày:</span>
                      <span className="font-bold text-stone-800">{formData.date}</span>
                   </div>
                   <div className="flex justify-between mb-2 border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Giờ:</span>
                      <span className="font-bold text-stone-800">{formData.time}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-stone-500">Số khách:</span>
                      <span className="font-bold text-stone-800">{formData.guests}</span>
                   </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 border border-stone-300 text-stone-700 font-bold rounded-full hover:bg-stone-900 hover:text-white transition"
                >
                  Quay Về Trang Chủ
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Booking;