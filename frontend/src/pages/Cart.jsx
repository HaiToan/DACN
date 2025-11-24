// pages/Cart.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Cart = () => {
  // KHỞI TẠO GIỎ HÀNG RỖNG
  const [cartItems, setCartItems] = useState([]);

  // Hàm format tiền VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Xử lý tăng giảm số lượng
  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  // Xử lý xóa món
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // VAT 8%
  const total = subtotal + tax;

  return (
    <>
      <Header />

      {/* Main Content */}
      <main className="min-h-[80vh] bg-stone-50 pt-40 pb-20 flex flex-col">
        <div className="container mx-auto px-4 lg:px-20 flex-1">
          
          {/* 💡 PHẦN TIÊU ĐỀ CÓ ĐƯỜNG KẺ VÀNG */}
          <div className="mb-10">
            <h1 className="text-4xl font-serif font-bold text-stone-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Giỏ Hàng Của Bạn
            </h1>
            {/* Đường kẻ vàng ở đây */}
            <div className="w-75 h-1.5 bg-yellow-500 rounded-full"></div>
          </div>

          {cartItems.length === 0 ? (
            /* --- 1. GIAO DIỆN KHI GIỎ HÀNG TRỐNG --- */
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-stone-100 text-center animate-fade-in-up">
              <div className="w-32 h-32 bg-stone-50 text-stone-300 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShoppingBag size={64} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-3">
                Giỏ hàng đang trống
              </h2>
              
              <p className="text-stone-500 mb-10 max-w-md leading-relaxed">
                Có vẻ như bạn chưa chọn món nào. <br/>
                Hãy khám phá thực đơn thượng hạng của Beef Bistro ngay nhé!
              </p>
              
              <Link 
                to="/menu" 
                className="px-10 py-4 bg-yellow-500 text-white font-bold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg transform hover:-translate-y-1 flex items-center gap-2"
              >
                <span>Xem Thực Đơn Ngay</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            /* --- 2. GIAO DIỆN KHI CÓ SẢN PHẨM --- */
            <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
              
              {/* Cột Trái: Danh sách sản phẩm */}
              <div className="w-full lg:w-2/3 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-4 items-center transition hover:shadow-md">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-stone-200">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif font-bold text-stone-800 text-lg">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-red-500 transition p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-yellow-600 font-bold text-sm mb-2">{formatCurrency(item.price)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-stone-100 text-stone-600 transition">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium text-stone-800 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-stone-100 text-stone-600 transition">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/menu" className="inline-flex items-center text-stone-500 hover:text-yellow-600 transition font-medium mt-4">
                  <ArrowLeft size={18} className="mr-2" /> Tiếp tục gọi món
                </Link>
              </div>

              {/* Cột Phải: Tổng tiền */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 sticky top-32">
                  <h2 className="text-xl font-serif font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Tổng Đơn Hàng</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-stone-600"><span>Tạm tính:</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between text-stone-600"><span>Thuế (8%):</span><span className="font-medium">{formatCurrency(tax)}</span></div>
                    <div className="border-t border-stone-100 my-2 pt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-stone-800">Tổng cộng:</span>
                      <span className="text-2xl font-serif font-bold text-yellow-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-yellow-600 transition duration-300 shadow-lg">
                    Thanh Toán
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Cart;