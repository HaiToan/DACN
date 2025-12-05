// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import UserPageLayout from '../components/UserPageLayout';

const Profile = () => {
    const [user, setUser] = useState({ hoten: '', email: '', sdt: '', diachi: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setMessage('Bạn cần đăng nhập để xem thông tin cá nhân.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin người dùng.');
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Cập nhật thông tin thất bại.');
            }

            setMessage(data.message);
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <UserPageLayout title="Thông Tin Cá Nhân">
            <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-lg shadow-md">
                {loading ? (
                    <div className="text-center py-10">Đang tải...</div>
                ) : message && !user.hoten ? (
                     <p className="text-center mb-4 text-red-600">{message}</p>
                ) : (
                    <>
                        {message && <p className="text-center mb-4 text-green-600">{message}</p>}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="hoten" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <input
                                    type="text"
                                    name="hoten"
                                    id="hoten"
                                    value={user.hoten || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={user.email || ''}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="sdt" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="sdt"
                                    id="sdt"
                                    value={user.sdt || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="diachi" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="diachi"
                                    id="diachi"
                                    value={user.diachi || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </UserPageLayout>
    );
};

export default Profile;
