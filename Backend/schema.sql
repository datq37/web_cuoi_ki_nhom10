-- public.cosovatchat definition

-- Drop table

-- DROP TABLE public.cosovatchat;

CREATE TABLE public.cosovatchat (
	ten varchar NULL,
	soluong varchar NULL,
	chatluong varchar NULL
);

-- Permissions

ALTER TABLE public.cosovatchat OWNER TO postgres;
GRANT ALL ON TABLE public.cosovatchat TO postgres;


-- public.khachhang definition

-- Drop table

-- DROP TABLE public.khachhang;

CREATE TABLE public.khachhang (
	makh varchar NOT NULL,
	ten varchar NULL,
	tuoi int4 NULL,
	taikhoan varchar NULL,
	matkhau varchar NULL,
	lichsudathang varchar NULL,
	vaitro varchar NULL DEFAULT 'Khách hàng'
);

-- Permissions

ALTER TABLE public.khachhang OWNER TO postgres;
GRANT ALL ON TABLE public.khachhang TO postgres;


-- public.khohang definition

-- Drop table

-- DROP TABLE public.khohang;

CREATE TABLE public.khohang (
	mahang varchar NOT NULL,
	ten varchar NULL,
	soluong float8 NULL,
	gianhap numeric NULL,
	trangthai varchar NULL
);

-- Permissions

ALTER TABLE public.khohang OWNER TO postgres;
GRANT ALL ON TABLE public.khohang TO postgres;


-- public.nhanvien definition

-- Drop table

-- DROP TABLE public.nhanvien;

CREATE TABLE public.nhanvien (
	manv varchar NOT NULL,
	ten varchar NULL,
	tuoi int4 NULL,
	chucvu varchar NULL,
	luong float8 NULL
);

-- Permissions

ALTER TABLE public.nhanvien OWNER TO postgres;
GRANT ALL ON TABLE public.nhanvien TO postgres;


-- public.orders definition

-- Drop table

-- DROP TABLE public.orders;

CREATE TABLE public.orders (
	id varchar NULL,
	makh varchar NULL,
	tongtien float8 NULL,
	trangthai varchar NULL,
	thoigiandat varchar NULL,
	hinhthucthanhtoan varchar NULL
);

-- Permissions

ALTER TABLE public.orders OWNER TO postgres;
GRANT ALL ON TABLE public.orders TO postgres;

-- public.thucdon definition

-- Drop table

-- DROP TABLE public.thucdon;

-- public.thucdon definition

-- Drop table

-- DROP TABLE public.thucdon;

CREATE TABLE public.thucdon (
	mamon varchar NOT NULL,
	ten varchar NULL,
	gia float8 NULL,
	soluong int4 NULL,
	hinhanh text NULL,
	mieuta text NULL,
	soluongdaban int4 NULL,
	hethang bool NULL DEFAULT false,
	tags _varchar NULL,
	danhmucid int4 NULL
);

-- Permissions

ALTER TABLE public.thucdon OWNER TO postgres;
GRANT ALL ON TABLE public.thucdon TO postgres;


-- public.khuyenmai definition

-- Drop table

-- DROP TABLE public.khuyenmai;

CREATE TABLE public.khuyenmai (
	id serial4 NOT NULL,
	ten varchar NULL,
	hansudung date NULL
);

-- Permissions

ALTER TABLE public.khuyenmai OWNER TO postgres;
GRANT ALL ON TABLE public.khuyenmai TO postgres;


-- public.reviews definition

-- Drop table

-- DROP TABLE public.reviews;

CREATE TABLE public.reviews (
	id serial4 NOT NULL,
	user_id varchar NULL,
	menu_item_id varchar NULL,
	rating int4 NULL,
	"comment" text NULL,
	created_at timestamp NULL
);

-- Permissions

ALTER TABLE public.reviews OWNER TO postgres;
GRANT ALL ON TABLE public.reviews TO postgres;


-- public.daily_menu definition

-- Drop table

-- DROP TABLE public.daily_menu;

CREATE TABLE public.daily_menu (
	id serial4 NOT NULL,
	serve_date date NULL,
	menu_item_id int4 NULL
);

-- Permissions

ALTER TABLE public.daily_menu OWNER TO postgres;
GRANT ALL ON TABLE public.daily_menu TO postgres;


-- public.danhmucmonan definition

-- Drop table

-- DROP TABLE public.danhmucmonan;

CREATE TABLE public.danhmucmonan (
	id serial4 NOT NULL,
	"name" varchar(100) NULL
);

-- Permissions

ALTER TABLE public.danhmucmonan OWNER TO postgres;
GRANT ALL ON TABLE public.danhmucmonan TO postgres;