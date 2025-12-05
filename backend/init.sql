
-- I. XÓA (DROP) TẤT CẢ CÁC BẢNG (ĐẢM BẢO KHÔNG CÓ LỖI RÀNG BUỘC)
----------------------------------------------------------------------
DROP TABLE IF EXISTS DANH_GIA CASCADE;
DROP TABLE IF EXISTS CHITIET_DONHANG CASCADE;
DROP TABLE IF EXISTS CHITIET_GIOHANG CASCADE;
DROP TABLE IF EXISTS DAT_BAN CASCADE;
DROP TABLE IF EXISTS DON_HANG CASCADE;
DROP TABLE IF EXISTS GIO_HANG CASCADE;
DROP TABLE IF EXISTS MON_AN CASCADE;
DROP TABLE IF EXISTS LOAI_MON CASCADE;
DROP TABLE IF EXISTS KHACH_HANG CASCADE;
DROP TABLE IF EXISTS NHAN_VIEN CASCADE;
DROP TABLE IF EXISTS TAI_KHOAN CASCADE;


-- II. TẠO (CREATE) CÁC BẢNG THEO THỨ TỰ LOGIC
------------------------------------------------------

-- 1. TAI_KHOAN (Bảng cơ sở)
CREATE TABLE TAI_KHOAN (
    MaTK VARCHAR(50) PRIMARY KEY,
    TenDangNhap VARCHAR(100) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    VaiTro VARCHAR(50)
);

-- 2. LOAI_MON (Bảng cơ sở)
CREATE TABLE LOAI_MON (
    MaLoai VARCHAR(50) PRIMARY KEY,
    TenLoai VARCHAR(100) NOT NULL UNIQUE
);

-- 3. KHACH_HANG (Phụ thuộc vào TAI_KHOAN)
CREATE TABLE KHACH_HANG (
    MaKH VARCHAR(50) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    DiaChi VARCHAR(255), -- Thêm cột Địa Chỉ
    MaTK VARCHAR(50), -- (FK)
    FOREIGN KEY (MaTK) REFERENCES TAI_KHOAN(MaTK)
);

-- 4. NHAN_VIEN (Phụ thuộc vào TAI_KHOAN)
CREATE TABLE NHAN_VIEN (
    MaNV VARCHAR(50) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) UNIQUE,
    MaTK VARCHAR(50), -- (FK)
    FOREIGN KEY (MaTK) REFERENCES TAI_KHOAN(MaTK)
);

-- 5. MON_AN (Phụ thuộc vào LOAI_MON)
CREATE TABLE MON_AN (
    MaMon VARCHAR(50) PRIMARY KEY,
    TenMon VARCHAR(100) NOT NULL UNIQUE,
    MoTa VARCHAR(500),
    HinhAnh VARCHAR(255),
    Gia DECIMAL(18, 2) NOT NULL CHECK (Gia > 0),
    TrangThai VARCHAR(50),
    MaLoai VARCHAR(50), -- (FK)
    FOREIGN KEY (MaLoai) REFERENCES LOAI_MON(MaLoai)
);

-- 6. GIO_HANG (Phụ thuộc vào KHACH_HANG)
CREATE TABLE GIO_HANG (
    MaGH VARCHAR(50) PRIMARY KEY,
    MaKH VARCHAR(50), -- (FK)
    TongTien DECIMAL(18, 2) DEFAULT 0,
    NgayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH)
);

-- 7. DAT_BAN (Phụ thuộc vào KHACH_HANG và NHAN_VIEN)
CREATE TABLE DAT_BAN (
    MaDatBan VARCHAR(50) PRIMARY KEY,
    MaKH VARCHAR(50), -- (FK)
    MaNVXacNhan VARCHAR(50), -- (FK)
    NgayDatBan TIMESTAMP NOT NULL,
    GioDatBan TIME,
    SoNguoi INT NOT NULL CHECK (SoNguoi > 0),
    TrangThai VARCHAR(50),
    SDT VARCHAR(15),
    TenKH VARCHAR(100),
    GhiChu VARCHAR(255),
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    FOREIGN KEY (MaNVXacNhan) REFERENCES NHAN_VIEN(MaNV)
);

-- 8. DON_HANG (Phụ thuộc vào KHACH_HANG và NHAN_VIEN)
CREATE TABLE DON_HANG (
    MaDH VARCHAR(50) PRIMARY KEY,
    MaKH VARCHAR(50), -- (FK)
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) NOT NULL,
    GhiChu VARCHAR(255),
    TongTienMonAn DECIMAL(18, 2) DEFAULT 0,
    PhiGiaoHang DECIMAL(18, 2) DEFAULT 0,
    TongTien DECIMAL(18, 2) DEFAULT 0,
    TrangThaiDonHang VARCHAR(50),
    TrangThaiThanhToan VARCHAR(50),
    PhuongThucTT VARCHAR(50),
    DiaChiGiaoHang VARCHAR(255),
    NgayDat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MaNVLy VARCHAR(50), -- (FK) Nhân viên xử lý đơn
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    FOREIGN KEY (MaNVLy) REFERENCES NHAN_VIEN(MaNV)
);

-- 9. CHITIET_GIOHANG (Phụ thuộc vào GIO_HANG và MON_AN)
CREATE TABLE CHITIET_GIOHANG (
    MaGH VARCHAR(50) NOT NULL, -- (PK, FK)
    MaMon VARCHAR(50) NOT NULL, -- (PK, FK)
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    ThanhTien DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (MaGH, MaMon),
    FOREIGN KEY (MaGH) REFERENCES GIO_HANG(MaGH),
    FOREIGN KEY (MaMon) REFERENCES MON_AN(MaMon)
);

-- 10. CHITIET_DONHANG (Phụ thuộc vào DON_HANG và MON_AN)
CREATE TABLE CHITIET_DONHANG (
    MaDH VARCHAR(50) NOT NULL, -- (PK, FK)
    MaMon VARCHAR(50) NOT NULL, -- (PK, FK)
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    ThanhTien DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (MaDH, MaMon),
    FOREIGN KEY (MaDH) REFERENCES DON_HANG(MaDH),
    FOREIGN KEY (MaMon) REFERENCES MON_AN(MaMon)
);

-- 11. DANH_GIA (Phụ thuộc vào KHACH_HANG, MON_AN, NHAN_VIEN)
CREATE TABLE DANH_GIA (
    MaDG VARCHAR(50) PRIMARY KEY,
    MaKH VARCHAR(50), -- (FK) Khách hàng đánh giá
    MaMon VARCHAR(50), -- (FK) Món ăn được đánh giá
    PhanHoiNV VARCHAR(50), -- (FK) Nhân viên phản hồi (nếu có)
    NoiDung VARCHAR(500),
    SoSao INT CHECK (SoSao >= 1 AND SoSao <= 5) NOT NULL,
    NgayDanhGia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    FOREIGN KEY (MaMon) REFERENCES MON_AN(MaMon),
    FOREIGN KEY (PhanHoiNV) REFERENCES NHAN_VIEN(MaNV)
);


-- III. CHÈN (INSERT) DỮ LIỆU MẪU ĐÃ SỬA LỖI
--------------------------------------------------------

-- 1. TAI_KHOAN
INSERT INTO TAI_KHOAN (MaTK, TenDangNhap, MatKhau, Email, VaiTro) VALUES
('TK001', 'admin1', '$2b$10$jZDH6qMDVgRYnTm430J17.2LX2n8ZpAgwvLW11j3mGUkzB5zwWdFe', 'toanvan2902@gmail.com', 'Admin'), -- (password: 123123)
('TK002', 'nv1', '$2b$10$jZDH6qMDVgRYnTm430J17.2LX2n8ZpAgwvLW11j3mGUkzB5zwWdFe', 'toanvan29022004@gmail.com', 'NhanVien'),
('TK003', 'user1', '$2b$10$jZDH6qMDVgRYnTm430J17.2LX2n8ZpAgwvLW11j3mGUkzB5zwWdFe', 'vkht292@gmail.com', 'KhachHang');


-- 2. LOAI_MON
INSERT INTO LOAI_MON (MaLoai, TenLoai) VALUES
('1', 'KHAI VỊ'),
('2', 'SÚP'),
('3', 'SALAD'),
('4', 'THỊT BÒ'),
('5', 'HẢI SẢN CÁC LOẠI'),
('6', 'THỊT HEO'),
('7', 'MÌ SPAGHETTI'),
('8', 'PIZZA'),
('9', 'TRÁNG MIỆNG'),
('10', 'ĐỒ UỐNG');


-- 3. KHACH_HANG (Phụ thuộc vào TAI_KHOAN)
INSERT INTO KHACH_HANG (MaKH, HoTen, SDT, Email, MaTK, DiaChi) VALUES
('KH001', 'Văn Khắc Hải Toàn', '0373354892', 'vkht292@gmail.com', 'TK003', '123 Đường ABC, Quận 1, TP.HCM');


-- 4. NHAN_VIEN (Phụ thuộc vào TAI_KHOAN)
INSERT INTO NHAN_VIEN (MaNV, HoTen, SDT, MaTK) VALUES
('NV001', 'Hải Toàn', '0123456878', 'TK001'), -- Admin
('NV002', 'Nhân viên', '0915566778', 'TK002'); -- Nhân viên thường


-- 5. MON_AN (Phụ thuộc vào LOAI_MON)
INSERT INTO MON_AN (MaMon, TenMon, MoTa, HinhAnh, Gia, TrangThai, MaLoai) VALUES
('MA01', 'Carpaccio Bò Úc', 'Thịt bò Úc thái lát mỏng với sốt chanh và phô mai Parmesan.', '/menu/carpaccio_bouc.jpg', 190000.00, 'Còn hàng', '1'), -- KHAI VỊ
('MA02', 'Súp Bí Đỏ Hokkaido', 'Súp bí đỏ Hokkaido kem tươi.', '/menu/supbido.jpg', 105000.00, 'Còn hàng', '2'), -- SÚP
('MA03', 'Caesar Salad Cá Hồi', 'Salad Caesar với cá hồi áp chảo.', '/menu/saladcahoi.jpg', 220000.00, 'Còn hàng', '3'), -- SALAD
('MA04', 'Wagyu A5 Nướng Đá', 'Thịt bò Wagyu A5 Nhật Bản nướng trên đá nóng.', '/menu/boA5nuongda.jpg', 3500000.00, 'Còn hàng', '4'), -- THỊT BÒ
('MA05', 'Beef Wellington', 'Thăn bò nướng bao bọc trong pate nấm và lớp vỏ bánh ngàn lớp.', '/menu/bowellington.jpg', 590000.00, 'Còn hàng', '4'), -- THỊT BÒ
('MA06', 'Lườn Ngỗng Áp Chảo', 'Lườn ngỗng áp chảo sốt đậm đà.', '/menu/ngongapchao.jpg', 450000.00, 'Còn hàng', '4'), -- THỊT BÒ
('MA07', 'Tôm Hùm Alaska Nướng', 'Tôm hùm Alaska nướng bơ tỏi hoặc phô mai.', '/menu/tomalaskanuong.jpg', 1800000.00, 'Còn hàng', '5'), -- HẢI SẢN
('MA08', 'Cá Hồi Sốt Cam', 'Cá hồi áp chảo, dùng kèm sốt cam tươi.', '/menu/ca_hoi_sot_cam.jpg', 420000.00, 'Còn hàng', '5'), -- HẢI SẢN
('MA09', 'Sườn Heo Iberico', 'Sườn heo Iberico Tây Ban Nha nướng than.', '/menu/suonheonuong.jpg', 390000.00, 'Còn hàng', '6'), -- THỊT HEO
('MA10', 'Spaghetti Carbonara', 'Mì Ý sốt kem trứng và thịt heo xông khói.', '/menu/spaghetti_carbonara.jpg', 230000.00, 'Còn hàng', '7'), -- MÌ SPAGHETTI
('MA11', 'Pizza 4 Cheese', 'Pizza với 4 loại phô mai: Mozzarella, Parmesan, Cheddar, Gorgonzola.', '/menu/pz4cheese.jpg', 280000.00, 'Còn hàng', '8'), -- PIZZA
('MA12', 'Crème Brûlée', 'Kem trứng nướng với lớp đường caramel giòn tan.', '/menu/creme.jpg', 110000.00, 'Còn hàng', '9'), -- TRÁNG MIỆNG
('MA13', 'Vang Đỏ Cabernet', 'Chai vang đỏ Cabernet Sauvignon nhập khẩu.', '/menu/vang.jpg', 1200000.00, 'Còn hàng', '10'), -- ĐỒ UỐNG
('MA14', 'Mojito Chanh Tươi', 'Mojito truyền thống với chanh tươi và lá bạc hà.', '/menu/chanhtuoi.jpg', 95000.00, 'Còn hàng', '10'), -- ĐỒ UỐNG
('MA15', 'Sò Điệp Áp Chảo Tiêu Đen', 'Sò điệp tươi áp chảo vàng giòn bên ngoài, mềm ngọt bên trong, kết hợp sốt bơ tỏi tiêu đen cay nhẹ, thơm nồng, đậm đà và cuốn hút.', '/menu/sodiep.jpg',320000.00, 'Còn hàng', '5'); -- ĐỒ UỐNG

-- 6. GIO_HANG (Dữ liệu mẫu - Giả sử KH001 có món, KH002 chưa có)
INSERT INTO GIO_HANG (MaGH, MaKH, TongTien) VALUES
('GH001', 'KH001', 350000.00); -- MA03 (220k) + MA02 (105k) + phí (25k)


-- 7. CHITIET_GIOHANG (Phụ thuộc vào GIO_HANG và MON_AN)
INSERT INTO CHITIET_GIOHANG (MaGH, MaMon, SoLuong, ThanhTien) VALUES
('GH001', 'MA03', 1, 220000.00);


-- 8. DAT_BAN (Phụ thuộc vào KHACH_HANG và NHAN_VIEN)
INSERT INTO DAT_BAN (MaDatBan, MaKH, MaNVXacNhan, NgayDatBan, GioDatBan, SoNguoi, TrangThai, SDT, TenKH, GhiChu) VALUES
('DB001', 'KH001', 'NV002', CURRENT_TIMESTAMP, '19:30:00', 4, 'Đã xác nhận', '0901234567', 'Văn Khắc Hải Toàn', 'Bàn gần cửa sổ');


-- 9. DON_HANG (Dữ liệu mẫu)
INSERT INTO DON_HANG (MaDH, MaKH, HoTen, SDT, GhiChu, TongTienMonAn, PhiGiaoHang, TongTien, TrangThaiDonHang, TrangThaiThanhToan, PhuongThucTT, DiaChiGiaoHang, MaNVLy) VALUES
('DH001', 'KH001', 'Văn Khắc Hải Toàn', '0373354892', 'Giao gấp', 700000.00, 30000.00, 730000.00, 'Đã giao', 'Đã TT', 'Chuyển khoản', '45 CMT8, Q1, TP.HCM', 'NV002');


-- 10. CHITIET_DONHANG (Phụ thuộc vào DON_HANG và MON_AN)
INSERT INTO CHITIET_DONHANG (MaDH, MaMon, SoLuong, ThanhTien) VALUES
('DH001', 'MA05', 1, 590000.00); -- Beef Wellington


-- 11. DANH_GIA (Dữ liệu mẫu)
INSERT INTO DANH_GIA (MaDG, MaKH, MaMon, PhanHoiNV, NoiDung, SoSao, NgayDanhGia) VALUES
('DG001', 'KH001', 'MA05', 'NV002', 'Món Beef Wellington tuyệt vời, rất đáng tiền!', 5, CURRENT_TIMESTAMP);