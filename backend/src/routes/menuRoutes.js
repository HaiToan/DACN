// backend/src/routes/menuRoutes.js
import express from 'express';
import { getAllMenuItems, getAllCategories, searchMenuItems, deleteMenuItem, updateMenuItem, createMenuItem } from '../controllers/menuController.js';
// Import verifyToken and admin middleware
import { verifyToken, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Tìm kiếm món ăn
// @route   GET /api/menu/search?q=:keyword
// @access  Public
router.get('/search', searchMenuItems);

// @desc    Lấy tất cả danh mục (loại món)
// @route   GET /api/menu/categories
// @access  Public
router.get('/categories', getAllCategories);

// @desc    Lấy tất cả món ăn từ database
// @route   GET /api/menu/
// @access  Public
router.get('/', getAllMenuItems);

// @desc    Tạo món ăn mới
// @route   POST /api/menu
// @access  Admin
router.post('/', verifyToken, admin, createMenuItem); // Updated middleware usage

// @desc    Xóa một món ăn
// @route   DELETE /api/menu/:id
// @access  Admin
router.delete('/:id', verifyToken, admin, deleteMenuItem); // Updated middleware usage

// @desc    Cập nhật một món ăn
// @route   PUT /api/menu/:id
// @access  Admin
router.put('/:id', verifyToken, admin, updateMenuItem); // Updated middleware usage

// Các routes khác cho menu (thêm) sẽ được thêm ở đây

export default router;
