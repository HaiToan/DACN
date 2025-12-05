// server.mjs
import express from 'express';
import http from 'http'; // Import a module http
import { Server } from 'socket.io'; // Import a module Server từ socket.io
import apiRouter from './routes/apiRouters.js'; 
import { pool } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3001; 
const app = express();
const server = http.createServer(app); // Tạo server http từ app Express

// Khởi tạo Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // URL của frontend
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to disable caching for all API responses
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0'); // For older HTTP/1.0 proxies
    next();
});

// Đặt io vào app context để các controller có thể truy cập
app.set('io', io);

// Định tuyến (Routing)
app.use("/api", apiRouter); 

// Logic xử lý kết nối Socket.IO
io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối:', socket.id);

    // Lắng nghe sự kiện để tham gia vào "phòng" theo MaTK
    socket.on('register', (maTK) => {
        if (maTK) {
            console.log(`Người dùng với MaTK ${maTK} đã đăng ký với socket id ${socket.id}`);
            socket.join(maTK); // Cho socket tham gia vào phòng có tên là MaTK
        }
    });

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối:', socket.id);
    });
});

// Hàm khởi tạo database (giữ nguyên)
const initializeDatabase = async () => {
    try {
        const initSql = fs.readFileSync(path.resolve('init.sql'), 'utf8');
        await pool.query(initSql);
        console.log('Khởi tạo database thành công.');
    } catch (err) {
        console.error('Lỗi khi khởi tạo database:', err.stack);
        process.exit(1);
    }
};

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Không thể kết nối tới PostgreSQL!', err.stack);
        process.exit(1); 
        return;
    }

    console.log(`Kết nối PostgreSQL thành công! Server time: ${result.rows[0].now}`);
    
    // Khởi động server HTTP (thay vì app)
    server.listen(PORT, () => {
        console.log(`Server Beef Bistro đang chạy trên cổng ${PORT}`);
    });
});
