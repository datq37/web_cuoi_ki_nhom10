-- ============================================================
--  SUPABASE SCHEMA — Canteen Management System
--  Tạo bởi: tổng hợp từ tất cả SQLAlchemy models
--  Chạy toàn bộ file này trong Supabase > SQL Editor
-- ============================================================

-- -------------------------------------------------------
-- 1. danhmucmonan (phải tạo trước vì thucdon FK vào đây)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.danhmucmonan (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NULL
);

-- -------------------------------------------------------
-- 2. khachhang
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.khachhang (
    makh            VARCHAR PRIMARY KEY NOT NULL,
    ten             VARCHAR NULL,
    tuoi            INTEGER NULL,
    taikhoan        VARCHAR NULL,
    matkhau         VARCHAR NULL,
    lichsudathang   VARCHAR NULL,
    vaitro          VARCHAR NULL DEFAULT 'Khách hàng',
    is_active       BOOLEAN NULL DEFAULT TRUE
);

-- -------------------------------------------------------
-- 3. nhanvien
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nhanvien (
    manv            VARCHAR PRIMARY KEY NOT NULL,
    ten             VARCHAR NULL,
    tuoi            INTEGER NULL,
    chucvu          VARCHAR NULL,
    luong           FLOAT NULL,
    email           VARCHAR NULL,
    sodienthoai     VARCHAR NULL,
    ngaybatdau      VARCHAR NULL,
    viettat         VARCHAR NULL,
    maunen          VARCHAR NULL,
    hoatdonggannhat VARCHAR NULL
);

-- -------------------------------------------------------
-- 4. khohang
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.khohang (
    mahang      VARCHAR PRIMARY KEY NOT NULL,
    ten         VARCHAR NULL,
    soluong     FLOAT NULL,
    gianhap     NUMERIC NULL,
    trangthai   VARCHAR NULL,
    donvi       VARCHAR NULL,
    nhacungcap  VARCHAR NULL
);

-- -------------------------------------------------------
-- 5. cosovatchat
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cosovatchat (
    id          VARCHAR PRIMARY KEY NOT NULL,
    ten         VARCHAR NULL,
    soluong     VARCHAR NULL,
    chatluong   VARCHAR NULL,
    danhmuc     VARCHAR NULL,
    ghichu      VARCHAR NULL
);

-- -------------------------------------------------------
-- 6. thucdon (FK -> danhmucmonan)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.thucdon (
    mamon           VARCHAR PRIMARY KEY NOT NULL,
    ten             VARCHAR NULL,
    gia             FLOAT NULL,
    soluong         INTEGER NULL,
    hinhanh         TEXT NULL,
    mieuta          TEXT NULL,
    soluongdaban    INTEGER NULL,
    hethang         BOOLEAN NULL DEFAULT FALSE,
    tags            VARCHAR[] NULL,
    danhmucid       INTEGER NULL REFERENCES public.danhmucmonan(id)
);

-- -------------------------------------------------------
-- 7. khuyenmai
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.khuyenmai (
    id              SERIAL PRIMARY KEY,
    ten             VARCHAR NULL,
    hansudung       DATE NULL,
    ma              VARCHAR NULL,
    mota            VARCHAR NULL,
    loai            VARCHAR NULL,
    giatrigiam      INTEGER NULL,
    dontooithieu    INTEGER NULL,
    dadung          INTEGER NULL DEFAULT 0,
    gioihan         INTEGER NULL,
    trangthai       VARCHAR NULL,
    hoatdong        INTEGER NULL DEFAULT 1
);

-- -------------------------------------------------------
-- 8. orders (FK -> khachhang)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id                  VARCHAR PRIMARY KEY NOT NULL,
    makh                VARCHAR NULL REFERENCES public.khachhang(makh),
    tongtien            FLOAT NULL DEFAULT 0.0,
    trangthai           VARCHAR NULL DEFAULT 'cart',
    thoigiandat         VARCHAR NULL,
    hinhthucthanhtoan   VARCHAR NULL
);

-- -------------------------------------------------------
-- 9. chitietdonhang (FK -> orders, thucdon)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chitietdonhang (
    id          SERIAL PRIMARY KEY,
    order_id    VARCHAR NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    mamon       VARCHAR NULL,
    soluong     INTEGER NULL DEFAULT 1,
    gia         FLOAT NULL
);

-- -------------------------------------------------------
-- 10. payments (FK -> orders)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id          VARCHAR PRIMARY KEY NOT NULL,
    order_id    VARCHAR NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    method      VARCHAR NULL,
    status      VARCHAR NULL DEFAULT 'pending',
    created_at  TIMESTAMP NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 11. reviews
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id              SERIAL PRIMARY KEY,
    user_id         VARCHAR NULL,
    menu_item_id    VARCHAR NULL,
    rating          INTEGER NULL,
    comment         TEXT NULL,
    created_at      TIMESTAMP NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 12. daily_menu
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_menu (
    id              SERIAL PRIMARY KEY,
    serve_date      DATE NULL,
    menu_item_id    VARCHAR NULL
);

-- ============================================================
--  SEED DATA — Tài khoản Admin mặc định
--  Password: Admin@123 (đã hash bằng bcrypt)
--  Thay thế hash bên dưới nếu muốn dùng password khác
-- ============================================================
-- LƯU Ý: Chạy seed_admin.py để tạo admin tự động với hash đúng.
-- Hoặc dùng lệnh INSERT tạm bên dưới (password = Admin@123):
-- INSERT INTO public.khachhang (makh, ten, taikhoan, matkhau, vaitro, is_active)
-- VALUES (
--     'KH000',
--     'Quản trị viên',
--     'admin',
--     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbIIUXVm2',
--     'Admin',
--     TRUE
-- )
-- ON CONFLICT (makh) DO NOTHING;
