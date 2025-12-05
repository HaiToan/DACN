import React from "react";
import { X, AlertTriangle } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  type = "info",
}) => {
  if (!isOpen) return null;

  const isConfirmType = type === "confirm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            {isConfirmType && <AlertTriangle className="text-red-500 mr-2" />}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {isConfirmType && (
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Xác nhận Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
