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
import { verifyToken, admin } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Áp dụng middleware cho tất cả các route trong file này
router.use(verifyToken, admin);

router.route("/users").get(getUsers);
router.route("/users/:id").delete(deleteUser).put(updateUser);

// Booking management routes for admin
router.route("/bookings").get(getAllBookings); // Get all bookings
router.route("/bookings/:id").put(updateBookingByAdmin).delete(deleteBookingByAdmin); // Update/Delete a specific booking

// Order management routes for admin
router.route("/orders").get(getAllOrders);
router.route("/orders/:madh").delete(deleteOrder);
router.route("/orders/:madh/status").put(updateOrderStatus);

export default router;
