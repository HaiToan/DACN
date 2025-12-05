import { pool } from '../config/db.js';

export const placeOrder = async (req, res) => {
    const matk = req.user.id; // matk is account ID from token
    const {
        phuongthuctt,
        diachigiaohang,
        ghichu,
        tennguoinhan,
        sdtnguoinhan
    } = req.body;

    // Basic validation
    if (!phuongthuctt || !diachigiaohang || !tennguoinhan || !sdtnguoinhan) {
        return res.status(400).json({ message: 'Missing required order information (payment method, address, recipient name, or phone number).' });
    }

    const phigiaohang = req.body.phigiaohang ? parseFloat(req.body.phigiaohang) : 0;
    if (phigiaohang < 0) {
        return res.status(400).json({ message: 'Delivery fee cannot be negative.' });
    }



    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        // Get actual customer ID (makh) from account ID (matk)
        const customerResult = await client.query('SELECT makh FROM khach_hang WHERE matk = $1', [matk]);
        if (customerResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'User profile not found. Please ensure your account has a customer profile.' });
        }
        const makh = customerResult.rows[0].makh; // Correct customer ID


        // 1. Get cart items for the user
        const cartResult = await client.query(
            'SELECT magh FROM gio_hang WHERE makh = $1',
            [makh]
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }
        const magh = cartResult.rows[0].magh;

        const cartItemsResult = await client.query(
            `SELECT
                ctgh.mamon,
                ctgh.soluong,
                ma.gia as gia
             FROM
                chitiet_giohang ctgh
             JOIN
                mon_an ma ON ctgh.mamon = ma.mamon
             WHERE
                ctgh.magh = $1`,
            [magh]
        );


        if (cartItemsResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Cannot place an empty order.' });
        }

        const cartItems = cartItemsResult.rows;

        // Calculate total amount
        let tongtienmonan = 0;
        cartItems.forEach(item => {
            tongtienmonan += parseFloat(item.soluong) * parseFloat(item.gia);
        });


        const phigiaohang = req.body.phigiaohang ? parseFloat(req.body.phigiaohang) : 0;
        const tongtien = tongtienmonan + phigiaohang;
        
        const maxMadhResult = await client.query(
            "SELECT madh FROM don_hang WHERE madh LIKE 'DH%' ORDER BY madh DESC LIMIT 1"
        );

        let madh;
        if (maxMadhResult.rows.length > 0) {
            const lastMadh = maxMadhResult.rows[0].madh;
            const numPart = parseInt(lastMadh.replace('DH', '')) + 1;
            madh = 'DH' + String(numPart).padStart(3, '0');
        } else {
            madh = 'DH001';
        }

        await client.query(
            `INSERT INTO don_hang (
                madh,
                makh,
                tongtienmonan,
                phigiaohang,
                tongtien,
                phuongthuctt,
                diachigiaohang,
                hoten,
                sdt,
                trangthaidonhang,
                trangthaithanhtoan,
                ghichu,
                ngaydat
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) RETURNING madh`,
            [
                madh,
                makh,
                tongtienmonan,
                phigiaohang,
                tongtien,
                phuongthuctt,
                diachigiaohang,
                tennguoinhan,
                sdtnguoinhan,
                'Processing', 
                'Pending', 
                ghichu
            ]
        );

        for (const item of cartItems) {
            await client.query(
                `INSERT INTO chitiet_donhang (madh, mamon, soluong, thanhtien)
                 VALUES ($1, $2, $3, $4)`,
                [madh, item.mamon, item.soluong, parseFloat(item.soluong) * parseFloat(item.gia)]
            );
        }

        await client.query(
            'DELETE FROM chitiet_giohang WHERE magh = $1',
            [magh]
        );
        await client.query(
            'DELETE FROM gio_hang WHERE magh = $1',
            [magh]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', madh: madh });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Error in placeOrder transaction:', error);
        res.status(500).json({ message: 'An unexpected error occurred while placing the order. Please try again later.' });
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const userResult = await pool.query('SELECT makh FROM khach_hang WHERE matk = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(200).json([]);
        }
        const maKH = userResult.rows[0].makh;

        const orders = await pool.query(
            `SELECT
                dh.madh,
                dh.ngaydat,
                dh.tongtien as tongthanhtoan,
                dh.trangthaidonhang,
                dh.trangthaithanhtoan,
                dh.phuongthuctt,
                dh.diachigiaohang,
                dh.hoten as tennguoinhan,
                dh.sdt as sdtnguoinhan
            FROM
                don_hang dh
            WHERE
                dh.makh = $1
            ORDER BY
                dh.ngaydat DESC`,
            [maKH]
        );

        res.status(200).json(orders.rows);
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderDetails = async (req, res) => {
    const { madh } = req.params;
    console.log(`Attempting to get order details for madh: ${madh}`);

    try {
        const orderResult = await pool.query(
            `SELECT
                dh.madh,
                dh.ngaydat,
                dh.makh,
                kh.hoten as tenkhachhang,
                dh.tongtien as tongthanhtoan,
                dh.trangthaidonhang,
                dh.trangthaithanhtoan,
                dh.phuongthuctt,
                dh.diachigiaohang,
                dh.hoten as tennguoinhan,
                dh.sdt as sdtnguoinhan,
                dh.ghichu,
                dh.tongtienmonan,
                dh.phigiaohang
            FROM
                don_hang dh
            JOIN
                khach_hang kh ON dh.makh = kh.makh
            WHERE
                dh.madh = $1`,
            [madh]
        );
        console.log('Order query result:', orderResult.rows);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const order = orderResult.rows[0];

        const itemsResult = await pool.query(
            `SELECT
                ct.mamon,
                m.tenmon,
                ct.soluong,
                ct.thanhtien,
                m.gia as giamien
            FROM
                chitiet_donhang ct
            JOIN
                mon_an m ON ct.mamon = m.mamon
            WHERE
                ct.madh = $1`,
            [madh]
        );

        order.items = itemsResult.rows;

        res.status(200).json(order);

    } catch (error) {
        console.error('Error getting order details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT
                dh.madh,
                dh.ngaydat,
                dh.makh,
                kh.hoten as tenkhachhang,
                dh.tongtien as tongthanhtoan,
                dh.trangthaidonhang,
                dh.trangthaithanhtoan,
                dh.phuongthuctt,
                dh.diachigiaohang,
                dh.hoten as tennguoinhan,
                dh.sdt as sdtnguoinhan,
                dh.ghichu
            FROM
                don_hang dh
            JOIN
                khach_hang kh ON dh.makh = kh.makh
            ORDER BY
                dh.ngaydat DESC`
        );
        res.status(200).json(orders.rows);
    } catch (error) {
        console.error('Error getting all orders for admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { madh } = req.params;
    const { trangthai_donhang, trangthai_thanhtoan } = req.body;

    const validOrderStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
    const validPaymentStatuses = ['Pending', 'Paid'];

    if (trangthai_donhang && !validOrderStatuses.includes(trangthai_donhang)) {
        return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
    }
    if (trangthai_thanhtoan && !validPaymentStatuses.includes(trangthai_thanhtoan)) {
        return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
    }

    try {
        const orderExists = await pool.query('SELECT trangthaidonhang, trangthaithanhtoan FROM don_hang WHERE madh = $1', [madh]);
        if (orderExists.rows.length === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
        }

        const currentOrder = orderExists.rows[0];
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (trangthai_donhang !== undefined && trangthai_donhang !== currentOrder.trangthaidonhang) {
            fields.push(`trangthaidonhang = $${queryIndex++}`);
            values.push(trangthai_donhang);
        }
        if (trangthai_thanhtoan !== undefined && trangthai_thanhtoan !== currentOrder.trangthaithanhtoan) {
            fields.push(`trangthaithanhtoan = $${queryIndex++}`);
            values.push(trangthai_thanhtoan);
        }

        if (fields.length === 0) {
            return res.status(200).json({ message: 'Không có thay đổi trạng thái nào được yêu cầu.' });
        }

        values.push(madh);

        const updateQuery = `UPDATE don_hang SET ${fields.join(', ')} WHERE madh = $${queryIndex} RETURNING *`;
        const updatedOrder = await pool.query(updateQuery, values);

        res.status(200).json({
            message: `Cập nhật trạng thái đơn hàng ${madh} thành công.`,
            order: updatedOrder.rows[0]
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

export const deleteOrder = async (req, res) => {
    const { madh } = req.params;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        const orderExists = await client.query('SELECT * FROM don_hang WHERE madh = $1', [madh]);
        if (orderExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
        }

        await client.query('DELETE FROM chitiet_donhang WHERE madh = $1', [madh]);

        await client.query('DELETE FROM don_hang WHERE madh = $1', [madh]);

        await client.query('COMMIT');
        res.status(200).json({ message: `Đơn hàng ${madh} đã được xóa thành công.` });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (client) {
            client.release();
        }
    }
};