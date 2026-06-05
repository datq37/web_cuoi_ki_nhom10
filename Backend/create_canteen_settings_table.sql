-- ============================================================
--  TẠO BẢNG canteen_settings
--  Chạy file này trong Supabase > SQL Editor
-- ============================================================

-- Tạo bảng
CREATE TABLE IF NOT EXISTS public.canteen_settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- Seed: Thông tin căng tin mặc định
-- -------------------------------------------------------
INSERT INTO public.canteen_settings (key, value)
VALUES (
    'app_settings',
    '{
        "thongTin": {
            "ten": "Căng tin Doanh nghiệp",
            "diaChi": "Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM",
            "sdt": "0283 555 1234",
            "email": "canteen@abc.com.vn",
            "logo": "/logo.webp"
        },
        "gioHD": [
            {"label":"Thứ Hai",  "on":true,  "mo":"07:00","close":"18:00"},
            {"label":"Thứ Ba",   "on":true,  "mo":"07:00","close":"18:00"},
            {"label":"Thứ Tư",   "on":true,  "mo":"07:00","close":"18:00"},
            {"label":"Thứ Năm",  "on":true,  "mo":"07:00","close":"18:00"},
            {"label":"Thứ Sáu",  "on":true,  "mo":"07:00","close":"18:00"},
            {"label":"Thứ Bảy",  "on":true,  "mo":"08:00","close":"13:00"},
            {"label":"Chủ Nhật", "on":false, "mo":"08:00","close":"12:00"}
        ],
        "thanhToan": [
            {"id":"tien-mat",     "on":true},
            {"id":"chuyen-khoan", "on":true}
        ],
        "thongBao": [],
        "baoMat": {"twoFA":true,"autoLogout":true}
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------
-- Seed: Giờ hoạt động riêng (business_hours key)
-- -------------------------------------------------------
INSERT INTO public.canteen_settings (key, value)
VALUES (
    'business_hours',
    '[
        {"label":"Thứ Hai",  "on":true,  "mo":"07:00","close":"18:00"},
        {"label":"Thứ Ba",   "on":true,  "mo":"07:00","close":"18:00"},
        {"label":"Thứ Tư",   "on":true,  "mo":"07:00","close":"18:00"},
        {"label":"Thứ Năm",  "on":true,  "mo":"07:00","close":"18:00"},
        {"label":"Thứ Sáu",  "on":true,  "mo":"07:00","close":"18:00"},
        {"label":"Thứ Bảy",  "on":true,  "mo":"08:00","close":"13:00"},
        {"label":"Chủ Nhật", "on":false, "mo":"08:00","close":"12:00"}
    ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Kiểm tra kết quả
SELECT key, updated_at FROM public.canteen_settings;
