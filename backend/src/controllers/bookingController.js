// backend/src/controllers/bookingController.js
import { pool } from '../config/db.js';

// @desc    Tạo một đặt bàn mới
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    const { ngayDat, gioDat, soNguoi, ghiChu, tenKH, sdt } = req.body;
    const userId = req.user?.id; 

    if (!ngayDat || !gioDat || !soNguoi || !tenKH || !sdt) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đặt bàn.' });
    }

    try {
        let maKH = null;
        if (userId) {
            const userResult = await pool.query('SELECT makh FROM khach_hang WHERE matk = $1', [userId]);
            if (userResult.rows.length > 0) {
                maKH = userResult.rows[0].makh;
            }
        }
        
        // --- Logic tạo MaDatBan mới (an toàn hơn) ---
        // Chỉ tìm số lớn nhất từ các mã có định dạng 'DB' + số
        const queryText = "SELECT MAX(CAST(SUBSTRING(madatban FROM 3) AS INTEGER)) as max_num FROM dat_ban WHERE madatban ~ '^DB[0-9]+$'";
        const result = await pool.query(queryText);
        
        let newIdNumber = 1;
        if (result.rows.length > 0 && result.rows[0].max_num) {
            newIdNumber = result.rows[0].max_num + 1;
        }
        const maDatBan = 'DB' + newIdNumber.toString().padStart(3, '0');
        // --- Kết thúc logic tạo MaDatBan ---

        const trangThai = 'Chờ xác nhận';

        const query = `
            INSERT INTO dat_ban (madatban, makh, ngaydatban, giodatban, songuoi, trangthai, tenkh, sdt, ghichu)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        
        const values = [maDatBan, maKH, ngayDat, gioDat, soNguoi, trangThai, tenKH, sdt, ghiChu];
        
        const newBooking = await pool.query(query, values);

        const io = req.app.get('io');
        io.emit('newBooking', newBooking.rows[0]);

        res.status(201).json(newBooking.rows[0]);
    } catch (error) {
        console.error('Lỗi khi tạo đặt bàn:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// @desc    Lấy tất cả các đặt bàn của người dùng hiện tại
// @route   GET /api/bookings/mybookings
// @access  Private
export const getUserBookings = async (req, res) => {
    const userId = req.user.id;

    try {
        const userResult = await pool.query('SELECT makh FROM khach_hang WHERE matk = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(200).json([]);
        }
        const maKH = userResult.rows[0].makh;

        const bookings = await pool.query('SELECT * FROM dat_ban WHERE makh = $1 ORDER BY ngaydatban DESC, giodatban DESC', [maKH]);
        
        res.status(200).json(bookings.rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đặt bàn:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// @desc    Lấy tất cả các đặt bàn (cho Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await pool.query('SELECT * FROM dat_ban ORDER BY ngaydatban DESC, giodatban DESC');
        res.status(200).json(bookings.rows);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả đặt bàn:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// @desc    Cập nhật trạng thái đặt bàn (cho Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { trangthai } = req.body;
    const adminUserId = req.user.id; // Đây là MaTK của admin

    if (!trangthai) {
        return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới.' });
    }

    try {
        const adminInfo = await pool.query('SELECT manv FROM nhan_vien WHERE matk = $1', [adminUserId]);
        if (adminInfo.rows.length === 0) {
            return res.status(403).json({ message: 'Không tìm thấy thông tin nhân viên cho tài khoản admin này.' });
        }
        const maNVXacNhan = adminInfo.rows[0].manv;

        const result = await pool.query(
            'UPDATE dat_ban SET trangthai = $1, manvxacnhan = $2 WHERE madatban = $3 RETURNING *',
            [trangthai, maNVXacNhan, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đặt bàn với ID này.' });
        }

        const updatedBooking = result.rows[0];
        const io = req.app.get('io');

        io.emit('bookingStatusUpdate', updatedBooking);

        if (updatedBooking.makh) {
            const userAccount = await pool.query('SELECT matk FROM khach_hang WHERE makh = $1', [updatedBooking.makh]);
            if (userAccount.rows.length > 0) {
                const userSocketId = userAccount.rows[0].matk;
                io.to(userSocketId).emit('bookingStatusUpdate', updatedBooking);
            }
        }
        
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đặt bàn:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

export const getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await pool.query('SELECT * FROM dat_ban WHERE madatban = $1', [id]);
        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
        }
        res.status(200).json(booking.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

export const updateBooking = async (req, res) => {
    res.status(501).json({ message: 'Chức năng chưa được cài đặt' });
};

export const deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM dat_ban WHERE madatban = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đặt bàn để xóa' });
        }
        res.status(200).json({ message: 'Xóa đặt bàn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
