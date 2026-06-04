--
-- PostgreSQL database dump
--

\restrict ru2cesnhoCEYuSoOBpmujlgkBWIQmXUWvckpFt4uT9MuA5mhsvqQqtjCWyjrlE0

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (id, makh, tongtien, trangthai, thoigiandat, hinhthucthanhtoan) VALUES ('OD-311A8EE9', 'KH024', 30000, 'cancelled', '2026-06-03 15:37:51', 'cash');


--
-- Data for Name: chitietdonhang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chitietdonhang (id, order_id, mamon, soluong, gia) VALUES (1, 'OD-311A8EE9', 'MON10', 1, 30000);


--
-- Data for Name: cosovatchat; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Bàn ăn 4 chỗ', '20', 'tot', 'vd1', 'ban_ghe', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Ghế nhựa', '80', 'tot', 'vd2', 'ban_ghe', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Ghế gỗ', '40', 'can_sua', 'vd3', 'ban_ghe', 'Một số ghế bị lung lay');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Băng dài', '10', 'tot', 'vd4', 'ban_ghe', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Bát inox', '200', 'tot', 'vd5', 'bat_dua', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Đũa tre', '500', 'tot', 'vd6', 'bat_dua', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Thìa inox', '150', 'tot', 'vd7', 'bat_dua', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Khay nhựa', '100', 'can_sua', 'vd8', 'bat_dua', 'Cần thay mới');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Nồi inox lớn', '5', 'tot', 'vd9', 'noi_nieu', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Chảo chống dính', '8', 'tot', 'vd10', 'noi_nieu', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Dao bếp', '15', 'tot', 'vd11', 'noi_nieu', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Thớt gỗ', '6', 'hong', 'vd12', 'noi_nieu', 'Cần thay mới');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Tủ lạnh công nghiệp', '2', 'tot', 'vd13', 'khac', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Máy pha cà phê', '1', 'can_sua', 'vd14', 'khac', 'Đang chờ sửa');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Bình nước nóng', '3', 'tot', 'vd15', 'khac', '');
INSERT INTO public.cosovatchat (ten, soluong, chatluong, id, danhmuc, ghichu) VALUES ('Đũa thần', '20', 'tot', 'vd_1780473680026', 'bat_dua', 'he');


--
-- Data for Name: daily_menu; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: danhmucmonan; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.danhmucmonan (id, name) VALUES (1, 'Món chính');
INSERT INTO public.danhmucmonan (id, name) VALUES (2, 'Đồ uống');
INSERT INTO public.danhmucmonan (id, name) VALUES (3, 'Ăn vặt');
INSERT INTO public.danhmucmonan (id, name) VALUES (4, 'Món chay');


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.departments (department_id, department_name) VALUES (1, 'IT');
INSERT INTO public.departments (department_id, department_name) VALUES (2, 'Sales');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.employees (employee_id, employee_name, department_id) VALUES (101, 'John Doe', 1);


--
-- Data for Name: khachhang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH001', 'Nguyễn Hải Đăng', 19, 'dang.nh20', 'pass123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH002', 'Lê Thị Mai Anh', 20, 'anh.ltm21', 'matkhau456', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH003', 'Trần Hoài Nam', 21, 'nam.th19', 'namtran@123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH004', 'Phạm Bảo Châu', 18, 'chau.pb22', 'chau1805', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH005', 'Hoàng Gia Bách', 20, 'bach.hg21', 'bachbach99', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH006', 'Vũ Thùy Linh', 22, 'linh.vt18', 'linhcute123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH007', 'Đặng Minh Quân', 19, 'quan.dm20', 'quanminh00', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH008', 'Bùi Phương Thảo', 20, 'thao.bp21', 'thaophuong88', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH009', 'Đỗ Anh Tuấn', 21, 'tuan.da19', 'tuando123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH010', 'Ngô Khánh Huyền', 19, 'huyen.nk20', 'huyenhuyen', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH011', 'Phan Văn Đức', 25, 'duc.pv_staff', 'staffpass01', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH012', 'Trịnh Kim Chi', 35, 'chi.tk_lecturer', 'gvchi2026', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH013', 'Lương Minh Triết', 18, 'triet.lm22', 'triet123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH014', 'Võ Ngọc Lan', 20, 'lan.vn21', 'ngoclan8x', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH015', 'Mai Xuân Trường', 23, 'truong.mx18', 'truongxuan', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH016', 'Đinh Quốc Anh', 19, 'anh.dq20', 'quocanh99', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH017', 'Hồ Thị Thanh', 40, 'thanh.ht_admin', 'admin_canteen', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH018', 'Lý Bảo Ngọc', 20, 'ngoc.lb21', 'baongoc2002', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH019', 'Tạ Minh Long', 21, 'long.tm19', 'longminh', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH020', 'Quách Thu Hà', 19, 'ha.qt20', 'thuha123', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH021', 'Trần Văn Tùng', 22, 'tung.tv18', 'tungvan99', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH022', 'Nguyễn Bích Diệp', 18, 'diep.nb22', 'diepdiep', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH023', 'Lê Anh Dũng', 30, 'dung.la_staff', 'dung1996', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH024', 'Phạm Hồng Nhung', 20, 'nhung.ph21', 'hongnhung', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH025', 'Dương Đình Trọng', 21, 'trong.dd19', 'trongdinh', NULL, 'Khách hàng', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH-987E7770', 'Quản trị viên', NULL, 'admin', '123456', NULL, 'Admin', true);
INSERT INTO public.khachhang (makh, ten, tuoi, taikhoan, matkhau, lichsudathang, vaitro, is_active) VALUES ('KH-D68DDFF2', NULL, NULL, 'testuser', '$2b$12$0xVWWyyh9wVcdHhtgvGssuCMxK.QUkONd0sJh9ub9Kpp9sV2mze8y', NULL, 'Khách hàng', true);


--
-- Data for Name: khohang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH001', 'Gạo tám thơm (kg)', 200, 18000, 'Còn hàng', 'Cái', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH002', 'Dầu ăn Neptune (lít)', 50, 45000, 'Còn hàng', 'Cái', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH003', 'Thịt lợn nạc vai (kg)', 30, 120000, 'Sắp hết hàng', 'Kg', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH004', 'Ức gà tươi (kg)', 25, 85000, 'Sắp hết hàng', 'Kg', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH005', 'Trứng gà (quả)', 500, 3200, 'Còn hàng', 'Gói', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH006', 'Cá rô phi phi lê (kg)', 15, 95000, 'Sắp hết hàng', 'Kg', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH007', 'Rau muống (bó)', 60, 5000, 'Còn hàng', 'Gói', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH008', 'Bắp cải Đà Lạt (kg)', 40, 15000, 'Sắp hết hàng', 'Cái', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH009', 'Cà chua (kg)', 20, 22000, 'Sắp hết hàng', 'Cái', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH010', 'Hành tây (kg)', 10, 18000, 'Sắp hết hàng', 'Cái', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH011', 'Gia vị tổng hợp (gói)', 100, 5000, 'Còn hàng', 'Gói', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH012', 'Nước mắm Nam Ngư (chai)', 24, 35000, 'Sắp hết hàng', 'Cái', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH013', 'Muối tinh (kg)', 20, 6000, 'Sắp hết hàng', 'Gói', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH014', 'Đường kính trắng (kg)', 30, 20000, 'Sắp hết hàng', 'Cái', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH015', 'Sữa tươi Vinamilk (thùng)', 10, 380000, 'Sắp hết hàng', 'Thùng', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH016', 'Nước suối Aquafina (chai)', 120, 4500, 'Còn hàng', 'Gói', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH017', 'Coca-Cola lon (thùng)', 15, 195000, 'Sắp hết hàng', 'Thùng', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH018', 'Bún tươi (kg)', 40, 12000, 'Sắp hết hàng', 'Cái', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH019', 'Mì tôm Hảo Hảo (thùng)', 20, 115000, 'Sắp hết hàng', 'Kg', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH020', 'Tương ớt Cholimex (chai)', 15, 12000, 'Sắp hết hàng', 'Cái', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH021', 'Nước rửa bát (can 5L)', 5, 110000, 'Sắp hết hàng', 'Kg', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH022', 'Khăn giấy ăn (gói)', 50, 15000, 'Còn hàng', 'Cái', 'Đại lý Tổng hợp Toàn Cầu');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH023', 'Xà phòng rửa tay (chai)', 10, 45000, 'Sắp hết hàng', 'Cái', 'Chợ Đầu mối Nông sản');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH024', 'Đậu phụ (miếng)', 200, 2500, 'Còn hàng', 'Gói', 'Công ty Thực phẩm An Bình');
INSERT INTO public.khohang (mahang, ten, soluong, gianhap, trangthai, donvi, nhacungcap) VALUES ('MH025', 'Khoai tây (kg)', 25, 20000, 'Sắp hết hàng', 'Cái', 'Công ty Thực phẩm An Bình');


--
-- Data for Name: khuyenmai; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (1, 'Giảm 10% toàn menu', '2026-06-30', 'KM1', 'Khuyen mai Giảm 10% toàn menu', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (2, 'Giảm 15% cho sinh viên PTIT', '2026-12-31', 'KM2', 'Khuyen mai Giảm 15% cho sinh viên PTIT', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (3, 'Mua 1 tặng 1 đồ uống', '2026-06-15', 'KM3', 'Khuyen mai Mua 1 tặng 1 đồ uống', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (4, 'Giảm 20.000đ cho hóa đơn từ 100K', '2026-07-31', 'KM4', 'Khuyen mai Giảm 20.000đ cho hóa đơn từ 100K', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (5, 'Miễn phí giao hàng tới ký túc xá', '2026-08-31', 'KM5', 'Khuyen mai Miễn phí giao hàng tới ký túc xá', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (6, 'Tặng 1 trà đá cho mỗi suất cơm', '2026-05-31', 'KM6', 'Khuyen mai Tặng 1 trà đá cho mỗi suất cơm', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (7, 'Giảm 5% khi thanh toán chuyển khoản', '2026-09-30', 'KM7', 'Khuyen mai Giảm 5% khi thanh toán chuyển khoản', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (8, 'Ưu đãi đi ăn nhóm 4 người (Giảm 20%)', '2026-10-31', 'KM8', 'Khuyen mai Ưu đãi đi ăn nhóm 4 người (Giảm 20%)', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (9, 'Combo sáng: Bánh mì & Cà phê chỉ 35K', '2026-06-30', 'KM9', 'Khuyen mai Combo sáng: Bánh mì & Cà phê chỉ 35K', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (10, 'Mua 2 suất bún/phở tặng quẩy', '2026-07-15', 'KM10', 'Khuyen mai Mua 2 suất bún/phở tặng quẩy', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (11, 'Giảm 50% món tráng miệng sau 13h', '2026-08-15', 'KM11', 'Khuyen mai Giảm 50% món tráng miệng sau 13h', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (12, 'Hoàn tiền 10% vào thẻ thành viên', '2026-12-31', 'KM12', 'Khuyen mai Hoàn tiền 10% vào thẻ thành viên', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (13, 'Happy Friday: Giảm 30% thứ 6 hàng tuần', '2026-11-30', 'KM13', 'Khuyen mai Happy Friday: Giảm 30% thứ 6 hàng tuần', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (14, 'Tặng kèm 1 xúc xích khi mua gà rán', '2026-06-20', 'KM14', 'Khuyen mai Tặng kèm 1 xúc xích khi mua gà rán', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);
INSERT INTO public.khuyenmai (id, ten, hansudung, ma, mota, loai, giatrigiam, dontooithieu, dadung, gioihan, trangthai, hoatdong) VALUES (15, 'Tuần lễ vàng: Đồng giá 25K đồ ăn vặt', '2026-06-05', 'KM15', 'Khuyen mai Tuần lễ vàng: Đồng giá 25K đồ ăn vặt', 'phan_tram', 10, 50000, 0, 100, 'dang_chay', 1);


--
-- Data for Name: nhanvien; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV001', 'Nguyễn Văn An', 35, 'Quản lý', 15000000, 'NV001@canteen.vn', '09035000', '01/01/2023', 'Ng', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV002', 'Trần Thị Bình', 28, 'Thu ngân', 8500000, 'NV002@canteen.vn', '09028000', '01/01/2023', 'Tr', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV003', 'Lê Hoàng Cường', 42, 'Đầu bếp chính', 12000000, 'NV003@canteen.vn', '09042000', '01/01/2023', 'Lê', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV004', 'Phạm Minh Đức', 24, 'Nhân viên phục vụ', 6000000, 'NV004@canteen.vn', '09024000', '01/01/2023', 'Ph', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV005', 'Vũ Thu Thảo', 22, 'Nhân viên phục vụ', 6000000, 'NV005@canteen.vn', '09022000', '01/01/2023', 'Vũ', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV006', 'Đặng Phan Anh', 30, 'Phụ bếp', 7500000, 'NV006@canteen.vn', '09030000', '01/01/2023', 'Đặ', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV007', 'Hoàng Ngọc Bích', 26, 'Thu ngân', 8500000, 'NV007@canteen.vn', '09026000', '01/01/2023', 'Ho', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV008', 'Ngô Tiến Dũng', 45, 'Bảo vệ', 7000000, 'NV008@canteen.vn', '09045000', '01/01/2023', 'Ng', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV009', 'Đỗ Thùy Chi', 23, 'Nhân viên phục vụ', 6000000, 'NV009@canteen.vn', '09023000', '01/01/2023', 'Đỗ', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV010', 'Bùi Xuân Hiếu', 33, 'Đầu bếp', 10000000, 'NV010@canteen.vn', '09033000', '01/01/2023', 'Bù', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV011', 'Lý Gia Bảo', 20, 'Nhân viên tiếp thực', 5500000, 'NV011@canteen.vn', '09020000', '01/01/2023', 'Lý', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV012', 'Trịnh Hoài Nam', 29, 'Phụ bếp', 7500000, 'NV012@canteen.vn', '09029000', '01/01/2023', 'Tr', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV013', 'Mai Phương Thúy', 25, 'Nhân viên phục vụ', 6000000, 'NV013@canteen.vn', '09025000', '01/01/2023', 'Ma', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV014', 'Đinh Văn Mạnh', 38, 'Nhân viên kho', 8000000, 'NV014@canteen.vn', '09038000', '01/01/2023', 'Đi', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV015', 'Quách Lan Hương', 31, 'Giám sát ca', 11000000, 'NV015@canteen.vn', '09031000', '01/01/2023', 'Qu', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV016', 'Lương Thế Vinh', 27, 'Nhân viên phục vụ', 6000000, 'NV016@canteen.vn', '09027000', '01/01/2023', 'Lư', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV017', 'Phan Thanh Tùng', 40, 'Đầu bếp chính', 12500000, 'NV017@canteen.vn', '09040000', '01/01/2023', 'Ph', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV018', 'Hà Minh Nguyệt', 21, 'Nhân viên phục vụ', 6000000, 'NV018@canteen.vn', '09021000', '01/01/2023', 'Hà', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV019', 'Trần Bảo Long', 34, 'Phụ bếp', 7500000, 'NV019@canteen.vn', '09034000', '01/01/2023', 'Tr', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV020', 'Nguyễn Diệu Linh', 24, 'Thu ngân', 8500000, 'NV020@canteen.vn', '09024000', '01/01/2023', 'Ng', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV021', 'Võ Văn Quyết', 50, 'Nhân viên vệ sinh', 5500000, 'NV021@canteen.vn', '09050000', '01/01/2023', 'Võ', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV022', 'Tạ Quang Khải', 22, 'Nhân viên phục vụ', 6000000, 'NV022@canteen.vn', '09022000', '01/01/2023', 'Tạ', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV023', 'Chu Thị Tuyết', 44, 'Nhân viên vệ sinh', 5500000, 'NV023@canteen.vn', '09044000', '01/01/2023', 'Ch', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV024', 'Lê Hồng Đăng', 28, 'Nhân viên phục vụ', 6000000, 'NV024@canteen.vn', '09028000', '01/01/2023', 'Lê', '#f9a8d4', 'Vừa xong');
INSERT INTO public.nhanvien (manv, ten, tuoi, chucvu, luong, email, sodienthoai, ngaybatdau, viettat, maunen, hoatdonggannhat) VALUES ('NV025', 'Nguyễn Khánh Ly', 26, 'Nhân viên pha chế', 8000000, 'NV025@canteen.vn', '09026000', '01/01/2023', 'Ng', '#f9a8d4', 'Vừa xong');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments (id, order_id, method, status, created_at) VALUES ('PAY-A862EFB5', 'OD-311A8EE9', 'cash', 'paid', '2026-06-01 16:57:15.205516');


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: thucdon; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON01', 'Cơm rang dưa bò', 35000, 50, '/uploads/anh1.jpg', 'Cơm rang hạt tơi, thịt bò xào dưa chua đậm vị.', 120, false, '{Cơm,Bò,"Ăn trưa"}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON02', 'Cơm sườn nướng mật ong', 35000, 40, '/uploads/anh2.jpg', 'Sườn non tẩm ướp mật ong nướng than hoa.', 85, false, '{Cơm,Heo,Nướng}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON03', 'Cơm gà xối mỡ', 35000, 60, '/uploads/anh3.jpg', 'Đùi gà xối mỡ giòn rụm bên ngoài, mềm ngọt bên trong.', 200, false, '{Cơm,Gà,Chiên}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON04', 'Cơm thịt băm mộc nhĩ', 25000, 30, '/uploads/anh4.jpg', 'Thịt heo băm xào mộc nhĩ nấm hương thơm lừng.', 55, false, '{Cơm,Heo,"Bình dân"}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON05', 'Cơm xá xíu trứng ốp la', 30000, 45, '/uploads/anh5.jpg', 'Thịt xá xíu đậm đà kèm trứng ốp la lòng đào.', 90, false, '{Cơm,Heo,Trứng}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON06', 'Cơm cá kho tộ', 30000, 25, '/uploads/anh6.jpg', 'Cá lóc kho tiêu ớt đậm đà, ăn đưa cơm.', 40, false, '{Cơm,Cá,"Truyền thống"}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON07', 'Cơm bò lúc lắc', 40000, 35, '/uploads/anh7.jpg', 'Thịt bò xắt hạt lựu xào mềm chua ngọt cùng ớt chuông.', 150, false, '{Cơm,Bò,Xào}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON08', 'Cơm đậu hũ sốt cà chua', 20000, 40, '/uploads/anh8.jpg', 'Đậu hũ chiên sốt cà chua thanh mát (Phù hợp ăn chay).', 30, false, '{Cơm,Chay,"Đậu hũ"}', 1);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON09', 'Phở bò tái lăn', 35000, 50, '/uploads/anh9.jpg', 'Phở xào thịt bò tỏi thơm lức mũi, nước dùng đậm đà.', 180, false, '{Phở,Bò,"Điểm tâm"}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON10', 'Phở gà lá chanh', 30000, 45, '/uploads/anh10.jpg', 'Nước dùng gà thanh ngọt, thịt gà ta xé phay rắc lá chanh.', 110, false, '{Phở,Gà,"Điểm tâm"}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON11', 'Bún chả Hà Nội', 35000, 60, '/uploads/anh11.jpg', 'Chả viên, chả miếng nướng than hoa, nước mắm chua ngọt.', 220, false, '{Bún,Heo,Nướng}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON12', 'Bún đậu mắm tôm', 30000, 40, '/uploads/anh12.jpg', 'Bún lá, đậu mơ chiên giòn, thịt luộc, chả cốm và mắm tôm.', 130, false, '{Bún,Đậu,"Ăn trưa"}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON13', 'Bún cá cay Hải Phòng', 35000, 30, '/uploads/anh13.jpg', 'Bún cá chiên giòn, dọc mùng, nước dùng chua cay kích thích vị giác.', 65, false, '{Bún,Cá,Cay}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON14', 'Bún bò Huế', 40000, 50, '/uploads/anh14.jpg', 'Bún sợi to, nạm bò, giò heo, nước dùng cay nồng hương sả ruốc.', 140, false, '{Bún,Bò,Cay}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON15', 'Mì xào giòn hải sản', 40000, 35, '/uploads/anh15.jpg', 'Mì chiên giòn rụm phủ hải sản tôm mực và rau củ.', 70, false, '{Mì,"Hải sản",Xào}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON16', 'Mì Ý sốt bò băm', 35000, 40, '/uploads/anh16.jpg', 'Spaghetti sốt cà chua bò băm phô mai béo ngậy.', 95, false, '{Mì,Bò,"Đồ Tây"}', 2);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON17', 'Bánh mì xíu mại', 20000, 70, '/uploads/anh17.jpg', 'Bánh mì giòn kẹp viên xíu mại nóng hổi, sốt chua ngọt.', 250, false, '{"Bánh mì","Ăn vặt",Sáng}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON18', 'Bánh mì heo quay', 25000, 65, '/uploads/anh18.jpg', 'Bánh mì kẹp thịt heo quay da giòn, mỡ hành xì dầu.', 190, false, '{"Bánh mì",Heo,Sáng}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON19', 'Bánh bao trứng cút', 15000, 50, '/uploads/anh19.jpg', 'Bánh bao nhân thịt băm, mộc nhĩ và 2 quả trứng cút.', 140, false, '{Bánh,Hấp,Sáng}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON20', 'Bánh cuốn chả quế', 25000, 40, '/uploads/anh20.jpg', 'Bánh cuốn nóng tráng mỏng, nhân thịt mộc nhĩ, ăn kèm chả quế.', 80, false, '{Bánh,Sáng,"Truyền thống"}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON21', 'Gà rán tẩm bột', 25000, 100, '/uploads/anh21.jpg', 'Cánh gà/Đùi gà tẩm bột chiên xù giòn rụm.', 300, false, '{"Ăn vặt",Gà,Chiên}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON22', 'Xúc xích nướng', 15000, 80, '/uploads/anh22.jpg', 'Xúc xích xiên que nướng than hoặc chiên bơ.', 450, false, '{"Ăn vặt",Nướng,Xiên}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON23', 'Bánh tráng nướng', 20000, 50, '/uploads/anh23.jpg', 'Pizza Việt Nam với trứng cút, khô bò, ruốc, hành lá.', 160, false, '{"Ăn vặt",Bánh,Nướng}', 3);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON24', 'Trà đào cam sả', 25000, 80, '/uploads/anh24.jpg', 'Trà thanh mát, giải nhiệt với đào miếng, cam tươi và sả.', 320, false, '{Trà,"Đồ uống","Giải khát"}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON25', 'Trà chanh giã tay', 20000, 100, '/uploads/anh25.jpg', 'Trà chanh Quảng Đông giã tay thơm mùi chanh nước cốt.', 410, false, '{Trà,"Đồ uống","Giải khát"}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON26', 'Cà phê đen đá', 15000, 60, '/uploads/anh26.jpg', 'Cà phê nguyên chất pha phin, đậm đà, giúp tỉnh táo.', 180, false, '{"Cà phê","Đồ uống",Sáng}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON27', 'Cà phê sữa đá', 20000, 70, '/uploads/anh27.jpg', 'Cà phê phin pha cùng sữa đặc ngọt béo thơm lừng.', 210, false, '{"Cà phê","Đồ uống",Sáng}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON28', 'Sinh tố bơ', 30000, 40, '/uploads/anh28.jpg', 'Bơ sáp xay nhuyễn cùng sữa đặc và đá bào lạnh.', 90, false, '{"Sinh tố","Đồ uống",Ngọt}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON29', 'Nước ép dưa hấu', 25000, 50, '/uploads/anh29.jpg', 'Nước ép dưa hấu tươi 100%, không thêm đường.', 150, false, '{"Nước ép","Đồ uống","Giải nhiệt"}', 4);
INSERT INTO public.thucdon (mamon, ten, gia, soluong, hinhanh, mieuta, soluongdaban, hethang, tags, danhmucid) VALUES ('MON30', 'Sữa chua trân châu', 25000, 60, '/uploads/anh30.jpg', 'Sữa chua dẻo mịn mát lạnh kèm trân châu cốt dừa béo ngậy.', 110, false, '{"Tráng miệng","Sữa chua",Ngọt}', 4);


--
-- Name: chitietdonhang_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chitietdonhang_id_seq', 1, true);


--
-- Name: daily_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_menu_id_seq', 1, false);


--
-- Name: danhmucmonan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.danhmucmonan_id_seq', 4, true);


--
-- Name: khuyenmai_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.khuyenmai_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict ru2cesnhoCEYuSoOBpmujlgkBWIQmXUWvckpFt4uT9MuA5mhsvqQqtjCWyjrlE0

