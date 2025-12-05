// frontend/src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Eye } from "lucide-react";
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

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
    const [orderToUpdateStatus, setOrderToUpdateStatus] = useState(null);
    const [newOrderStatus, setNewOrderStatus] = useState('');
    const [newPaymentStatus, setNewPaymentStatus] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateMessageType, setUpdateMessageType] = useState(''); // 'success', 'info', 'error'

    const validOrderStatuses = ['Processing', 'Delivered', 'Cancelled'];
    const validPaymentStatuses = ['Pending', 'Paid'];

    const handleCloseStatusUpdateModal = () => {
        setShowStatusUpdateModal(false);
        setUpdateMessage(''); // Clear message when modal closes
        setUpdateMessageType('');
        setOrderToUpdateStatus(null); // Clear the order being updated
    };

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(''); // Clear previous errors
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Fetch Orders API Response Status:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.details || errorData.message || 'Failed to fetch orders.';
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('Fetched Orders Data:', data);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderDetails = useCallback(async (madh) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/orders/${madh}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Fetch Order Details for ${madh} Status:`, response.status);
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.details || errorData.message || 'Failed to fetch order details.';
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('Fetched Order Details Data:', data);
            setSelectedOrderDetails(data);
            setShowDetailsModal(true);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDelete = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setError('');
        if (!orderToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/admin/orders/${orderToDelete.madh}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Delete Order ${orderToDelete.madh} API Response Status:`, response.status);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to delete order.');
            }

            console.log('Order deleted successfully, refetching orders...');
            fetchOrders();
            setShowDeleteConfirm(false);
            setOrderToDelete(null);
        } catch (err) {
            console.error('Error deleting order:', err);
            setError(err.message);
            setShowDeleteConfirm(false);
            setOrderToDelete(null);
        }
    };

    const handleViewDetails = (madh) => {
        fetchOrderDetails(madh);
    };

    const handleUpdateStatusClick = (order) => {
        setOrderToUpdateStatus(order);
        // If order.trangthai_donhang is 'Pending' (which should not be a valid order status now),
        // default to empty string to select "Chọn trạng thái đơn hàng" option.
        // Otherwise, use the actual order status.
        setNewOrderStatus(order.trangthai_donhang === 'Pending' ? '' : order.trangthai_donhang);
        // If order.trangthai_thanhtoan is not a valid status, default to empty string
        // to select "Chọn trạng thái thanh toán" option.
        setNewPaymentStatus(validPaymentStatuses.includes(order.trangthai_thanhtoan) ? order.trangthai_thanhtoan : '');
        setShowStatusUpdateModal(true);
    };

    const confirmUpdateStatus = async () => {
        setError('');
        setUpdateMessage(''); // Clear previous update message
        setUpdateMessageType('');
        if (!orderToUpdateStatus) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/admin/orders/${orderToUpdateStatus.madh}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    trangthai_donhang: newOrderStatus,
                    trangthai_thanhtoan: newPaymentStatus,
                })
            });
            console.log(`Update Status for ${orderToUpdateStatus.madh} API Request Body:`, {
                trangthai_donhang: newOrderStatus,
                trangthai_thanhtoan: newPaymentStatus,
            });
            console.log(`Original Order Status:`, {
                orderToUpdateStatus_trangthai_donhang: orderToUpdateStatus.trangthai_donhang,
                orderToUpdateStatus_trangthai_thanhtoan: orderToUpdateStatus.trangthai_thanhtoan,
            });
            console.log(`Update Status for ${orderToUpdateStatus.madh} API Response Status:`, response.status);

            if (!response.ok) {
                const errData = await response.json();
                console.error('API Error Response:', errData);
                throw new Error(errData.message || 'Failed to update order status.');
            }

            const updatedOrderData = await response.json();
            console.log('Order status updated successfully:', updatedOrderData);

            if (updatedOrderData.message === 'Không có thay đổi trạng thái nào được yêu cầu.') {
                setUpdateMessage('Trạng thái đã chọn giống với trạng thái hiện tại, không có thay đổi nào được thực hiện.');
                setUpdateMessageType('info');
            } else {
                setUpdateMessage('Cập nhật trạng thái đơn hàng thành công!');
                setUpdateMessageType('success');
            }

            console.log('Refetching all orders to update table...');
            fetchOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
            setError(err.message);
            setUpdateMessage(`Lỗi: ${err.message}`);
            setUpdateMessageType('error');
        }
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

    if (loading) return <p className="text-center py-4">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center py-4 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Quản lý Đơn hàng</h1>

            {/* Table of Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Danh sách Đơn hàng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái ĐH</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái TT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.madh}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.madh}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.tenkhachhang}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(order.ngaydat).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tongthanhtoan)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 font-semibold rounded-full text-xs ${getStatusClass(order.trangthaidonhang)}`}>
                                            {translateStatus(order.trangthaidonhang)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 font-semibold rounded-full text-xs ${getStatusClass(order.trangthaithanhtoan)}`}>
                                            {translateStatus(order.trangthaithanhtoan)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(order.madh)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatusClick(order)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            title="Cập nhật trạng thái"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Xóa đơn hàng"
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa đơn hàng <span className="font-bold">{orderToDelete?.madh}</span> của khách hàng <span className="font-bold">{orderToDelete?.tenkhachhang}</span> không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                        </DialogClose>
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

            {/* Order Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết Đơn hàng: {selectedOrderDetails?.madh}</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết của đơn hàng đã chọn.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrderDetails && (
                        <div className="p-4 border rounded-md bg-gray-50 text-sm">
                            <p className="mb-1"><strong>Mã ĐH:</strong> {selectedOrderDetails.madh}</p>
                            <p className="mb-1"><strong>Khách hàng:</strong> {selectedOrderDetails.tenkhachhang} (Mã KH: {selectedOrderDetails.makh})</p>
                            <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(selectedOrderDetails.ngaydat).toLocaleString()}</p>
                            <p className="mb-1"><strong>Tổng tiền món ăn:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrderDetails.tongtienmonan)}</p>
                            <p className="mb-1"><strong>Phí giao hàng:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrderDetails.phigiaohang)}</p>
                            <p className="mb-1"><strong>Tổng thanh toán:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrderDetails.tongthanhtoan)}</p>
                            <p className="mb-1"><strong>Trạng thái Đơn hàng:</strong> {translateStatus(selectedOrderDetails.trangthaidonhang)}</p>
                            <p className="mb-1"><strong>Trạng thái Thanh toán:</strong> {translateStatus(selectedOrderDetails.trangthaithanhtoan)}</p>
                            <p className="mb-1"><strong>Phương thức TT:</strong> {selectedOrderDetails.phuongthuctt}</p>
                            <p className="mb-1"><strong>Địa chỉ giao hàng:</strong> {selectedOrderDetails.diachigiaohang}</p>
                            <p className="mb-1"><strong>Người nhận:</strong> {selectedOrderDetails.tennguoinhan} (SĐT: {selectedOrderDetails.sdtnguoinhan})</p>
                            {selectedOrderDetails.ghichu && <p className="mb-1"><strong>Ghi chú:</strong> {selectedOrderDetails.ghichu}</p>}

                            <h3 className="text-lg font-semibold mt-4 mb-2">Món ăn trong đơn hàng:</h3>
                            {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {selectedOrderDetails.items.map((item, index) => (
                                        <li key={index} className="mb-1">
                                            {item.tenmon} (Mã: {item.mamon}) - {item.soluong} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.giamien)} = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.thanhtien)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có món ăn nào trong đơn hàng này.</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Đóng
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Update Modal */}
            <Dialog open={showStatusUpdateModal} onOpenChange={handleCloseStatusUpdateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái Đơn hàng: {orderToUpdateStatus?.madh}</DialogTitle>
                        <DialogDescription>
                            Điều chỉnh trạng thái đơn hàng và trạng thái thanh toán.
                        </DialogDescription>
                    </DialogHeader>
                    {orderToUpdateStatus && (
                        <div className="grid gap-4 py-4">
                            {updateMessage && (
                                <div className={`p-3 rounded-md text-sm ${
                                    updateMessageType === 'success' ? 'bg-green-100 text-green-800' :
                                    updateMessageType === 'info' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {updateMessage}
                                </div>
                            )}
                            <div>
                                <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">Trạng thái Đơn hàng</label>
                                <select
                                    id="orderStatus"
                                    name="orderStatus"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={newOrderStatus}
                                    onChange={(e) => setNewOrderStatus(e.target.value)}
                                >
                                    <option value="">Chọn trạng thái đơn hàng</option>
                                    {validOrderStatuses.map(status => (
                                        <option key={status} value={status}>{translateStatus(status)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Trạng thái Thanh toán</label>
                                <select
                                    id="paymentStatus"
                                    name="paymentStatus"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={newPaymentStatus}
                                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                                >
                                    <option value="">Chọn trạng thái thanh toán</option>
                                    {validPaymentStatuses.map(status => (
                                        <option key={status} value={status}>{translateStatus(status)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={confirmUpdateStatus}
                            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        >
                            Cập nhật
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;