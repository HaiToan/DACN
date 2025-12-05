import { pool } from "../config/db.js"; // Sử dụng named import { pool }
import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder as deleteOrderFromController,
} from "./orderController.js";


/**
 * @desc    Lấy tất cả người dùng
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const { rows: users } = await pool.query(
      "SELECT matk, tendangnhap, email, vaitro FROM tai_khoan ORDER BY matk ASC"
    );
    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * @desc    Xóa một người dùng
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // Kiểm tra xem người dùng có tồn tại không
    const userResult = await client.query(
      "SELECT * FROM tai_khoan WHERE matk = $1",
      [id]
    );
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Xóa các bản ghi liên quan trong nhan_vien (nếu có)
    await client.query("DELETE FROM nhan_vien WHERE matk = $1", [id]);

    // Xóa các bản ghi liên quan trong khach_hang (nếu có)
    await client.query("DELETE FROM khach_hang WHERE matk = $1", [id]);

    // Thực hiện xóa từ tai_khoan
    await client.query("DELETE FROM tai_khoan WHERE matk = $1", [id]);

    await client.query('COMMIT');

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  } finally {
    client.release();
  }
};

/**
 * @desc    Cập nhật thông tin người dùng (tendangnhap, email, vai trò)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tendangnhap, email, vaitro } = req.body;

    const fieldsToUpdate = [];
    const values = [];
    let queryIndex = 1;

    // Validate and add tendangnhap to update
    if (tendangnhap !== undefined) {
      if (typeof tendangnhap !== 'string' || tendangnhap.trim() === '') {
        return res.status(400).json({ message: "Tên đăng nhập không hợp lệ." });
      }
      fieldsToUpdate.push(`tendangnhap = $${queryIndex++}`);
      values.push(tendangnhap);
    }

    // Validate and add email to update
    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }
      fieldsToUpdate.push(`email = $${queryIndex++}`);
      values.push(email);
    }

    // Validate and add vaitro to update
    if (vaitro !== undefined) {
      if (typeof vaitro !== 'string' || (vaitro !== "Admin" && vaitro !== "NhanVien" && vaitro !== "KhachHang")) {
        return res.status(400).json({ message: "Vai trò không hợp lệ." });
      }
      fieldsToUpdate.push(`vaitro = $${queryIndex++}`);
      values.push(vaitro);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "Không có trường nào để cập nhật." });
    }

    values.push(id); // Add user ID to the end of values for WHERE clause

    const updateQuery = `UPDATE tai_khoan SET ${fieldsToUpdate.join(', ')} WHERE matk = $${queryIndex} RETURNING matk, tendangnhap, email, vaitro`;

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật." });
    }

    res.json({
      message: "Cập nhật thông tin người dùng thành công",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// @desc    Get all bookings (for admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const { rows: bookings } = await pool.query(
            `SELECT
                db.MaDatBan,
                db.TenKH,
                db.sdt,
                db.ngaydatban,
                db.giodatban,
                db.songuoi,
                db.ghichu,
                db.trangthai
            FROM dat_ban db
            ORDER BY db.ngaydatban DESC, db.giodatban DESC`
        );
        res.json(bookings);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt bàn:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// @desc    Update a booking by admin
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBookingByAdmin = async (req, res) => {
    const { id } = req.params;
    const { ngaydatban, giodatban, songuoi, TenKH, sdt, ghichu, trangthai } = req.body;

    try {
        const bookingExists = await pool.query('SELECT * FROM dat_ban WHERE MaDatBan = $1', [id]);
        if (bookingExists.rows.length === 0) {
            return res.status(404).json({ message: 'Đặt bàn không tồn tại.' });
        }

        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (ngaydatban !== undefined) {
            fields.push(`ngaydatban = $${queryIndex++}`);
            values.push(ngaydatban);
        }
        if (giodatban !== undefined) {
            fields.push(`giodatban = $${queryIndex++}`);
            values.push(giodatban);
        }
        if (songuoi !== undefined) {
            fields.push(`songuoi = $${queryIndex++}`);
            values.push(songuoi);
        }
        if (TenKH !== undefined) {
            fields.push(`TenKH = $${queryIndex++}`);
            values.push(TenKH);
        }
        if (sdt !== undefined) {
            fields.push(`sdt = $${queryIndex++}`);
            values.push(sdt);
        }
        if (ghichu !== undefined) {
            fields.push(`ghichu = $${queryIndex++}`);
            values.push(ghichu);
        }
        if (trangthai !== undefined) {
            fields.push(`trangthai = $${queryIndex++}`);
            values.push(trangthai);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Không có trường nào để cập nhật.' });
        }

        values.push(id);

        const updateQuery = `UPDATE dat_ban SET ${fields.join(', ')} WHERE MaDatBan = $${queryIndex} RETURNING *`;
        const updatedBooking = await pool.query(updateQuery, values);

        res.status(200).json({
            message: `Đặt bàn với ID ${id} đã được cập nhật thành công.`,
            booking: updatedBooking.rows[0]
        });

    } catch (error) {
        console.error('Error during admin booking update:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// @desc    Delete a booking by admin
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
const deleteBookingByAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const bookingExists = await pool.query('SELECT * FROM dat_ban WHERE madb = $1', [id]);
        if (bookingExists.rows.length === 0) {
            return res.status(404).json({ message: 'Đặt bàn không tồn tại.' });
        }

        await pool.query('DELETE FROM dat_ban WHERE madb = $1', [id]);

        res.status(200).json({ message: `Đặt bàn với ID ${id} đã được xóa thành công.` });

    } catch (error) {
        console.error('Error during admin booking deletion:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};
const deleteOrder = deleteOrderFromController;
export {
    getUsers,
    deleteUser,
    updateUser,
    getAllBookings,
    updateBookingByAdmin,
    deleteBookingByAdmin,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
};