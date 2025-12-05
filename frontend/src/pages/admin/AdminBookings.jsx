// frontend/src/pages/admin/AdminBookings.jsx
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBookings = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/bookings", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch bookings.");
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBookings();

        // Setup Socket.IO connection
        const socket = io('http://localhost:3001');

        // Listen for new bookings
        socket.on('newBooking', (newBooking) => {
            setBookings(prevBookings => [newBooking, ...prevBookings]);
        });

        // Listen for status updates
        socket.on('bookingStatusUpdate', (updatedBooking) => {
            setBookings(prevBookings => 
                prevBookings.map(b => b.madatban === updatedBooking.madatban ? updatedBooking : b)
            );
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };

    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:3001/api/bookings/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ trangthai: newStatus }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update booking status.");
            }
            // No need to refetch, Socket.IO will handle the update
        } catch (err) {
            setError(err.message); // Show error to admin
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("vi-VN");

    if (loading) return <div className="p-8 text-center">Loading bookings...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đặt bàn</h1>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐB</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên KH</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày Đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ Đặt</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số Người</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => {
                            const statusColorClass = (status) => {
                                switch (status) {
                                    case "Đã xác nhận": return "bg-green-100 text-green-800";
                                    case "Đã hủy": return "bg-red-100 text-red-800";
                                    case "Chờ xác nhận": return "bg-yellow-100 text-yellow-800";
                                    default: return "bg-gray-100 text-gray-800";
                                }
                            };

                            return (
                                <tr key={booking.madatban} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.madatban}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{booking.tenkh}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{booking.sdt}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(booking.ngaydatban)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{booking.giodatban}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{booking.songuoi}</td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClass(booking.trangthai)}`}>
                                            {booking.trangthai}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <select
                                            onChange={(e) => handleUpdateStatus(booking.madatban, e.target.value)}
                                            value={booking.trangthai}
                                            className={`block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${statusColorClass(booking.trangthai)}`}
                                        >
                                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                                            <option value="Đã xác nhận">Đã xác nhận</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
