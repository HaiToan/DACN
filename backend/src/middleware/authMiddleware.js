// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

// Middleware to verify JWT and check if user is logged in
export const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = { id: decoded.userId, role: decoded.role };
            return next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token.' });
    }
};

// Middleware for optional authentication
export const optionalAuth = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = { id: decoded.userId, role: decoded.role };
        } catch (error) {
            // Invalid token, treat as unauthenticated user.
            // Don't throw an error, just proceed.
            console.warn('Optional auth: Invalid token provided. Proceeding as guest.');
        }
    }
    
    next(); // Always proceed
};


// Middleware to check if the user is an admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu vai trò Admin.' });
    }
};

// Middleware to check if the user is an employee or admin
export const employeeOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'NhanVien' || req.user.role === 'Admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu vai trò Nhân Viên hoặc Admin.' });
    }
};
