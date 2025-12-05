import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import UserPageLayout from '../components/UserPageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, MinusCircle, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from "../components/ui/button"; // Assuming you have a Button component

const Cart = () => {
    const { cartItems, loading, error, getTotalItems, getCartTotal, updateItemQuantity, removeItem, fetchCart } = useCart();
    const navigate = useNavigate();

    const [deliveryFee, setDeliveryFee] = useState(0); // Example: fixed delivery fee
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in

    useEffect(() => {
        fetchCart(); // Ensure cart is fresh when page loads
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [fetchCart]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleQuantityChange = async (mamon, newQuantity) => {
        if (newQuantity <= 0) {
            await removeItem(mamon);
        } else {
            await updateItemQuantity(mamon, newQuantity);
        }
    };

    const handleRemoveItem = async (mamon) => {
        await removeItem(mamon);
    };

    const subtotal = getCartTotal();
    const totalAmount = subtotal + deliveryFee;

    const handleProceedToCheckout = () => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để tiến hành đặt hàng.');
            navigate('/auth'); // Redirect to login page
        } else if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống. Vui lòng thêm món ăn trước khi đặt hàng.');
        } else {
            navigate('/checkout'); // Navigate to a checkout page (which we'll implement next)
        }
    };

    if (loading) {
        return (
            <UserPageLayout title="Giỏ hàng của bạn">
                <div className="flex justify-center items-center h-full text-xl">Đang tải giỏ hàng...</div>
            </UserPageLayout>
        );
    }

    if (error) {
        return (
            <UserPageLayout title="Giỏ hàng của bạn">
                <div className="flex justify-center items-center h-full text-xl text-red-500">Lỗi: {error}</div>
            </UserPageLayout>
        );
    }

    return (
        <UserPageLayout title="Giỏ hàng của bạn">
            <div className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn đang trống.</p>
                        <Link to="/menu" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Món ăn đã chọn ({getTotalItems()})</h2>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.mamon} className="flex items-center border-b border-gray-200 pb-4 last:border-b-0">
                                        <img src={item.hinhanh || '/placeholder.jpg'} alt={item.tenmon} className="w-24 h-24 object-cover rounded-md mr-4" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.tenmon}</h3>
                                            <p className="text-gray-600">{formatCurrency(item.gia)}</p>
                                            <div className="flex items-center mt-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.mamon, item.soluong - 1)} disabled={item.soluong <= 1}>
                                                    <MinusCircle size={20} />
                                                </Button>
                                                <span className="mx-2 text-lg font-medium">{item.soluong}</span>
                                                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.mamon, item.soluong + 1)}>
                                                    <PlusCircle size={20} />
                                                </Button>
                                                <span className="ml-4 text-lg font-bold text-yellow-600">{formatCurrency(item.soluong * item.gia)}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.mamon)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={24} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tổng tiền món ăn ({getTotalItems()} món):</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí giao hàng:</span>
                                    <span>{formatCurrency(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-4 mt-4">
                                    <span>Tổng cộng:</span>
                                    <span className="text-yellow-600">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>
                            <div className="mt-8 space-y-4">
                                <Button 
                                    onClick={handleProceedToCheckout} 
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition duration-300"
                                >
                                    Tiến hành đặt hàng
                                </Button>
                                <Link to="/menu" className="block text-center w-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-3 rounded-md transition duration-300">
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserPageLayout>
    );
};

export default Cart;