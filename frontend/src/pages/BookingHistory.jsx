// src/pages/BookingHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPageLayout from '../components/UserPageLayout';
import io from 'socket.io-client';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        const socket = io('http://localhost:3001');

        // Lấy MaTK từ localStorage để đăng ký room
        const maTK = localStorage.getItem('maTK'); 
        if (maTK) {
            socket.emit('register', maTK);
        }

        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/bookings/mybookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 401) {
                    // Xử lý token hết hạn
                    localStorage.clear();
                    navigate('/auth');
                    return;
                }
                if (!response.ok) throw new Error('Không thể lấy danh sách đặt bàn.');

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();

        // Lắng nghe sự kiện cập nhật trạng thái
        socket.on('bookingStatusUpdate', (updatedBooking) => {
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.madatban === updatedBooking.madatban ? updatedBooking : booking
                )
            );
        });

        // Cleanup: ngắt kết nối socket khi component unmount
        return () => {
            socket.disconnect();
        };

    }, [navigate]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Đã xác nhận': return 'bg-green-100 text-green-800';
            case 'Đã hủy': return 'bg-red-100 text-red-800';
            case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <UserPageLayout title="Lịch Sử Đặt Bàn">
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải lịch sử đặt bàn...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        {bookings.length > 0 ? (
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Mã ĐB</th>
                                        <th scope="col" className="px-6 py-3">Tên KH</th>
                                        <th scope="col" className="px-6 py-3">SĐT</th>
                                        <th scope="col" className="px-6 py-3">Ngày</th>
                                        <th scope="col" className="px-6 py-3">Giờ</th>
                                        <th scope="col" className="px-6 py-3">Số người</th>
                                        <th scope="col" className="px-6 py-3">Ghi chú</th>
                                        <th scope="col" className="px-6 py-3 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.madatban} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{b.madatban}</td>
                                            <td className="px-6 py-4">{b.tenkh}</td>
                                            <td className="px-6 py-4">{b.sdt}</td>
                                            <td className="px-6 py-4">{formatDate(b.ngaydatban)}</td>
                                            <td className="px-6 py-4">{b.giodatban}</td>
                                            <td className="px-6 py-4 text-center">{b.songuoi}</td>
                                            <td className="px-6 py-4 truncate max-w-xs">{b.ghichu}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 font-semibold rounded-full text-xs ${getStatusClass(b.trangthai)}`}>
                                                    {b.trangthai}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500">Bạn chưa có lịch sử đặt bàn nào.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </UserPageLayout>
    );
};

export default BookingHistory;