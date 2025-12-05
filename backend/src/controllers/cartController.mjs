import { pool } from '../config/db.js';

// Helper to get cart ID for a user, creating one if it doesn't exist
async function getOrCreateCartId(matk, userRole) { // matk is the decoded userId from token
    console.log('getOrCreateCartId called with matk:', matk, 'role:', userRole);

    if (userRole !== 'KhachHang') {
        throw new Error('Cart functionality is only available for customers (KhachHang).');
    }
    // First, find the makh (customer ID) associated with the matk (account ID)
    const khachHangResult = await pool.query(
        'SELECT makh FROM khach_hang WHERE matk = $1',
        [matk]
    );
    console.log('khach_hang query result:', khachHangResult.rows);

    if (khachHangResult.rows.length === 0) {
        throw new Error('Customer not found for this account ID.'); // Throw to stop further processing
    }
    const makh = khachHangResult.rows[0].makh;

    let cartResult = await pool.query(
        'SELECT magh FROM gio_hang WHERE makh = $1',
        [makh]
    );

    if (cartResult.rows.length === 0) {
        // Generate new MaGH
        const maxMaghResult = await pool.query(
            "SELECT magh FROM gio_hang WHERE magh LIKE 'GH%' ORDER BY magh DESC LIMIT 1"
        );
        let newMagh;
        if (maxMaghResult.rows.length > 0) {
            const lastMagh = maxMaghResult.rows[0].magh;
            const numPart = parseInt(lastMagh.replace('GH', '')) + 1;
            newMagh = 'GH' + String(numPart).padStart(3, '0');
        } else {
            newMagh = 'GH001';
        }

        cartResult = await pool.query(
            'INSERT INTO gio_hang (magh, makh) VALUES ($1, $2) RETURNING magh',
            [newMagh, makh]
        );
    }
    return cartResult.rows[0].magh;

    
}

export const getCart = async (req, res) => {
    const matk = req.user.id; // matk is the decoded userId from authMiddleware
    const userRole = req.user.role; // Get user role

    try {
        const magh = await getOrCreateCartId(matk, userRole);

        const cartItems = await pool.query(
            `SELECT
                ctgh.mamon,
                ma.tenmon,
                ma.hinhanh,
                ma.gia, -- Add unit price
                ctgh.soluong,
                ctgh.thanhtien
            FROM
                chitiet_giohang ctgh
            JOIN
                mon_an ma ON ctgh.mamon = ma.mamon
            WHERE
                ctgh.magh = $1`,
            [magh]
        );

        res.status(200).json({ cartId: magh, items: cartItems.rows });
    } catch (error) {
        console.error('Error getting cart:', error);
        if (error.message === 'Customer not found for this account ID.' || error.message === 'Cart functionality is only available for customers (KhachHang).') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addItemToCart = async (req, res) => {
    const matk = req.user.id;
    const userRole = req.user.role; // Get user role
    const { mamon, soluong = 1 } = req.body;

    console.log('addItemToCart: Received request for matk:', matk, 'role:', userRole, 'mamon:', mamon, 'soluong:', soluong);

    try {
        const magh = await getOrCreateCartId(matk, userRole);
        console.log('addItemToCart: Cart ID (magh) obtained:', magh);

        // Check if item already exists in cart
        console.log('addItemToCart: Checking for existing item in cart...');
        const existingItem = await pool.query(
            'SELECT * FROM chitiet_giohang WHERE magh = $1 AND mamon = $2',
            [magh, mamon]
        );
        console.log('addItemToCart: Existing item query result:', existingItem.rows);

        // Get current price of the dish
        console.log('addItemToCart: Fetching dish price for mamon:', mamon);
        const dish = await pool.query(
            'SELECT gia FROM mon_an WHERE mamon = $1',
            [mamon]
        );

        if (dish.rows.length === 0) {
            console.warn('addItemToCart: Dish not found for mamon:', mamon);
            return res.status(404).json({ message: 'Dish not found' });
        }
        let currentPrice = dish.rows[0].gia;
        // Explicitly parse currentPrice to a float as database might return DECIMAL as string
        currentPrice = parseFloat(currentPrice);
        console.log('addItemToCart: Current price for mamon', mamon, 'is:', currentPrice);

        // Ensure currentPrice is a valid number
        if (typeof currentPrice !== 'number' || isNaN(currentPrice)) {
            console.error('addItemToCart: currentPrice is not a valid number after parsing:', currentPrice);
            return res.status(500).json({ message: 'Invalid dish price found in database (parsed as NaN).' });
        }
        // Ensure soluong is a valid number, although it should come from frontend as number
        const parsedSoluong = parseInt(soluong, 10);
        if (isNaN(parsedSoluong) || parsedSoluong <= 0) {
            console.error('addItemToCart: Invalid quantity received:', soluong);
            return res.status(400).json({ message: 'Invalid quantity provided.' });
        }


        if (existingItem.rows.length > 0) {
            // Update quantity if item exists
            console.log('addItemToCart: Item exists, updating quantity...');
            await pool.query(
                'UPDATE chitiet_giohang SET soluong = soluong + $1, thanhtien = (soluong + $1) * $4 WHERE magh = $2 AND mamon = $3',
                [parsedSoluong, magh, mamon, currentPrice]
            );
            console.log('addItemToCart: Item quantity updated.');
        } else {
            // Add new item to cart
            console.log('addItemToCart: Item does not exist, inserting new item...');
            await pool.query(
                'INSERT INTO chitiet_giohang (magh, mamon, soluong, thanhtien) VALUES ($1, $2, $3, $4)',
                [magh, mamon, parsedSoluong, parsedSoluong * currentPrice]
            );
            console.log('addItemToCart: New item inserted.');
        }

        // Update cart's last updated timestamp
        console.log('addItemToCart: Updating cart timestamp...');
        await pool.query(
            'UPDATE gio_hang SET ngaycapnhat = CURRENT_TIMESTAMP WHERE magh = $1',
            [magh]
        );
        console.log('addItemToCart: Cart timestamp updated. Sending success response.');

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        if (error.message === 'Customer not found for this account ID.' || error.message === 'Cart functionality is only available for customers (KhachHang).') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    const matk = req.user.id;
    const userRole = req.user.role; // Get user role
    const { mamon, soluong } = req.body;

    if (soluong <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0. Use DELETE to remove.' });
    }

    try {
        const magh = await getOrCreateCartId(matk, userRole);

        const result = await pool.query(
            'UPDATE chitiet_giohang SET soluong = $1 WHERE magh = $2 AND mamon = $3 RETURNING *',
            [soluong, magh, mamon]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update cart's last updated timestamp
        await pool.query(
            'UPDATE gio_hang SET ngaycapnhat = CURRENT_TIMESTAMP WHERE magh = $1',
            [magh]
        );

        res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        if (error.message === 'Customer not found for this account ID.' || error.message === 'Cart functionality is only available for customers (KhachHang).') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeCartItem = async (req, res) => {
    const matk = req.user.id;
    const userRole = req.user.role; // Get user role
    const { mamon } = req.params;

    try {
        const magh = await getOrCreateCartId(matk, userRole);

        const result = await pool.query(
            'DELETE FROM chitiet_giohang WHERE magh = $1 AND mamon = $2 RETURNING *',
            [magh, mamon]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update cart's last updated timestamp
        await pool.query(
            'UPDATE gio_hang SET ngaycapnhat = CURRENT_TIMESTAMP WHERE magh = $1',
            [magh]
        );

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        if (error.message === 'Customer not found for this account ID.' || error.message === 'Cart functionality is only available for customers (KhachHang).') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
