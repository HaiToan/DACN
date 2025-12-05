import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [deliveryFee] = useState(30000);
  const [formData, setFormData] = useState({
    tennguoinhan: "",
    sdtnguoinhan: "",
    diachigiaohang: "",
    phuongthuctt: "COD",
    ghichu: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // New state variable

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [cartItems.length, navigate, orderPlaced]); // Added missing closing brace and dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const subtotal = getCartTotal();
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !formData.tennguoinhan ||
      !formData.sdtnguoinhan ||
      !formData.diachigiaohang
    ) {
      setError(
        "Vui lòng điền đầy đủ thông tin người nhận và địa chỉ giao hàng."
      );
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để đặt hàng.");
      setLoading(false);
      navigate("/auth");
      return;
    }

    try {
      const orderData = {
        ...formData,
        phigiaohang: deliveryFee,
        tongtienmonan: subtotal,
        tongthanhtoan: totalAmount,
      };

      const response = await axios.post(
        "http://localhost:3001/api/orders/place-order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Current cartItems:", cartItems); // Debugging cartItems
        const firstItemImage = cartItems.length > 0 ? cartItems[0].anhmon : null;
        console.log("First item image URL:", firstItemImage); // Debugging firstItemImage

        setOrderDetails({
          ...formData, // Include recipient details from form data
          madh: response.data.madh, // Get order ID from backend response
          tongthanhtoan: totalAmount, // Use calculated total amount
          itemImage: firstItemImage, // Store image of the first item
        });
        setOrderPlaced(true);
        clearCart();
        await fetchCart();
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi đặt hàng.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24 flex flex-col items-center justify-center min-h-[calc(100vh-theme(space.24)-theme(space.20))]">
          <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader className="bg-green-50 p-6 rounded-t-lg">
              <CardTitle className="text-4xl font-bold text-green-700 mb-2 font-serif">
                Đặt hàng thành công!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {orderDetails && (
                <div className="text-left space-y-2 mb-6">
                  <p className="text-md text-gray-800">
                    <span className="font-semibold">Mã đơn hàng:</span>{" "}
                    {orderDetails.madh}
                  </p>
                  <p className="text-md text-gray-800">
                    <span className="font-semibold">Người nhận:</span>{" "}
                    {orderDetails.tennguoinhan}
                  </p>
                  <p className="text-md text-gray-800">
                    <span className="font-semibold">SĐT người nhận:</span>{" "}
                    {orderDetails.sdtnguoinhan}
                  </p>
                  <p className="text-md text-gray-800">
                    <span className="font-semibold">Địa chỉ giao hàng:</span>{" "}
                    {orderDetails.diachigiaohang}
                  </p>
                  <p className="text-md text-gray-800">
                    <span className="font-semibold">Tổng thanh toán:</span>{" "}
                    {formatCurrency(orderDetails.tongthanhtoan)}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Link
                  to="/order-history"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Xem đơn hàng
                </Link>
                <Link
                  to="/menu"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full transition duration-300"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 font-serif">
          Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Thông tin giao hàng
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="tennguoinhan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên người nhận
                </label>
                <Input
                  type="text"
                  id="tennguoinhan"
                  name="tennguoinhan"
                  value={formData.tennguoinhan}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người nhận hàng"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="sdtnguoinhan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  id="sdtnguoinhan"
                  name="sdtnguoinhan"
                  value={formData.sdtnguoinhan}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="diachigiaohang"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ giao hàng
                </label>
                <Input
                  type="text"
                  id="diachigiaohang"
                  name="diachigiaohang"
                  value={formData.diachigiaohang}
                  onChange={handleInputChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="ghichu"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú (Tùy chọn)
                </label>
                <textarea
                  id="ghichu"
                  name="ghichu"
                  value={formData.ghichu}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Yêu cầu đặc biệt, thời gian giao hàng mong muốn..."
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                ></textarea>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                Phương thức thanh toán
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="phuongthuctt"
                    value="COD"
                    checked={formData.phuongthuctt === "COD"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <label
                    htmlFor="cod"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                {/* Add other payment methods here if needed */}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.mamon}
                  className="flex justify-between text-gray-700"
                >
                  <span>
                    {item.tenmon} x {item.soluong}
                  </span>
                  <span>{formatCurrency(item.soluong * item.gia)}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-700 border-t pt-3">
                <span>Tổng tiền món ăn:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí giao hàng:</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-4 mt-4">
                <span>Tổng cộng:</span>
                <span className="text-yellow-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="mt-8">
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition duration-300"
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
