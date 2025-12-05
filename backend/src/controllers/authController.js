// backend/src/controllers/authController.js
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto'; // Thêm để tạo mật khẩu ngẫu nhiên
import transporter from '../config/mailer.js'; // Thêm để gửi email

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key'; // Fallback for secret key

// Function to register a new user
export const register = async (req, res) => {
    const { tendangnhap, matkhau, email, hoten, sodienthoai, diachi } = req.body;

    if (!tendangnhap || !matkhau || !email || !hoten) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (Tên đăng nhập, Mật khẩu, Email, Họ và tên).' });
    }

    // Add password strength validation
    const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!isStrongPassword.test(matkhau)) {
        return res.status(400).json({ message: 'Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một chữ cái và một số.' });
    }


    try {
        // Check if user already exists in tai_khoan
        const userExists = await pool.query('SELECT * FROM tai_khoan WHERE tendangnhap = $1 OR email = $2', [tendangnhap, email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(matkhau, salt);

        // Start a transaction to ensure both inserts are successful or rolled back
        await pool.query('BEGIN');

        // Insert new user into tai_khoan with 'KhachHang' role by default
        const newUserAccount = await pool.query(
            'INSERT INTO tai_khoan (tendangnhap, matkhau, email, vaitro) VALUES ($1, $2, $3, $4) RETURNING matk, tendangnhap, email, vaitro',
            [tendangnhap, hashedPassword, email, 'KhachHang']
        );
        const matk = newUserAccount.rows[0].matk;

        // Insert into khach_hang
        await pool.query(
            'INSERT INTO khach_hang (hoten, sdt, diachi, email, matk) VALUES ($1, $2, $3, $4, $5)',
            [hoten, sodienthoai || null, diachi || null, email, matk] // sodienthoai and diachi can be null
        );

        await pool.query('COMMIT');

        // Generate JWT token for immediate login
        const token = jwt.sign(
            {
                userId: matk,
                role: 'KhachHang'
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(201).json({
            message: 'Đăng ký thành công!',
            token,
            role: 'KhachHang',
            username: tendangnhap,
            hoten: hoten, // Add full name to the registration response
            maTK: matk
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// Function to log in a user
export const login = async (req, res) => {
    const { usernameOrEmail, matkhau } = req.body;

    if (!usernameOrEmail || !matkhau) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
    }

    try {
        // Find the user by username or email and get their full name by joining tables
        const userResult = await pool.query(
            `SELECT 
                tk.matk, tk.tendangnhap, tk.matkhau, tk.vaitro,
                kh.hoten 
             FROM tai_khoan tk
             LEFT JOIN khach_hang kh ON tk.matk = kh.matk
             WHERE tk.tendangnhap = $1 OR tk.email = $1`,
            [usernameOrEmail] // Use usernameOrEmail here
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
        }

        const user = userResult.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(matkhau, user.matkhau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
        }

        // Create a JWT
        const token = jwt.sign(
            {
                userId: user.matk,
                role: user.vaitro
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the token and user details back to the client
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token,
            role: user.vaitro,
            username: user.tendangnhap,
            hoten: user.hoten, // Include the user's full name
            maTK: user.matk
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// Function to handle forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Vui lòng cung cấp email của bạn.' });
    }

    try {
        // Find user by email
        const userResult = await pool.query('SELECT * FROM tai_khoan WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // To prevent user enumeration, we send a generic success message even if the email is not found.
            // The message implies an email will be sent if the account exists.
            return res.status(200).json({ message: 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một mật khẩu mới.' });
        }

        const user = userResult.rows[0];

        // Generate a new random password
        const newPassword = crypto.randomBytes(6).toString('hex'); // Creates a 12-character hex string

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        await pool.query('UPDATE tai_khoan SET matkhau = $1 WHERE matk = $2', [hashedPassword, user.matk]);

        // Prepare email content
        const mailOptions = {
            from: `"Beef Bistro" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Khôi Phục Mật Khẩu Mới Cho Tài Khoản Beef Bistro Của Bạn',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Chào bạn ${user.tendangnhap},</h2>
                    <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn tại Beef Bistro.</p>
                    <p>Đây là mật khẩu mới của bạn. Vui lòng sử dụng mật khẩu này để đăng nhập và đổi lại mật khẩu để đảm bảo an toàn.</p>
                    <p style="font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #d9534f;">${newPassword}</p>
                    <p>Nếu bạn không yêu cầu việc này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi.</p>
                    <p>Trân trọng,<br>Đội ngũ Beef Bistro</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        // Respond to the user
        res.status(200).json({ message: 'Nếu email của bạn tồn tại trong hệ thống, bạn sẽ nhận được một mật khẩu mới.' });

    } catch (error) {
        console.error('Lỗi trong quá trình quên mật khẩu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ khi cố gắng đặt lại mật khẩu của bạn.' });
    }
};
