// frontend/src/pages/admin/AdminMenu.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2 } from "lucide-react"; // Import icons
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";

const AdminMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // State for the "Add Item" form
    const [newItem, setNewItem] = useState({
        tenmon: '',
        mota: '',
        gia: '',
        hinhanh: '',
        maloai: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);

    const fetchMenuItems = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/menu', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.details || errorData.message || 'Failed to fetch menu items.';
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setMenuItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/api/menu/categories');
            if (!response.ok) throw new Error('Failed to fetch categories.');
            const data = await response.json();
            setCategories(data);
            if (data.length > 0) {
                setNewItem(prev => ({ ...prev, maloai: data[0].maloai }));
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchMenuItems();
        fetchCategories();
    }, [fetchMenuItems, fetchCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/menu', { // Changed endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to add item.');
            }
            // Clear form and refetch menu
            setNewItem({ tenmon: '', mota: '', gia: '', hinhanh: '', maloai: categories[0]?.maloai || '' });
            fetchMenuItems();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = (mamon) => {
        setItemToDelete(mamon);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setError('');
        if (!itemToDelete) return; // Should not happen if dialog is opened correctly
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/menu/${itemToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to delete item.');
            }

            fetchMenuItems(); // Refetch menu items after successful deletion
            setShowDeleteConfirm(false); // Close dialog
            setItemToDelete(null); // Clear item to delete
        } catch (err) {
            setError(err.message);
            setShowDeleteConfirm(false); // Close dialog even if error
            setItemToDelete(null); // Clear item to delete
        }
    };
    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentEditItem({ ...item }); // Copy item to avoid direct state mutation
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentEditItem(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentEditItem || !currentEditItem.mamon) {
            setError('Không có món ăn nào đang được chỉnh sửa.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/menu/${currentEditItem.mamon}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(currentEditItem) // Send the entire currentEditItem
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Cập nhật món ăn thất bại.');
            }

            fetchMenuItems(); // Refetch menu items after successful update
            handleCancelEdit(); // Close the modal
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Quản lý Thực đơn</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            {/* Form to Add New Menu Item */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Thêm món ăn mới</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="tenmon" value={newItem.tenmon} onChange={handleInputChange} placeholder="Tên món ăn" className="p-2 border rounded" required />
                    <input name="gia" type="number" value={newItem.gia} onChange={handleInputChange} placeholder="Giá" className="p-2 border rounded" required />
                    <textarea name="mota" value={newItem.mota} onChange={handleInputChange} placeholder="Mô tả" className="p-2 border rounded md:col-span-2" />
                    <input name="hinhanh" value={newItem.hinhanh} onChange={handleInputChange} placeholder="URL Hình ảnh" className="p-2 border rounded" />
                    <select name="maloai" value={newItem.maloai} onChange={handleInputChange} className="p-2 border rounded">
                        {categories.map(cat => (
                            <option key={cat.maloai} value={cat.maloai}>{cat.tenloai}</option>
                        ))}
                    </select>
                    <button type="submit" className="md:col-span-2 py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600">Thêm món</button>
                </form>
            </div>
            
            {/* Table of Menu Items */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold mb-4">Danh sách món ăn</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên món</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {menuItems.map((item) => (
                                <tr key={item.mamon}>
                                    <td className="px-6 py-4">{item.mamon}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.tenmon}</td>
                                    <td className="px-6 py-4"> {/* Removed whitespace-nowrap */}
                                        {item.mota.length > 50 ? (
                                            <span title={item.mota}>{item.mota.substring(0, 50)}...</span>
                                        ) : (
                                            item.mota
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.gia)}</td>
                                    <td className="px-6 py-4">{item.tenloai}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)} // Attach handleEdit, passing the whole item
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.mamon)} // Attach handleDelete
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa món ăn</h2>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
                            <label>Tên món ăn:</label>
                            <input name="tenmon" value={currentEditItem?.tenmon || ''} onChange={handleEditInputChange} className="p-2 border rounded" required />
                            
                            <label>Mô tả:</label>
                            <textarea name="mota" value={currentEditItem?.mota || ''} onChange={handleEditInputChange} className="p-2 border rounded" />
                            
                            <label>Giá:</label>
                            <input name="gia" type="number" value={currentEditItem?.gia || ''} onChange={handleEditInputChange} className="p-2 border rounded" required />
                            
                            <label>URL Hình ảnh:</label>
                            <input name="hinhanh" value={currentEditItem?.hinhanh || ''} onChange={handleEditInputChange} className="p-2 border rounded" />
                            
                            <label>Loại:</label>
                            <select name="maloai" value={currentEditItem?.maloai || ''} onChange={handleEditInputChange} className="p-2 border rounded">
                                {categories.map(cat => (
                                    <option key={cat.maloai} value={cat.maloai}>{cat.tenloai}</option>
                                ))}
                            </select>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={handleCancelEdit} className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Hủy</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa món ăn</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa món ăn này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                        >
                            Xóa
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
1
export default AdminMenu;
