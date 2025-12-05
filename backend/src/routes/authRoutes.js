// backend/src/routes/authRoutes.js
import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

export default router;
