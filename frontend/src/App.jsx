// App.jsx (Đã Cập Nhật Logic Bảo Vệ Route)

import React from 'react';
// 💡 CẬP NHẬT: Thay thế BrowserRouter bằng Router để khớp với JSX
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// Import các trang chính từ thư mục pages
import MainHome from './pages/MainHome';
import Menu from './pages/Menu';
import About from './pages/About';
import Booking from './pages/Booking';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage'; 
import NotFound from './pages/NotFound';
import Promo from './pages/Promo';

// Import component bảo vệ
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  return (
    <Router>
      {/* Tất cả các Route không được bảo vệ đều là public access (truy cập công khai).
        Các Route được bảo vệ (như /booking) yêu cầu người dùng phải đăng nhập.
      */}
      <Routes>
        
        {/* Đường dẫn công cộng (Public Routes) */}
        <Route path="/" element={<MainHome />} /> 
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/reviews" element={<Feedback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/booking" element={<Booking />} />
        {/* Đường dẫn Xác thực (Auth Route) */}
        {/* Chuẩn hóa về một đường dẫn /auth trỏ tới component AuthPage */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} /> {/* Vẫn giữ /login redirect về /auth */}
        
        
        {/* 🛡️ ĐƯỜNG DẪN ĐƯỢC BẢO VỆ (Protected Routes) */}
        
        {/* 💡 Yêu cầu: Đặt bàn phải đăng nhập trước. Bọc Booking trong ProtectedRoute. */}
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute>
              <Booking /> {/* Chỉ hiện Booking nếu đã đăng nhập */}
            </ProtectedRoute>
          } 
        />
        
        {/* Ví dụ: Đơn hàng cũng thường cần bảo vệ */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders /> 
            </ProtectedRoute>
          } 
        />

        {/* Đường dẫn mặc định khi không tìm thấy */}
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;