import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different port

    const getToken = () => localStorage.getItem('token'); // Assuming token is stored in localStorage
    const getUserRole = () => localStorage.getItem('userRole'); // Assuming role is stored in localStorage

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const userRole = getUserRole(); // Get user role from localStorage
            console.log('Fetching cart: Token', token ? 'Present' : 'Missing', 'User Role:', userRole);

            if (!token || userRole !== 'KhachHang') {
                // If no token, or user is not a customer, don't fetch cart
                setCartItems([]);
                setCartId(null);
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const cartData = response.data;
            const formattedCartItems = cartData.items.map(item => ({
                ...item,
                gia: parseFloat(item.gia), // Ensure price is a float
            }));
            setCartItems(formattedCartItems);
            setCartId(cartData.cartId);
        } catch (err) {
            console.error('Error fetching cart:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    if (err.response.data && err.response.data.message.includes('token không hợp lệ')) {
                        setError('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
                        // Optionally, trigger a logout or redirect to login page here
                    } else if (err.response.data && err.response.data.message.includes('không tìm thấy token')) {
                        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem giỏ hàng.');
                    } else {
                        setError('Không có quyền truy cập giỏ hàng. Vui lòng đăng nhập lại.');
                    }
                } else if (err.response.status === 403 && err.response.data &&
                    (err.response.data.message === 'Cart functionality is only available for customers (KhachHang).' ||
                     err.response.data.message === 'Customer not found for this account ID.')) {
                    setCartItems([]);
                    setCartId(null);
                    setError(err.response.data.message); // Set the specific 403 message
                } else {
                    setError('Failed to load cart. Please try again.');
                }
            } else {
                setError('Failed to load cart due to a network error. Please check your connection.');
            }
            setCartItems([]);
            setCartId(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (mamon, soluong = 1) => {
        try {
            const token = getToken();
            if (!token) {
                // Do not set global error for unauthenticated user, let specific components handle this.
                return { success: false, message: 'User not authenticated. Please log in to add items to cart.' };
            }
            const userRole = getUserRole();
            if (userRole !== 'KhachHang') {
                return { success: false, message: 'Only customers can add items to cart.' };
            }

            await axios.post(
                `${API_BASE_URL}/cart/add`,
                { mamon, soluong },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchCart(); // Re-fetch cart to update state
            return { success: true };
        } catch (err) {
            console.error('Error adding item to cart:', err);
            // Do not set global error here, let the calling component handle the specific message.
            return { success: false, message: err.response?.data?.message || 'Có lỗi khi thêm sản phẩm vào giỏ hàng.' };
        }
    };

    const updateItemQuantity = async (mamon, soluong) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('User not authenticated.');
            }
            await axios.put(
                `${API_BASE_URL}/cart/update`,
                { mamon, soluong },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchCart(); // Re-fetch cart to update state
            return { success: true };
        } catch (err) {
            console.error('Error updating item quantity:', err);
            setError('Failed to update item quantity.');
            return { success: false, message: err.response?.data?.message || 'Failed to update quantity.' };
        }
    };

    const removeItem = async (mamon) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('User not authenticated.');
            }
            await axios.delete(`${API_BASE_URL}/cart/remove/${mamon}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCart(); // Re-fetch cart to update state
            return { success: true };
        } catch (err) {
            console.error('Error removing item from cart:', err);
            setError('Failed to remove item from cart.');
            return { success: false, message: err.response?.data?.message || 'Failed to remove item.' };
        }
    };

    const clearCart = async () => {
        // This functionality needs a backend endpoint if we want to clear the entire cart.
        // For now, it will just clear the local state assuming a successful backend clear.
        // Or, we can iterate and call removeItem for each item.
        // Let's implement a dummy clear for now, and rely on `placeOrder` to clear the backend cart.
        setCartItems([]);
        setCartId(null);
        // If a backend endpoint for clearing cart exists, call it here:
        // try {
        //     const token = getToken();
        //     await axios.delete(`${API_BASE_URL}/cart/clear`, { headers: { Authorization: `Bearer ${token}` } });
        // } catch (err) {
        //     console.error('Error clearing cart on backend:', err);
        // }
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.soluong, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.soluong * item.gia, 0);
    };

    const value = {
        cartItems,
        cartId,
        loading,
        error,
        fetchCart,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        getTotalItems,
        getCartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};