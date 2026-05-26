export default [
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

	// Redirect gốc về trang quản trị
	{
		path: '/',
		redirect: '/quan-tri/tong-quan',
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
				path: '/quan-tri/co-so-vat-chat',
				component: './Quản Trị/Cơ Sở Vật Chất',
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
