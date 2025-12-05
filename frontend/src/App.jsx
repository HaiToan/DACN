// App.jsx (Đã Cập Nhật Logic Bảo Vệ Route và Admin Panel)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; 
import { CartProvider } from './context/CartContext';

// Import các trang chính từ thư mục pages
import MainHome from './pages/MainHome';
import Menu from './pages/Menu';
import About from './pages/About';
import Booking from './pages/Booking';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; // Import Checkout page
import BookingHistory from './pages/BookingHistory';
import OrderHistory from './pages/OrderHistory';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage'; 
import NotFound from './pages/NotFound';
import Promo from './pages/Promo';
import Profile from './pages/Profile';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Import components bảo vệ và layout
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Import các trang admin
import AdminMenu from './pages/admin/AdminMenu';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders'; // Import AdminOrders



function App() {
  return (
    <CartProvider> {/* CartProvider should wrap the Router */}
      <Router>
        <ScrollToTop />
        <Routes>
          
          {/* Đường dẫn công cộng (Public Routes) */}
          <Route path="/" element={<MainHome />} /> 
          <Route path="/menu" element={<Menu />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/reviews" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/promo" element={<Promo />} />
          
          {/* Đường dẫn Xác thực (Auth Route) */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* 🛡️ ĐƯỜNG DẪN ĐƯỢC BẢO VỆ (Protected Routes for Customers) */}
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-history" 
            element={
              <ProtectedRoute>
                <BookingHistory /> 
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-history" 
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />


          {/* 🛡️ ĐƯỜNG DẪN ADMIN (Protected Admin Routes) */}
          <Route 
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* Trang mặc định khi vào /admin */}
            <Route index element={<AdminMenu />} /> 
            <Route path="menu" element={<AdminMenu />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Đường dẫn mặc định khi không tìm thấy */}
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;