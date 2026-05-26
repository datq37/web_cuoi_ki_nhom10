export default [
	{
		path: '/',
		component: './Trang Chủ',
		layout: false,
	},
	{
		path: '/chinh-sach-bao-mat',
		component: './Trang Chủ/Component/Chính Sách Bảo Mật',
		layout: false,
	},
	{
		path: '/dieu-khoan-dich-vu',
		component: './Trang Chủ/Component/Điều khoản dịch vụ',
		layout: false,
	},
	{
		path: '/lien-he',
		component: './Trang Chủ/Component/Liên hệ',
		layout: false,
	},
	{
		path: '/dang-nhap',
		component: './Khách Hàng/đăng nhập',
		layout: false,
	},
	{
		path: '/dang-ky',
		component: './Khách Hàng/đăng nhập',
		layout: false,
	},
	{
		path: '/trang-chinh',
		component: './Khách Hàng/Trang chính',
		layout: false,
	},
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},
	{
		path: '/dashboard',
		redirect: '/quan-tri/tong-quan',
	},

	// ── Quản Trị ─────────────────────────────────
	{
		path: '/quan-tri',
		layout: false,
		routes: [
			{
				path: '/quan-tri/tong-quan',
				component: './Quản Trị/Tổng Quan',
			},
			{
				path: '/quan-tri/don-hang',
				component: './Quản Trị/Đơn Hàng',
			},
			{
				path: '/quan-tri/quan-ly-mon',
				component: './Quản Trị/Quản Lý Món',
			},
			{
				path: '/quan-tri/kho-nguyen-lieu',
				component: './Quản Trị/Kho Nguyên Liệu',
			},
			{
				path: '/quan-tri/khuyen-mai',
				component: './Quản Trị/Khuyến Mãi',
			},
			{
				path: '/quan-tri/khach-hang',
				component: './Quản Trị/Khách Hàng',
			},
			{
				path: '/quan-tri/nhan-vien',
				component: './Quản Trị/Nhân Viên Căng Tin',
			},
			{
				path: '/quan-tri/cai-dat',
				component: './Quản Trị/Cài Đặt',
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
