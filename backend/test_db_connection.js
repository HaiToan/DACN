// backend/test_db_connection.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Tải các biến môi trường từ file .env
dotenv.config();

console.log('--- Script Kiểm Tra Kết Nối Database ---');
console.log(`Đang thử kết nối tới:`);
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Port: ${process.env.DB_PORT}`);
console.log(`  Database: ${process.env.DB_NAME}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log('------------------------------------');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Thêm thời gian chờ để không bị treo vô hạn
    connectionTimeoutMillis: 5000, 
});

const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ KẾT NỐI THÀNH CÔNG!');
        console.log('Thông tin kết nối trong file .env của bạn là CHÍNH XÁC.');
        client.release();
    } catch (err) {
        console.error('❌ KẾT NỐI THẤT BẠI!');
        console.error('Lỗi chi tiết:', err.message);
        console.log('\n--- Gợi ý ---');
        if (err.code === '28P01') {
            console.log('-> Lỗi "password authentication failed". Mật khẩu (DB_PASSWORD) không đúng.');
        } else if (err.code === '3D000') {
            console.log(`-> Lỗi "database "${process.env.DB_NAME}" does not exist". Tên database (DB_NAME) không tồn tại.`);
        } else if (err.code === 'ECONNREFUSED') {
            console.log(`-> Lỗi "connection refused". Server PostgreSQL của bạn có thể chưa chạy, hoặc không chạy trên cổng ${process.env.DB_PORT}.`);
        } else {
            console.log('-> Vui lòng kiểm tra lại tất cả các thông số DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT trong file .env và đảm bảo server PostgreSQL của bạn đang hoạt động.');
        }
    } finally {
        await pool.end();
    }
};

testConnection();
