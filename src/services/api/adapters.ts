import { OrderResponse, KhachHangResponse, ThucDonResponse, OrderStatus } from './types';
import { Order, OrderItem } from '@/services/KhachHang/Đơn Hàng/typing';
import { Dish } from '@/services/KhachHang/ThucDon/typing';
import { EVaiTro, ETrangThaiKhach, IKhachHang } from '@/services/QuanTri/KhachHang/typing';

export const SyncAdapters = {
  /**
   * Chuyển đổi dữ liệu Đơn Hàng (Backend) -> Đơn Hàng (Frontend UI)
   */
  mapOrderResponseToUI(apiOrder: OrderResponse): Order {
    return {
      id: apiOrder.maDon,
      user: apiOrder.maKh,
      userName: 'Khách hàng', // BE chưa trả về tên người đặt trong OrderResponse
      dept: 'Căng tin', 
      total: apiOrder.tongTien,
      status: apiOrder.trangThai as unknown as any,
      payment: apiOrder.hinhthucthanhtoan as any,
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
      cat: 'main', // Map từ danh mục thực tế nếu cần
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
  }
};
