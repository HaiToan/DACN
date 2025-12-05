// backend/src/routes/userRoutes.js
import express from 'express';
import { changePassword, getProfile, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Updated import

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', verifyToken, getProfile); // Updated middleware usage

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', verifyToken, updateProfile); // Updated middleware usage


// Route for changing password
// This is a PUT request because we are updating the user's password
// The 'verifyToken' middleware ensures that only a logged-in user can access this
router.put('/password', verifyToken, changePassword); // Updated middleware usage

export default router;
