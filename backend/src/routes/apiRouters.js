// routes/apiRouter.js

import express from 'express';
const router = express.Router();

// Import các router cụ thể
import menuRoutes from './menuRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import orderRoutes from './orderRoutes.js';
import bookingRoutes from './bookingRoutes.js'; // Import bookingRoutes
import cartRoutes from './cartRoutes.js'; // Import cartRoutes

// Sử dụng các router
router.use('/menu', menuRoutes); // Định tuyến sẽ là /api/menu
router.use('/auth', authRoutes); // Định tuyến sẽ là /api/auth
router.use('/user', userRoutes); // Định tuyến sẽ là /api/user
router.use('/admin', adminRoutes); // Định tuyến sẽ là /api/admin
router.use('/orders', orderRoutes); // Định tuyến sẽ là /api/orders
router.use('/bookings', bookingRoutes); // Định tuyến sẽ là /api/bookings
router.use('/cart', cartRoutes); // Định tuyến sẽ là /api/cart

export default router;