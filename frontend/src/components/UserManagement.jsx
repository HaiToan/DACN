import React, { useState, useEffect } from "react";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const response = await fetch("http://localhost:3001/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.message || "Không thể tải danh sách người dùng."
          );
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi tải người dùng:", error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleEdit = (userId) => {
    // Chức năng này cần một trang/modal chỉnh sửa riêng
    console.log(`Chỉnh sửa người dùng với ID: ${userId}`);
    alert("Chức năng chỉnh sửa đang được phát triển.");
    // Ví dụ: navigate(`/admin/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          alert("Xóa người dùng thành công!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Xóa người dùng thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert(`Lỗi: ${error.message}`);
      }
    }
  };

  if (error) {
    return <div className="text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.hoten || user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-900 transition"
                    title="Xóa"
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
  );
};

export default UserManagement;
