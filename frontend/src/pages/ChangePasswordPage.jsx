// src/pages/ChangePasswordPage.jsx
import React, { useState } from 'react';
import UserPageLayout from '../components/UserPageLayout';

const ChangePasswordPage = () => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setError('Mật khẩu mới không khớp.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đổi mật khẩu thất bại.');
            }

            setMessage(data.message);
            setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <UserPageLayout title="Đổi Mật Khẩu">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
                {message && <p className="text-center mb-4 text-green-600">{message}</p>}
                {error && <p className="text-center mb-4 text-red-600">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
                        <input
                            type="password"
                            name="oldPassword"
                            id="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            value={passwords.confirmNewPassword}
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
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </UserPageLayout>
    );
};

export default ChangePasswordPage;
