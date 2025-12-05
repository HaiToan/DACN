// frontend/src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal"; // Import Modal component

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State for modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserRole, setNewUserRole] = useState("");
  const [editedUsername, setEditedUsername] = useState(""); // New state
  const [editedEmail, setEditedEmail] = useState("");     // New state

  // State for generic message modal
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");
  const [messageModalType, setMessageModalType] = useState("info"); // 'info', 'success', 'error'

  const showMessageModal = (content, type = "info") => {
    setMessageModalContent(content);
    setMessageModalType(type);
    setIsMessageModalOpen(true);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        // Token het han hoac khong hop le
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        navigate("/auth?message=session-expired", { replace: true });
        return;
      }

      if (!response.ok) throw new Error("Khong the tai danh sach nguoi dung.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Edit Logic ---
  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewUserRole(user.vaitro);
    setEditedUsername(user.tendangnhap); // Initialize edited username
    setEditedEmail(user.email);         // Initialize edited email
    setIsEditModalOpen(true);
  };

  const handleSaveUserChanges = async () => { // Renamed function
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/admin/users/${selectedUser.matk}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tendangnhap: editedUsername, // Send updated username
            email: editedEmail,         // Send updated email
            vaitro: newUserRole
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Cập nhật người dùng thất bại."); // Updated message
      }

      // Update user in the local state
      setUsers(
        users.map((u) =>
          u.matk === selectedUser.matk
            ? { ...u, vaitro: newUserRole, tendangnhap: editedUsername, email: editedEmail } // Update all fields
            : u
        )
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditedUsername(""); // Clear state
      setEditedEmail("");     // Clear state
      showMessageModal("Cập nhật người dùng thành công!", "success"); // Updated message
    } catch (err) {
      showMessageModal(`Lỗi: ${err.message}`, "error");
    }
  };

  // --- Delete Logic ---
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/admin/users/${selectedUser.matk}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Xóa người dùng thất bại.");
      }

      // Cập nhật lại danh sách người dùng trên giao diện
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.matk !== selectedUser.matk)
      );
      showMessageModal("Xóa người dùng thành công!", "success");
    } catch (err) {
      setError(err.message);
      showMessageModal(`Lỗi: ${err.message}`, "error");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên đăng nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.matk}>
                <td className="px-6 py-4 whitespace-nowrap">{user.matk}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {user.tendangnhap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.vaitro === "Admin"
                        ? "bg-blue-100 text-blue-800"
                        : user.vaitro === "NhanVien"
                        ? "bg-green-100 text-green-800"
                        : user.vaitro === "KhachHang"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800" // Default for any other role
                    }`}
                  >
                    {user.vaitro}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận Xóa Người Dùng"
        type="confirm"
      >
        <p>
          Bạn có chắc chắn muốn xóa người dùng{" "}
          <strong>{selectedUser?.tendangnhap}</strong> không?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Chỉnh sửa thông tin người dùng ${selectedUser?.tendangnhap}`}
      >
        <div>
          <div className="mb-4">
            <label
              htmlFor="edit-username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="edit-username"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Vai trò
            </label>
            <select
              id="role-select"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="KhachHang">KhachHang</option>
              <option value="NhanVien">NhanVien</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveUserChanges}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>

      {/* Generic Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={
          messageModalType === "success"
            ? "Thành công!"
            : messageModalType === "error"
            ? "Lỗi!"
            : "Thông báo"
        }
      >
        <p>{messageModalContent}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsMessageModalOpen(false)}
            className={`px-4 py-2 rounded transition ${
              messageModalType === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
