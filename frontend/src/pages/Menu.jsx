import React from 'react';

const Menu = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">Thực đơn BEEF BISTRO</h2>
      {/* Danh sách món ăn sẽ render ở đây */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Ví dụ món ăn */}
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
          <h3 className="font-semibold text-lg mb-2">Bò sốt tiêu đen</h3>
          <p className="text-gray-600 mb-2">Thịt bò tươi, sốt tiêu đen đặc biệt</p>
          <span className="text-orange-600 font-bold">180.000đ</span>
          <button className="mt-3 w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Thêm vào giỏ</button>
        </div>
        {/* Thêm các món khác ở đây */}
      </div>
    </div>
  );
};

export default Menu;
