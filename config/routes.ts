export default [
	{
		path: '/',
		component: './TrangChu',
		layout: false,
	},
	{
		path: '/chinh-sach-bao-mat',
		component: './TrangChu/Component/Chính Sách Bảo Mật',
		layout: false,
	},
	{
		path: '/dieu-khoan-dich-vu',
		component: './TrangChu/Component/Điều khoản dịch vụ',
		layout: false,
	},
	{
		path: '/lien-he',
		component: './TrangChu/Component/Liên hệ',
		layout: false,
	},
	{
		path: '/dang-nhap',
		component: './KhachHang/đăng nhập',
		layout: false,
	},
	{
		path: '/dang-ky',
		component: './KhachHang/đăng nhập',
		layout: false,
	},
	{
		path: '/trang-chinh',
		component: './KhachHang/Trang chính',
		layout: false,
	},

	{
		path: '/dashboard',
		redirect: '/quan-tri/tong-quan',
	},

	// ── QuanTri ─────────────────────────────────
	{
		path: '/quan-tri',
		layout: false,
		component: './QuanTri/AdminLayout',
		routes: [
			{
				path: '/quan-tri/tong-quan',
				component: './QuanTri/Tổng Quan',
			},
			{
				path: '/quan-tri/don-hang',
				component: './QuanTri/Đơn Hàng',
			},
			{
				path: '/quan-tri/quan-ly-mon',
				component: './QuanTri/Quản Lý Món',
			},
			{
				path: '/quan-tri/kho-nguyen-lieu',
				component: './QuanTri/Kho Nguyên Liệu',
			},
			{
				path: '/quan-tri/khuyen-mai',
				component: './QuanTri/Khuyến Mãi',
			},
			{
				path: '/quan-tri/khach-hang',
				component: './QuanTri/KhachHang',
			},
			{
				path: '/quan-tri/nhan-vien',
				component: './QuanTri/Nhân Viên Căng Tin',
			},
			{
				path: '/quan-tri/co-so-vat-chat',
				component: './QuanTri/Cơ Sở Vật Chất',
			},
			{
				path: '/quan-tri/cai-dat',
				component: './QuanTri/Cài Đặt',
			},
			{
				path: '/quan-tri',
				redirect: '/quan-tri/tong-quan',
			},
		],
	},

	// ── Exception ─────────────────────────────────
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
