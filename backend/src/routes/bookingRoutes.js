import express from 'express';
import { verifyToken, adminOnly, optionalAuth, employeeOrAdmin } from '../middleware/authMiddleware.js';
import { 
    createBooking, 
    getBookingById, 
    updateBooking, 
    deleteBooking, 
    getUserBookings,
    getAllBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';

const router = express.Router();

// @desc    Lấy tất cả các đặt bàn (Admin/Employee)
// @route   GET /api/bookings
// @access  Private/Admin/Employee
router.get('/', verifyToken, employeeOrAdmin, getAllBookings);

// @desc    Lấy tất cả các đặt bàn của một người dùng
// @route   GET /api/bookings/mybookings
// @access  Private (User)
router.get('/mybookings', verifyToken, getUserBookings);

// @desc    Tạo đặt bàn mới
// @route   POST /api/bookings
// @access  Public/Private
router.post('/', optionalAuth, createBooking);

// @desc    Cập nhật trạng thái đặt bàn (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
router.put('/:id/status', verifyToken, employeeOrAdmin, updateBookingStatus);

// @desc    Lấy đặt bàn theo ID
// @route   GET /api/bookings/:id
// @access  Private (User/Admin)
router.get('/:id', verifyToken, getBookingById);

// @desc    Cập nhật đặt bàn
// @route   PUT /api/bookings/:id
// @access  Private (User/Admin)
router.put('/:id', verifyToken, updateBooking);

// @desc    Xóa đặt bàn
// @route   DELETE /api/bookings/:id
// @access  Private (User/Admin)
router.delete('/:id', verifyToken, deleteBooking);

export default router;
