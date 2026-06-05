-- ============================================================
--  TẠO TẤT CẢ BẢNG — Hệ thống quản lý căn tin (Nhóm 10)
--  Tổng hợp đầy đủ từ các SQLAlchemy models
--  Thứ tự tạo bảng tuân theo ràng buộc FOREIGN KEY
--  Chạy toàn bộ file này trong Supabase > SQL Editor
--  hoặc psql: \i create_all_tables.sql
-- ============================================================

-- -------------------------------------------------------
-- 0. Xóa bảng cũ (tùy chọn — bỏ comment nếu muốn reset)
-- -------------------------------------------------------
-- DROP TABLE IF EXISTS public.combo_mon_an     CASCADE;
-- DROP TABLE IF EXISTS public.combo            CASCADE;
-- DROP TABLE IF EXISTS public.congthuc         CASCADE;
-- DROP TABLE IF EXISTS public.chitietdonhang   CASCADE;
-- DROP TABLE IF EXISTS public.payments         CASCADE;
-- DROP TABLE IF EXISTS public.orders           CASCADE;
-- DROP TABLE IF EXISTS public.reviews          CASCADE;
-- DROP TABLE IF EXISTS public.daily_menu       CASCADE;
-- DROP TABLE IF EXISTS public.khuyenmai        CASCADE;
-- DROP TABLE IF EXISTS public.thucdon          CASCADE;
-- DROP TABLE IF EXISTS public.danhmucmonan     CASCADE;
-- DROP TABLE IF EXISTS public.khohang          CASCADE;
-- DROP TABLE IF EXISTS public.cosovatchat      CASCADE;
-- DROP TABLE IF EXISTS public.nhanvien         CASCADE;
-- DROP TABLE IF EXISTS public.canteen_settings CASCADE;
-- DROP TABLE IF EXISTS public.khachhang        CASCADE;

-- -------------------------------------------------------
-- 1. danhmucmonan
--    (phải tạo trước vì thucdon FK vào đây)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.danhmucmonan (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NULL,
    image   VARCHAR NULL
);

-- -------------------------------------------------------
-- 2. khachhang
--    (phải tạo trước vì orders FK vào đây)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.khachhang (
    makh            VARCHAR PRIMARY KEY NOT NULL,
    ten             VARCHAR NULL,
    tuoi            INTEGER NULL,
    taikhoan        VARCHAR NULL,
    matkhau         VARCHAR NULL,
    lichsudathang   VARCHAR NULL,
    vaitro          VARCHAR NULL DEFAULT 'Khách hàng',
    is_active       BOOLEAN NULL DEFAULT TRUE,
    avatar          TEXT NULL,
    phone           VARCHAR NULL,
    email           VARCHAR NULL,
    dept            VARCHAR NULL,
    building        VARCHAR NULL,
    floor           VARCHAR NULL,
    desk            VARCHAR NULL,
    points          INTEGER NOT NULL DEFAULT 0,
    total_spent     INTEGER NOT NULL DEFAULT 0
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
--    (phải tạo trước vì congthuc FK vào đây)
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
-- 6. canteen_settings
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canteen_settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.canteen_settings (key, value)
VALUES (
    'business_hours',
    '[
      {"label":"Thứ Hai","on":true,"mo":"07:00","close":"18:00"},
      {"label":"Thứ Ba","on":true,"mo":"07:00","close":"18:00"},
      {"label":"Thứ Tư","on":true,"mo":"07:00","close":"18:00"},
      {"label":"Thứ Năm","on":true,"mo":"07:00","close":"18:00"},
      {"label":"Thứ Sáu","on":true,"mo":"07:00","close":"18:00"},
      {"label":"Thứ Bảy","on":true,"mo":"08:00","close":"13:00"},
      {"label":"Chủ Nhật","on":false,"mo":"08:00","close":"12:00"}
    ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------
-- 7. thucdon
--    FK -> danhmucmonan
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
-- 8. orders
--    FK -> khachhang
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id                  VARCHAR PRIMARY KEY NOT NULL,
    makh                VARCHAR NULL REFERENCES public.khachhang(makh),
    tongtien            FLOAT NULL DEFAULT 0.0,
    trangthai           VARCHAR NULL DEFAULT 'cart',
    thoigiandat         VARCHAR NULL,
    hinhthucthanhtoan   VARCHAR NULL,
    ghichu              VARCHAR NULL
);

-- -------------------------------------------------------
-- 9. chitietdonhang
--    FK -> orders, thucdon
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chitietdonhang (
    id          SERIAL PRIMARY KEY,
    order_id    VARCHAR NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    mamon       VARCHAR NULL,
    soluong     INTEGER NULL DEFAULT 1,
    gia         FLOAT NULL
);

-- -------------------------------------------------------
-- 10. payments
--     FK -> orders
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
--     (user_id tham chiếu mềm tới khachhang.makh)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id              SERIAL PRIMARY KEY,
    user_id         VARCHAR NULL,
    menu_item_id    VARCHAR NULL,
    rating          INTEGER NULL,
    comment         TEXT NULL,
    created_at      TIMESTAMP NULL DEFAULT NOW(),
    images          TEXT[] NULL,
    admin_reply     TEXT NULL,
    admin_reply_at  TIMESTAMP NULL
);

-- -------------------------------------------------------
-- 12. daily_menu
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_menu (
    id              SERIAL PRIMARY KEY,
    serve_date      DATE NULL,
    menu_item_id    VARCHAR NULL
);

-- -------------------------------------------------------
-- 13. congthuc  (Công thức / Định lượng nguyên liệu)
--     FK -> thucdon, khohang
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.congthuc (
    id          SERIAL PRIMARY KEY,
    mamon       VARCHAR NULL REFERENCES public.thucdon(mamon) ON DELETE CASCADE,
    mahang      VARCHAR NULL REFERENCES public.khohang(mahang) ON DELETE CASCADE,
    dinhluong   FLOAT NULL DEFAULT 0.0
);

-- -------------------------------------------------------
-- 14. combo
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.combo (
    id              SERIAL PRIMARY KEY,
    ten             VARCHAR NOT NULL,
    mota            TEXT NULL,
    loai_gia        VARCHAR NOT NULL DEFAULT 'phan_tram',
    gia_tri_giam    INTEGER NOT NULL DEFAULT 0,
    hansudung       DATE NULL,
    trangthai       VARCHAR NOT NULL DEFAULT 'dang_chay',
    hoatdong        INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 15. combo_mon_an  (Chi tiết món ăn trong combo)
--     FK -> combo, thucdon
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.combo_mon_an (
    id          SERIAL PRIMARY KEY,
    combo_id    INTEGER NOT NULL REFERENCES public.combo(id) ON DELETE CASCADE,
    mamon       VARCHAR NOT NULL REFERENCES public.thucdon(mamon) ON DELETE RESTRICT,
    soluong     INTEGER NOT NULL DEFAULT 1
);

-- ============================================================
--  SEED DATA — Tài khoản Admin mặc định
--  Chạy seed_admin.py để tạo hash bcrypt đúng,
--  hoặc bỏ comment lệnh INSERT bên dưới (password = Admin@123)
-- ============================================================
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
