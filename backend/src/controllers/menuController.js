// controllers/menuController.js

import { pool } from '../config/db.js';

// Lấy tất cả món ăn
export const getAllMenuItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                ma.*, 
                lm.tenloai 
            FROM mon_an ma
            JOIN loai_mon lm ON ma.maloai = lm.maloai
            ORDER BY ma.mamon DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message, stack: err.stack });
    }
};

// Lấy một món ăn theo ID
export const getMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM mon_an WHERE mamon = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Món ăn không tồn tại' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
    }
};

// Lấy tất cả các loại món ăn (danh mục)
export const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM loai_mon ORDER BY maloai ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
    }
};

// Tìm kiếm món ăn theo tên
export const searchMenuItems = async (req, res) => {
    const { q } = req.query; // Lấy từ khóa từ query param ?q=...
    if (!q) {
        return res.status(400).json({ error: 'Thiếu từ khóa tìm kiếm' });
    }

    try {
        // Dùng ILIKE để tìm kiếm không phân biệt hoa thường
        // LIMIT 10 để giới hạn số lượng kết quả trả về
        const result = await pool.query(
            'SELECT mamon, tenmon, gia, hinhanh FROM mon_an WHERE tenmon ILIKE $1 LIMIT 10', 
            [`%${q}%`]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server nội bộ', details: err.message });
    }
};

// Function to delete a menu item
export const deleteMenuItem = async (req, res) => {
    const { id } = req.params; // Get the menu item ID from the URL parameter

    try {
        // Check if the menu item exists
        const itemExists = await pool.query('SELECT * FROM mon_an WHERE mamon = $1', [id]);
        if (itemExists.rows.length === 0) {
            return res.status(404).json({ message: 'Món ăn không tồn tại.' });
        }

        // Delete the menu item
        await pool.query('DELETE FROM mon_an WHERE mamon = $1', [id]);

        res.status(200).json({ message: `Món ăn với ID ${id} đã được xóa thành công.` });

    } catch (error) {
        console.error('Error during menu item deletion:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// Function to update a menu item
export const updateMenuItem = async (req, res) => {
    const { id } = req.params; // Get the menu item ID from the URL parameter
    const { tenmon, mota, gia, hinhanh, maloai } = req.body; // Get updated fields from request body

    try {
        // Check if the menu item exists
        const itemExists = await pool.query('SELECT * FROM mon_an WHERE mamon = $1', [id]);
        if (itemExists.rows.length === 0) {
            return res.status(404).json({ message: 'Món ăn không tồn tại.' });
        }

        // Build the update query dynamically for partial updates
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (tenmon !== undefined) {
            fields.push(`tenmon = $${queryIndex++}`);
            values.push(tenmon);
        }
        if (mota !== undefined) {
            fields.push(`mota = $${queryIndex++}`);
            values.push(mota);
        }
        if (gia !== undefined) {
            fields.push(`gia = $${queryIndex++}`);
            values.push(gia);
        }
        if (hinhanh !== undefined) {
            fields.push(`hinhanh = $${queryIndex++}`);
            values.push(hinhanh);
        }
        if (maloai !== undefined) {
            fields.push(`maloai = $${queryIndex++}`);
            values.push(maloai);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Không có trường nào để cập nhật.' });
        }

        values.push(id); // Add the ID for the WHERE clause

        const updateQuery = `UPDATE mon_an SET ${fields.join(', ')} WHERE mamon = $${queryIndex} RETURNING *`;
        const updatedItem = await pool.query(updateQuery, values);

        res.status(200).json({
            message: `Món ăn với ID ${id} đã được cập nhật thành công.`,
            item: updatedItem.rows[0]
        });

    } catch (error) {
        console.error('Error during menu item update:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// Function to create a new menu item
export const createMenuItem = async (req, res) => {
    const { tenmon, mota, gia, hinhanh, maloai } = req.body;

    // Basic validation
    if (!tenmon || !gia || !maloai) {
        return res.status(400).json({ message: 'Tên món, giá và loại món là bắt buộc.' });
    }

    const client = await pool.connect(); // Get a client from the pool for transaction
    try {
        await client.query('BEGIN'); // Start transaction

        // Find the maximum existing mamon
        const maxMamonResult = await client.query(
            "SELECT mamon FROM mon_an WHERE mamon LIKE 'MA%' ORDER BY mamon DESC LIMIT 1"
        );

        let newMamon;
        if (maxMamonResult.rows.length > 0) {
            const lastMamon = maxMamonResult.rows[0].mamon; // e.g., 'MA01', 'MA10'
            const numPart = parseInt(lastMamon.replace('MA', '')) + 1; // e.g., 1 -> 2, 10 -> 11
            newMamon = 'MA' + String(numPart).padStart(2, '0'); // Pad with leading zeros for 2 digits, e.g., 'MA02', 'MA11'
        } else {
            newMamon = 'MA01'; // First item
        }

        // Add default TrangThai as it's NOT NULL in DB
        const trangthai = 'Còn hàng';

        const result = await client.query(
            'INSERT INTO mon_an (mamon, tenmon, mota, gia, hinhanh, maloai, trangthai) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [newMamon, tenmon, mota, gia, hinhanh, maloai, trangthai]
        );

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({
            message: 'Món ăn đã được thêm thành công.',
            item: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error during menu item creation:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.', details: error.message, stack: error.stack });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

