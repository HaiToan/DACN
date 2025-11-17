import React from 'react';

const Cart = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Giỏ hàng của bạn</h2>
      {/* Danh sách món đã chọn */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chưa có món nào trong giỏ hàng.</p>
        {/* Khi có món sẽ render danh sách và nút xác nhận thanh toán */}
      </div>
    </div>
  );
};

export default Cart;
