// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPageLayout from '../components/UserPageLayout';

// Helper function to translate English statuses to Vietnamese
const translateStatus = (status) => {
    switch (status) {
        // Order Statuses
        case 'Pending': return 'Chờ thanh toán'; 
        case 'Processing': return 'Đang xử lý';
        case 'Delivered': return 'Đã giao hàng';
        case 'Cancelled': return 'Đã hủy';
        // Payment Statuses
        case 'Paid': return 'Đã thanh toán';
        default: return status;
    }
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 401) {
                    localStorage.clear();
                    navigate('/auth');
                    return;
                }
                if (!response.ok) throw new Error('Không thể lấy lịch sử mua hàng.');

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    
    const getStatusClass = (status) => {
        switch (translateStatus(status)) { // Use translated status for color mapping
            case 'Đã giao hàng':
            case 'Đã thanh toán':
                return 'bg-green-100 text-green-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            case 'Đang xử lý':
            case 'Chờ thanh toán':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <UserPageLayout title="Lịch Sử Mua Hàng">
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải lịch sử mua hàng...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        {orders.length > 0 ? (
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Mã ĐH</th>
                                        <th scope="col" className="px-6 py-3">Ngày Đặt</th>
                                        <th scope="col" className="px-6 py-3">Địa chỉ</th>
                                        <th scope="col" className="px-6 py-3 text-right">Tổng Tiền</th>
                                        <th scope="col" className="px-6 py-3 text-center">Trạng thái ĐH</th>
                                        <th scope="col" className="px-6 py-3 text-center">Thanh toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.madh} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{order.madh}</td>
                                            <td className="px-6 py-4">{formatDate(order.ngaydat)}</td>
                                            <td className="px-6 py-4 truncate max-w-sm">{order.diachigiaohang}</td>
                                            <td className="px-6 py-4 text-right font-semibold">{formatCurrency(order.tongthanhtoan)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 font-semibold rounded-full text-xs ${getStatusClass(order.trangthaidonhang)}`}>
                                                    {translateStatus(order.trangthaidonhang)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 font-semibold rounded-full text-xs ${getStatusClass(order.trangthaithanhtoan)}`}>
                                                    {translateStatus(order.trangthaithanhtoan)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </UserPageLayout>
    );
};

export default OrderHistory;
