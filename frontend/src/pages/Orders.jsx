import React from 'react';

const Orders = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Quản lý đơn hàng</h2>
      {/* Danh sách đơn hàng sẽ render ở đây */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chưa có đơn hàng nào.</p>
        {/* Khi có đơn sẽ render danh sách và trạng thái */}
      </div>
    </div>
  );
};

export default Orders;
