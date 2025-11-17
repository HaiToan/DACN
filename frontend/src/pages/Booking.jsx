import React from 'react';

const Booking = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Đặt bàn</h2>
      {/* Form đặt bàn */}
      <form className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto space-y-4">
        <input type="text" placeholder="Tên khách hàng" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="text" placeholder="Số điện thoại" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="date" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="time" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Gửi yêu cầu đặt bàn</button>
      </form>
    </div>
  );
};

export default Booking;
