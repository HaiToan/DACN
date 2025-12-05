// pages/Booking.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Phone, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Booking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "1",
    name: "",
    phone: "",
    note: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Lấy thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    const storedHoten = localStorage.getItem('hoten');
    const storedSdt = localStorage.getItem('sodienthoai'); // Giả sử sđt được lưu
    if (storedHoten) {
      setFormData(prev => ({ ...prev, name: storedHoten }));
    }
    if (storedSdt) {
      setFormData(prev => ({ ...prev, phone: storedSdt }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    // Không cần chặn nếu không có token, vì backend có thể xử lý đặt bàn ẩn danh

    const bookingData = {
      ngayDat: formData.date,
      gioDat: formData.time,
      soNguoi: parseInt(formData.guests, 10),
      tenKH: formData.name,
      sdt: formData.phone,
      ghiChu: formData.note
    };

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Gửi token nếu có
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Đặt bàn thất bại. Vui lòng thử lại.');
      }

      setSubmittedData(formData);
      setIsSubmitted(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });

      // Tự động chuyển hướng sang trang booking-history sau 5 giây
      setTimeout(() => {
        navigate('/booking-history');
      }, 5000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="py-20 bg-stone-50 min-h-[600px]">
        <div className="container pt-30 mx-auto px-4 lg:px-20">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
            
            {!isSubmitted ? (
              <div className="flex flex-col md:flex-row">
                <div className="hidden md:block w-1/3 bg-stone-900 relative">
                  <img src="/datban.jpg" alt="Dining" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                    <h3 className="text-2xl font-serif font-bold mb-2">Lưu ý</h3>
                    <ul className="text-sm text-stone-300 space-y-2 list-disc pl-4 font-light">
                      <li>Giữ bàn tối đa 15 phút so với giờ đặt.</li>
                    </ul>
                  </div>
                </div>

                <div className="w-full md:w-2/3 p-8 md:p-12">
                  <div className="flex justify-between items-center mb-6 border-b pb-4 border-stone-100">
                    <h2 className="text-2xl font-bold text-stone-800">
                      Thông tin đặt bàn
                    </h2>
                    <Link 
                      to="/booking-history"
                      className="text-sm font-semibold bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Lịch sử đặt bàn
                    </Link>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-yellow-600"/> Ngày
                        </label>
                        <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Clock size={16} className="text-yellow-600"/> Giờ
                        </label>
                        <select name="time" required value={formData.time} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition">
                          <option value="">Chọn giờ</option>
                          {[...Array(8)].map((_, i) => {
                            const hour = 17 + Math.floor(i / 2);
                            const minute = i % 2 === 0 ? '00' : '30';
                            return <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>{`${hour}:${minute}`}</option>
                          })}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                        <Users size={16} className="text-yellow-600"/> Số lượng khách
                      </label>
                      <select name="guests" value={formData.guests} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition">
                        {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Khách</option>)}
                        <option value="10+">10+ Khách</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <User size={16} className="text-yellow-600"/> Họ và tên
                        </label>
                        <input type="text" name="name" required placeholder="VD: Nguyễn Văn A" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-yellow-600"/> Số điện thoại
                        </label>
                        <input type="tel" name="phone" required placeholder="VD: 0909..." value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2 flex items-center gap-2">
                        <FileText size={16} className="text-yellow-600"/> Ghi chú thêm (Tuỳ chọn)
                      </label>
                      <textarea name="note" rows="3" placeholder="Dị ứng, bàn cạnh cửa sổ, trang trí sinh nhật..." value={formData.note} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition resize-none"></textarea>
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-lg transform hover:-translate-y-1 disabled:bg-stone-400 disabled:cursor-not-allowed">
                      {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Bàn'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center bg-white min-h-[500px]">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">
                  Đặt Bàn Thành Công!
                </h2>
                <p className="text-stone-600 text-lg mb-8 max-w-md">
                  Cảm ơn <strong>{submittedData.name}</strong>, chúng tôi đã nhận được yêu cầu. <br/>
                  Vui lòng kiểm tra trạng thái tại trang <strong>Lịch sử đặt bàn</strong>. Bạn sẽ được chuyển hướng sau 5 giây.
                </p>
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 w-full max-w-sm mb-8">
                   <div className="flex justify-between mb-2 border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Ngày:</span>
                      <span className="font-bold text-stone-800">{submittedData.date}</span>
                   </div>
                   <div className="flex justify-between mb-2 border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Giờ:</span>
                      <span className="font-bold text-stone-800">{submittedData.time}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-stone-500">Số khách:</span>
                      <span className="font-bold text-stone-800">{submittedData.guests}</span>
                   </div>
                </div>

                <button 
                  onClick={() => navigate('/booking-history')}
                  className="px-8 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-yellow-600 transition"
                >
                  Xem Lịch Sử Đặt Bàn
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