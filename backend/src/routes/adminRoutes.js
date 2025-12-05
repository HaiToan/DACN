import express from "express";
import {
    getUsers,
    deleteUser,
    updateUser,
    getAllBookings,
    updateBookingByAdmin,
    deleteBookingByAdmin,
    getAllOrders,
    deleteOrder,
    updateOrderStatus,
} from "../controllers/adminController.js";
import { verifyToken, adminOnly, employeeOrAdmin } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Áp dụng middleware cho tất cả các route trong file này
router.use(verifyToken); // Verify token for all admin routes, then apply specific role checks

// User management routes (Admin Only)
router.route("/users").get(adminOnly, getUsers);
router.route("/users/:id").delete(adminOnly, deleteUser).put(adminOnly, updateUser);

// Booking management routes (Employee or Admin)
router.route("/bookings").get(employeeOrAdmin, getAllBookings); // Get all bookings
router.route("/bookings/:id").put(employeeOrAdmin, updateBookingByAdmin).delete(employeeOrAdmin, deleteBookingByAdmin); // Update/Delete a specific booking

// Order management routes (Employee or Admin)
router.route("/orders").get(employeeOrAdmin, getAllOrders);
router.route("/orders/:madh").delete(employeeOrAdmin, deleteOrder);
router.route("/orders/:madh/status").put(employeeOrAdmin, updateOrderStatus);

export default router;
