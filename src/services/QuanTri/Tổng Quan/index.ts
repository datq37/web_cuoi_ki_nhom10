import {
  EBannerIcon,
  EHoatDongType,
  ELoaiGhiChu,
  EStatIcon,
  ETrangThaiDon,
  ETrangThaiTrucTiep,
  ETrend,
} from './typing';
import type { TongQuanData } from './typing';

export const mockData: TongQuanData = {
  // tab tác nghiệp
  tacNghiep: {
    statCards: [
      { id: 'doanh-thu', label: 'DOANH THU HÔM NAY', value: 641000, valueDisplay: '641.000đ', changeText: '12.4% so với tuần trước', trend: ETrend.UP,   iconBg: '#dcfce7', iconColor: '#16a34a', icon: EStatIcon.REVENUE },
      { id: 'don-hang',  label: 'ĐƠN HÔM NAY',       value: 10,     valueDisplay: '10',        changeText: '8.2% so với tuần trước',  trend: ETrend.UP,   iconBg: '#dbeafe', iconColor: '#2563eb', icon: EStatIcon.ORDER },
      { id: 'xu-ly',     label: 'ĐANG XỬ LÝ',         value: 5,      valueDisplay: '5',         changeText: '3 chờ xác nhận',          trend: ETrend.DOWN, iconBg: '#ffedd5', iconColor: '#ea580c', icon: EStatIcon.PROCESSING },
      { id: 'khach',     label: 'KHÁCH PHỤC VỤ',       value: 9,      valueDisplay: '9',         changeText: '2 mới so với tuần trước', trend: ETrend.UP,   iconBg: '#ede9fe', iconColor: '#7c3aed', icon: EStatIcon.CUSTOMER },
    ],
    infoCard: {
      tiLeHoanThanh: 92,
      monBanChayNhat: { ten: 'Cơm gà xôi mỡ', soSuat: 128, hinhAnh: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=80&h=80&fit=crop' },
      khuyenMai: { ten: 'Giảm 15% đồ uống', conLai: 'Còn 2 ngày' },
      diemHaiLong: { diem: 4.8, soDanhGia: 256 },
    },
    doanhThu7Ngay: [
      { ngay: '09/05', doanhThu: 2800000 },
      { ngay: '10/05', doanhThu: 3100000 },
      { ngay: '11/05', doanhThu: 3300000 },
      { ngay: '12/05', doanhThu: 3600000 },
      { ngay: '13/05', doanhThu: 4000000 },
      { ngay: '14/05', doanhThu: 4520000 },
      { ngay: '15/05', doanhThu: 770000 },
    ],
    trangThaiDon: [
      { key: ETrangThaiDon.CHO_XAC_NHAN,  label: 'Chờ xác nhận',  value: 3, color: '#f97316' },
      { key: ETrangThaiDon.DANG_CHUAN_BI, label: 'Đang chuẩn bị', value: 7, color: '#eab308' },
      { key: ETrangThaiDon.DANG_GIAO,     label: 'Đang giao',      value: 9, color: '#3b82f6' },
      { key: ETrangThaiDon.HOAN_THANH,    label: 'Hoàn thành',     value: 4, color: '#16a34a' },
      { key: ETrangThaiDon.DA_HUY,        label: 'Đã hủy',         value: 1, color: '#9ca3af' },
    ],
    tongDonHomNay: 24,
    donGanDay: [
      { maDon: '#DH0256', khachHang: 'Nguyễn Văn A', phong: 'Phòng Kinh doanh', mon: 'Cơm gà xôi mỡ, Trà tắc',    tongTien: 65000, trangThai: ETrangThaiDon.DANG_CHUAN_BI, thoiGian: '10:30' },
      { maDon: '#DH0255', khachHang: 'Trần Thị B',   phong: 'Phòng Nhân sự',    mon: 'Phở bò, Nước suối',          tongTien: 55000, trangThai: ETrangThaiDon.DANG_GIAO,     thoiGian: '10:25' },
      { maDon: '#DH0254', khachHang: 'Lê Văn C',     phong: 'Phòng IT',         mon: 'Bún bò Huế, Trà đào',        tongTien: 60000, trangThai: ETrangThaiDon.HOAN_THANH,    thoiGian: '10:20' },
      { maDon: '#DH0253', khachHang: 'Phạm Thị D',   phong: 'Phòng Kế toán',   mon: 'Bánh mì, Cà phê sữa',        tongTien: 45000, trangThai: ETrangThaiDon.CHO_XAC_NHAN,  thoiGian: '10:15' },
      { maDon: '#DH0252', khachHang: 'Hoàng Văn E',  phong: 'Ban Giám đốc',    mon: 'Cơm chiên, Nước ép',         tongTien: 70000, trangThai: ETrangThaiDon.DA_HUY,         thoiGian: '10:05' },
    ],
    topMon: [
      { rank: 1, ten: 'Cơm gà xôi mỡ', hinhAnh: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=44&h=44&fit=crop', daBan: 128, donVi: 'suất', doanhThu: 5760000 },
      { rank: 2, ten: 'Phở bò',          hinhAnh: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=44&h=44&fit=crop', daBan: 96,  donVi: 'suất', doanhThu: 3648000 },
      { rank: 3, ten: 'Bún bò Huế',      hinhAnh: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=44&h=44&fit=crop', daBan: 87,  donVi: 'suất', doanhThu: 2784000 },
    ],
  },

  // tab trực tiếp
  trucTiep: {
    thongKe: { donCho: 1, dangCheBien: 2, sanSangGiao: 2, thoiGianTB: 6.4 },
    tomTat: { tongDon: 10, khachHang: 47, doanhThu: 641000, thoiGianTB: 6.4 },
    donHang: [
      {
        maDon: 'CT-2841', thoiGian: '11:42', trangThai: ETrangThaiTrucTiep.CHO_XAC_NHAN,
        khachHang: { ten: 'Trần Minh Anh', vietTat: 'MA', mauNen: '#f97316', mauChu: '#fff' },
        monAn: [{ ten: 'Bún đậu mắm tôm', soLuong: 1 }, { ten: 'Trà đào cam sả', soLuong: 1 }],
        ghiChu: 'Ít cay', loaiGhiChu: ELoaiGhiChu.IT_CAY, tongTien: 77000,
      },
      {
        maDon: 'CT-2840', thoiGian: '11:38', trangThai: ETrangThaiTrucTiep.DANG_CHE_BIEN,
        khachHang: { ten: 'Nguyễn Văn Hùng', vietTat: 'VH', mauNen: '#16a34a', mauChu: '#fff' },
        monAn: [{ ten: 'Cơm chiên Dương Châu', soLuong: 2 }, { ten: 'Cà phê sữa đá', soLuong: 2 }],
        tongTien: 116000,
      },
      {
        maDon: 'CT-2839', thoiGian: '11:35', trangThai: ETrangThaiTrucTiep.DANG_CHE_BIEN,
        khachHang: { ten: 'Lê Thị Hà', vietTat: 'TH', mauNen: '#0891b2', mauChu: '#fff' },
        monAn: [{ ten: 'Đậu hũ sốt cà chua', soLuong: 1 }, { ten: 'Rau muống xào tỏi', soLuong: 1 }],
        ghiChu: 'Không hành', loaiGhiChu: ELoaiGhiChu.KHONG_HANH, tongTien: 92000,
      },
      {
        maDon: 'CT-2838', thoiGian: '11:30', trangThai: ETrangThaiTrucTiep.SAN_SANG,
        khachHang: { ten: 'Phạm Quốc Bảo', vietTat: 'QB', mauNen: '#d97706', mauChu: '#fff' },
        monAn: [{ ten: 'Phở bò tái', soLuong: 1 }, { ten: 'Cà phê sữa đá', soLuong: 1 }],
        tongTien: 68000,
      },
      {
        maDon: 'CT-2837', thoiGian: '11:28', trangThai: ETrangThaiTrucTiep.SAN_SANG,
        khachHang: { ten: 'Đỗ Phương Linh', vietTat: 'PL', mauNen: '#e11d48', mauChu: '#fff' },
        monAn: [{ ten: 'Bánh mì thịt nướng', soLuong: 1 }, { ten: 'Trà đào cam sả', soLuong: 1 }],
        ghiChu: 'Mang đi', loaiGhiChu: ELoaiGhiChu.MANG_DI, tongTien: 58000,
      },
      {
        maDon: 'CT-2836', thoiGian: '11:15', trangThai: ETrangThaiTrucTiep.HOAN_THANH,
        khachHang: { ten: 'Hoàng Mạnh', vietTat: 'HM', mauNen: '#7c3aed', mauChu: '#fff' },
        monAn: [{ ten: 'Bún đậu mắm tôm', soLuong: 1 }, { ten: 'Chả giò rế', soLuong: 1 }],
        tongTien: 80000,
      },
      {
        maDon: 'CT-2835', thoiGian: '11:10', trangThai: ETrangThaiTrucTiep.HOAN_THANH,
        khachHang: { ten: 'Vũ Tuyết Mai', vietTat: 'TM', mauNen: '#dc2626', mauChu: '#fff' },
        monAn: [{ ten: 'Canh chua cá lóc', soLuong: 1 }, { ten: 'Rau muống xào tỏi', soLuong: 1 }],
        tongTien: 70000,
      },
    ],
  },

  // tab phân tích
  phanTich: {
    banners: [
      { id: 'revenue', label: 'DOANH THU HÔM NAY', value: '641.000đ', change: '+12.4% so với hôm qua', trend: ETrend.UP, icon: EBannerIcon.REVENUE },
      { id: 'order',   label: 'ĐƠN',               value: '10',        change: '+8.2%',                  trend: ETrend.UP, icon: EBannerIcon.ORDER },
      { id: 'customer',label: 'KHÁCH',              value: '47',        change: '+5 mới',                 trend: ETrend.UP, icon: EBannerIcon.CUSTOMER },
      { id: 'average', label: 'TRUNG BÌNH/ĐƠN',    value: '67k',       change: '+3.1%',                  trend: ETrend.UP, icon: EBannerIcon.AVERAGE },
    ],
    doanhThuTuan: [
      { tuan: 'T1',  tuanNay: 14200000, trungBinh: 16000000 },
      { tuan: 'T2',  tuanNay: 16500000, trungBinh: 16000000 },
      { tuan: 'T3',  tuanNay: 17800000, trungBinh: 16000000 },
      { tuan: 'T4',  tuanNay: 18400000, trungBinh: 16000000 },
      { tuan: 'T5',  tuanNay: 17500000, trungBinh: 16000000 },
      { tuan: 'T6',  tuanNay: 16000000, trungBinh: 16000000 },
      { tuan: 'T7',  tuanNay: 14000000, trungBinh: 16000000 },
      { tuan: 'T8',  tuanNay: 15200000, trungBinh: 16000000 },
      { tuan: 'T9',  tuanNay: 15600000, trungBinh: 16000000 },
      { tuan: 'T10', tuanNay: 18600000, trungBinh: 16000000 },
      { tuan: 'T11', tuanNay: 21000000, trungBinh: 16000000 },
      { tuan: 'T12', tuanNay: 22400000, trungBinh: 16000000 },
    ],
    danhMuc: [
      { ten: 'Món chính', tyLe: 58, mau: '#16a34a' },
      { ten: 'Đồ uống',   tyLe: 22, mau: '#3b82f6' },
      { ten: 'Ăn vặt',    tyLe: 12, mau: '#f97316' },
      { ten: 'Món chay',  tyLe: 8,  mau: '#8b5cf6' },
    ],
    tongDanhMuc: 9,
    topMon: [
      { rank: 1, ten: 'Cơm gà xôi mỡ',  hinhAnh: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=40&h=40&fit=crop', daBan: 128, donVi: 'suất', doanhThu: 5760000 },
      { rank: 2, ten: 'Phở bò',           hinhAnh: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=40&h=40&fit=crop', daBan: 96,  donVi: 'suất', doanhThu: 3648000 },
      { rank: 3, ten: 'Trà đào cam sả',   hinhAnh: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=40&h=40&fit=crop',  daBan: 88,  donVi: 'ly',   doanhThu: 1936000 },
      { rank: 4, ten: 'Bún chả',          hinhAnh: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=40&h=40&fit=crop', daBan: 75,  donVi: 'suất', doanhThu: 1575000 },
      { rank: 5, ten: 'Salad trộn',       hinhAnh: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=40&h=40&fit=crop', daBan: 56,  donVi: 'suất', doanhThu: 1120000 },
    ],
    donTheoTrangThai: [
      { key: ETrangThaiDon.CHO_XAC_NHAN,  ten: 'Chờ xác nhận',  soDon: 3, tyLe: 30, mau: '#f97316' },
      { key: ETrangThaiDon.DANG_CHUAN_BI, ten: 'Đang chuẩn bị', soDon: 4, tyLe: 40, mau: '#3b82f6' },
      { key: ETrangThaiDon.DANG_GIAO,     ten: 'Đang giao',      soDon: 2, tyLe: 20, mau: '#8b5cf6' },
      { key: ETrangThaiDon.HOAN_THANH,    ten: 'Hoàn thành',     soDon: 1, tyLe: 10, mau: '#16a34a' },
      { key: ETrangThaiDon.DA_HUY,        ten: 'Đã hủy',         soDon: 0, tyLe: 0,  mau: '#9ca3af' },
    ],
    hieuSuat: [
      { label: 'Thời gian xử lý trung bình', value: '8',   unit: 'phút', change: '-2 phút', changeDetail: 'so với tuần trước', trend: ETrend.DOWN },
      { label: 'Tỷ lệ giao đúng hạn',        value: '96',  unit: '%',    change: '+4%',     changeDetail: 'so với tuần trước', trend: ETrend.UP },
      { label: 'Đánh giá trung bình',         value: '4.6', unit: '/5',   change: '+0.2',    changeDetail: 'so với tuần trước', trend: ETrend.UP },
    ],
    hoatDong: [
      { id: '1', type: EHoatDongType.ORDER,     tieuDe: 'Đơn hàng #DH1023',    moTa: 'Đã hoàn thành · Salad ức gà sốt mè', thoiGian: '2 phút trước',  mauIcon: '#16a34a', bgIcon: '#f0fdf4' },
      { id: '2', type: EHoatDongType.MENU,      tieuDe: 'Thêm món mới',         moTa: 'Salad ức gà sốt mè',                 thoiGian: '15 phút trước', mauIcon: '#2563eb', bgIcon: '#eff6ff' },
      { id: '3', type: EHoatDongType.WAREHOUSE, tieuDe: 'Nhập kho nguyên liệu', moTa: 'Thịt gà 5kg',                        thoiGian: '1 giờ trước',   mauIcon: '#d97706', bgIcon: '#fffbeb' },
      { id: '4', type: EHoatDongType.DELIVERY,  tieuDe: 'Đơn hàng #DH1022',    moTa: 'Đang giao',                          thoiGian: '2 giờ trước',   mauIcon: '#7c3aed', bgIcon: '#f5f3ff' },
      { id: '5', type: EHoatDongType.PROMO,     tieuDe: 'Khuyến mãi mới',       moTa: 'Giảm 15% combo trưa',                thoiGian: '3 giờ trước',   mauIcon: '#e11d48', bgIcon: '#fff1f2' },
    ],
  },
};
