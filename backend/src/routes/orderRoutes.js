import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

// Place a new order from the cart
router.post('/place-order', authMiddleware.verifyToken, orderController.placeOrder);

// Get a user's orders
router.get('/', authMiddleware.verifyToken, orderController.getUserOrders);


// Get details of a specific order
router.get('/:madh', authMiddleware.verifyToken, orderController.getOrderDetails);

export default router;