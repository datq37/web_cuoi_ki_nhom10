import { OrderResponse, KhachHangResponse, ThucDonResponse } from './types';
import { Order, OrderItem } from '@/services/KhachHang/Đơn Hàng/typing';
import { OrderStatus as UIOrderStatus, PaymentMethod as UIPaymentMethod } from '@/services/KhachHang/Đơn Hàng/index';
import { Dish } from '@/services/KhachHang/ThucDon/typing';
import { EVaiTro, ETrangThaiKhach, IKhachHang } from '@/services/QuanTri/KhachHang/typing';

const formatApiDateToDisplay = (value?: string) => {
  if (!value) return '';
  const datePart = String(value).split('T')[0];
  const parts = datePart.split('-');
  if (parts.length !== 3) return String(value);

  const [year, month, day] = parts;
  return `${Number(day)}/${Number(month)}/${year}`;
};

export const SyncAdapters = {
  /**
   * Chuyển đổi dữ liệu Đơn Hàng (Backend) -> Đơn Hàng (Frontend UI)
   */
  mapOrderResponseToUI(apiOrder: OrderResponse): Order {
    // Chuyển đổi trạng thái từ Backend sang Frontend
    let mappedStatus = UIOrderStatus.Pending;
    switch (apiOrder.trangThai as string) {
      case 'pending_confirmation':
      case 'cart':
        mappedStatus = UIOrderStatus.Pending;
        break;
      case 'confirmed':
      case 'processing':
        mappedStatus = UIOrderStatus.Preparing;
        break;
      case 'delivered':
        mappedStatus = UIOrderStatus.Done;
        break;
      case 'cancelled':
        mappedStatus = UIOrderStatus.Cancelled;
        break;
      default:
        // Fallback an toàn nếu lỡ có trạng thái khớp sẵn
        mappedStatus = (apiOrder.trangThai as unknown as UIOrderStatus) || UIOrderStatus.Pending;
    }

    // Chuyển đổi phương thức thanh toán
    let mappedPayment = UIPaymentMethod.Cash;
    const paymentStr = apiOrder.hinhthucthanhtoan as string;
    if (paymentStr === 'banking' || paymentStr === 'qr') {
      mappedPayment = UIPaymentMethod.QR;
    } else if (paymentStr === 'cash') {
      mappedPayment = UIPaymentMethod.Cash;
    }

    return {
      id: apiOrder.maDon,
      user: apiOrder.maKh,
      userName: 'Khách hàng', // BE chưa trả về tên người đặt trong OrderResponse
      dept: 'Căng tin',
      total: apiOrder.tongTien,
      status: mappedStatus,
      payment: mappedPayment,
      created: apiOrder.thoiGianDat || '',
      pickup: '',
      items: (apiOrder.chitiet || []).map((ct): OrderItem => ({
        id: ct.mamon,
        name: ct.thucdon?.ten || 'Món ăn',
        qty: ct.soluong,
        price: ct.gia || 0,
      })),
    };
  },

  /**
   * Chuyển đổi dữ liệu Món Ăn (Backend) -> Món Ăn (Frontend UI)
   */
  mapMenuToUI(apiDish: ThucDonResponse): Dish {
    return {
      id: apiDish.mamon,
      name: apiDish.ten || '',
      cat: String(apiDish.danhmucid) || 'all',
      price: apiDish.gia || 0,
      desc: apiDish.mieuta || '',
      emoji: '🍱',
      tags: apiDish.tags || [],
      rating: 5,
      sold: apiDish.soluongdaban || 0,
      prep: 10,
      kcal: 0,
      ingredients: [],
      hinhAnh: apiDish.hinhanh,
    };
  },

  /**
   * Chuyển đổi dữ liệu Khách Hàng (Backend) -> Khách Hàng (Frontend UI)
   */
  mapCustomerToUI(apiCustomer: KhachHangResponse): IKhachHang {
    let mappedVaiTro = EVaiTro.NHAN_VIEN;
    const backendRoleStr = (apiCustomer.vaitro || '').toLowerCase();

    if (backendRoleStr.includes('admin') || backendRoleStr.includes('giám đốc') || backendRoleStr.includes('giam doc')) {
      mappedVaiTro = EVaiTro.GIAM_DOC;
    } else if (backendRoleStr.includes('trưởng phòng') || backendRoleStr.includes('truong phong')) {
      mappedVaiTro = EVaiTro.TRUONG_PHONG;
    }

    const ten = apiCustomer.ten || apiCustomer.taikhoan || 'Chưa cập nhật';

    // Tạo màu ngẫu nhiên nhưng ổn định dựa trên mã khách
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
    const charCode = ten.charCodeAt(0) || 0;
    const color = colors[charCode % colors.length];

    return {
      id: apiCustomer.makh,
      hoTen: ten,
      email: apiCustomer.taikhoan || '',
      vietTat: ten.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'NA',
      mauNen: color,
      phongBan: 'Chung', // Backend chưa có phòng ban
      vaiTro: mappedVaiTro,
      soDon: 0, // Backend chưa trả về
      chiTieu: 0, // Backend chưa trả về
      thamGia: apiCustomer.lichsudathang || 'Gần đây',
      trangThai: ETrangThaiKhach.HOAT_DONG, // Mặc định do BE chưa có trạng thái
    };
  },

  /**
   * Chuyển đổi dữ liệu Đơn Hàng (Backend) -> Đơn Hàng Quản Trị (Frontend UI)
   */
  mapAdminOrderToUI(apiOrder: OrderResponse): any {
    return {
      maDon: apiOrder.maDon,
      thoiGian: apiOrder.thoiGianDat ? apiOrder.thoiGianDat.split('T')[0] : 'Vừa xong',
      khachHang: {
        ten: apiOrder.maKh, // BE chưa join tên KH trong OrderResponse nên hiển thị mã
        vietTat: apiOrder.maKh.substring(0, 2).toUpperCase(),
        mauNen: '#3b82f6',
        mauChu: '#ffffff',
        phong: 'N/A'
      },
      monAn: (apiOrder.chitiet || []).map(ct => ({
        ten: ct.thucdon?.ten || ct.mamon || 'Món',
        soLuong: ct.soluong
      })),
      ghiChu: apiOrder.hinhthucthanhtoan === 'banking' ? 'Chuyển khoản' : 'Tiền mặt',
      tongTien: apiOrder.tongTien,
      trangThai: apiOrder.trangThai
    };
  },

  /**
   * Chuyển đổi dữ liệu Thực Đơn (Backend) -> Thực Đơn Quản Trị (Frontend UI)
   */
  mapAdminMenuToUI(apiDish: ThucDonResponse): any {
    const PRESET_GRADIENTS = [
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
      'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
      'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    ];

    // Hash mã món để chọn màu nền ổn định
    const charCode = (apiDish.mamon || '').charCodeAt(0) || 0;
    const mauNen = PRESET_GRADIENTS[charCode % PRESET_GRADIENTS.length];

    return {
      id: apiDish.mamon,
      ten: apiDish.ten || 'Món chưa tên',
      moTa: apiDish.mieuta || '',
      danhMuc: apiDish.danhmucid ?? 'tat_ca',
      giaBan: apiDish.gia || 0,
      thoiGian: 10, // Mock (Backend missing thoiGian)
      calo: 0, // Mock (Backend missing calo)
      danhGia: 5.0, // Mock
      isHot: false,
      mauNen,
      hinhAnh: apiDish.hinhanh,
      coSan: !apiDish.hethang,
      nguyenLieu: []
    };
  },

  /**
   * Chuyển đổi dữ liệu Kho Hàng (Backend) -> Nguyên Liệu Quản Trị (Frontend UI)
   */
  mapAdminInventoryToUI(apiItem: any): any {
    let mappedTrangThai = 'du_hang';
    if (apiItem.trangthai) {
      const t = apiItem.trangthai.toLowerCase();
      if (t.includes('hết') || t.includes('het')) mappedTrangThai = 'het_hang';
      else if (t.includes('sắp') || t.includes('sap')) mappedTrangThai = 'sap_het';
    } else {
      if (apiItem.soluong === 0) mappedTrangThai = 'het_hang';
      else if (apiItem.soluong < 10) mappedTrangThai = 'sap_het';
    }

    return {
      id: apiItem.mahang,
      ten: apiItem.ten || 'Không tên',
      donVi: apiItem.donvi || 'kg',
      nhaCungCap: apiItem.nhacungcap || 'Nhà cung cấp',
      tonKho: apiItem.soluong || 0,
      mucToiThieu: 10, // Mock (not in DB yet)
      giaNhap: apiItem.gianhap || 0,
      trangThai: mappedTrangThai
    };
  },

  /**
   * Chuyển đổi dữ liệu Khuyến Mãi (Backend) -> UI (Frontend)
   */
  mapAdminPromoToUI(apiItem: any): any {
    return {
      id: apiItem.id?.toString(),
      ma: apiItem.ma || '',
      ten: apiItem.ten || '',
      moTa: apiItem.mota || '',
      loai: apiItem.loai || 'phan_tram',
      giaTriGiam: apiItem.giatrigiam || 0,
      donToiThieu: apiItem.dontooithieu || 0,
      daDung: apiItem.dadung || 0,
      gioiHan: apiItem.gioihan || 0,
      hetHan: formatApiDateToDisplay(apiItem.hansudung),
      trangThai: apiItem.trangthai || 'dang_chay',
      hoatDong: Boolean(apiItem.hoatdong ?? true),
    };
  },

  /**
   * Chuyển đổi dữ liệu Combo (Backend) -> UI (Frontend)
   */
  mapAdminComboToUI(apiItem: any): any {
    return {
      id: apiItem.id?.toString(),
      ten: apiItem.ten || '',
      moTa: apiItem.mota || '',
      monAnIds: apiItem.monAnIds || apiItem.mon_an_ids || [],
      loaiGia: apiItem.loaiGia || apiItem.loai_gia || 'phan_tram',
      giaTriGiam: apiItem.giaTriGiam ?? apiItem.gia_tri_giam ?? 0,
      hetHan: formatApiDateToDisplay(apiItem.hansudung),
      trangThai: apiItem.trangthai || 'dang_chay',
      hoatDong: Boolean(apiItem.hoatdong ?? true),
    };
  }
};
