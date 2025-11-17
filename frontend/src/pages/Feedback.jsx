import React from 'react';

const Feedback = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Đánh giá & Phản hồi</h2>
      {/* Form đánh giá */}
      <form className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto space-y-4">
        <textarea placeholder="Ý kiến của bạn..." className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" rows={4} />
        <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Gửi đánh giá</button>
      </form>
    </div>
  );
};

export default Feedback;
