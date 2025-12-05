import express from 'express';
const router = express.Router();
import * as cartController from '../controllers/cartController.mjs';
import * as authMiddleware from '../middleware/authMiddleware.js';

// Get user's cart
router.get('/', authMiddleware.verifyToken, cartController.getCart);

// Add item to cart
router.post('/add', authMiddleware.verifyToken, cartController.addItemToCart);

// Update item quantity in cart
router.put('/update', authMiddleware.verifyToken, cartController.updateCartItemQuantity);

// Remove item from cart
router.delete('/remove/:mamon', authMiddleware.verifyToken, cartController.removeCartItem);

export default router;
