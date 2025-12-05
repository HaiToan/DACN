// backend/src/controllers/userController.js
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log('getProfile called for userId:', userId, 'role:', userRole);

    try {
        // Start by getting basic account info
        const accountResult = await pool.query(
            'SELECT matk, tendangnhap, email, vaitro FROM tai_khoan WHERE matk = $1',
            [userId]
        );
        console.log('Account query result:', accountResult.rows);

        if (accountResult.rows.length === 0) {
            console.log('getProfile: No account found for userId', userId);
            return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng.' });
        }

        let userProfile = { ...accountResult.rows[0] }; // Start with basic account info

        // If it's a customer, fetch additional details from khach_hang
        if (userRole === 'KhachHang') {
            const customerResult = await pool.query(
                'SELECT hoten, sdt, diachi FROM khach_hang WHERE matk = $1',
                [userId]
            );
            console.log('Customer query result:', customerResult.rows);
            if (customerResult.rows.length > 0) {
                userProfile = { ...userProfile, ...customerResult.rows[0] };
            }
        } else if (userRole === 'NhanVien' || userRole === 'Admin') {
            const employeeResult = await pool.query(
                'SELECT hoten, sdt FROM nhan_vien WHERE matk = $1',
                [userId]
            );
            console.log('Employee query result:', employeeResult.rows);
            if (employeeResult.rows.length > 0) {
                userProfile = { ...userProfile, ...employeeResult.rows[0] };
            }
        }
        
        // Ensure common fields expected by frontend are present, even if null
        userProfile.hoten = userProfile.hoten || userProfile.tendangnhap; // Fallback to username for display
        userProfile.sdt = userProfile.sdt || null;
        userProfile.diachi = userProfile.diachi || null;

        console.log('getProfile returning userProfile:', userProfile);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.status(200).json(userProfile);

    } catch (error) {
        console.error('Lỗi khi lấy thông tin cá nhân:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.', details: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { hoten, sdt, diachi } = req.body;

    if (!hoten || !sdt || !diachi) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: họ tên, số điện thoại và địa chỉ.' });
    }

    // Only allow customers to update these specific profile fields
    if (userRole !== 'KhachHang') {
        return res.status(403).json({ message: 'Bạn không có quyền cập nhật thông tin cá nhân này.' });
    }

    try {
        const updatedProfile = await pool.query(
            'UPDATE khach_hang SET hoten = $1, sdt = $2, diachi = $3 WHERE matk = $4 RETURNING hoten, sdt, diachi',
            [hoten, sdt, diachi, userId]
        );

        if (updatedProfile.rows.length === 0) {
            // This might happen if a customer account doesn't have a khach_hang entry (e.g., deleted or misconfigured)
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng để cập nhật.' });
        }

        res.status(200).json({
            message: 'Cập nhật thông tin cá nhân thành công!',
            user: updatedProfile.rows[0],
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};


// Function to change a user's password
export const changePassword = async (req, res) => {
    const userId = req.user.id; // Injected by the 'protect' middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    try {
        // Get the current user from the database
        const userResult = await pool.query('SELECT * FROM tai_khoan WHERE matk = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const user = userResult.rows[0];

        // Compare the provided old password with the stored hash
        const isMatch = await bcrypt.compare(oldPassword, user.matkhau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu cũ không chính xác.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        await pool.query('UPDATE tai_khoan SET matkhau = $1 WHERE matk = $2', [hashedNewPassword, userId]);

        res.status(200).json({ message: 'Đổi mật khẩu thành công!' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};
