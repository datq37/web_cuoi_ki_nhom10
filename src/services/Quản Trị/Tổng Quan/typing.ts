// enum
export enum ETabKey {
  TAC_NGHIEP = 'tac_nghiep',
  PHAN_TICH  = 'phan_tich',
}

export enum ETrangThaiTrucTiep {
  CHO_XAC_NHAN  = 'cho_xac_nhan',
  DANG_CHE_BIEN = 'dang_che_bien',
  SAN_SANG      = 'san_sang',
  HOAN_THANH    = 'hoan_thanh',
}

export enum ELoaiGhiChu {
  IT_CAY     = 'it_cay',
  KHONG_HANH = 'khong_hanh',
  MANG_DI    = 'mang_di',
}

export enum ETrangThaiDon {
  CHO_XAC_NHAN  = 'cho_xac_nhan',
  DANG_CHUAN_BI = 'dang_chuan_bi',
  DANG_GIAO     = 'dang_giao',
  HOAN_THANH    = 'hoan_thanh',
  DA_HUY        = 'da_huy',
}

export enum ETrend {
  UP   = 'up',
  DOWN = 'down',
}

export enum EBannerIcon {
  REVENUE  = 'revenue',
  ORDER    = 'order',
  CUSTOMER = 'customer',
  AVERAGE  = 'average',
}

export enum EStatIcon {
  REVENUE    = 'revenue',
  ORDER      = 'order',
  PROCESSING = 'processing',
  CUSTOMER   = 'customer',
}

export enum EHoatDongType {
  ORDER     = 'order',
  MENU      = 'menu',
  WAREHOUSE = 'warehouse',
  DELIVERY  = 'delivery',
  PROMO     = 'promo',
}

// live kanban
export interface KhachHangTT {
  ten: string;
  vietTat: string;
  mauNen: string;
  mauChu: string;
}

export interface MonDat {
  ten: string;
  soLuong: number;
}

export interface DonTrucTiep {
  maDon: string;
  thoiGian: string;
  khachHang: KhachHangTT;
  monAn: MonDat[];
  ghiChu?: string;
  loaiGhiChu?: ELoaiGhiChu;
  tongTien: number;
  trangThai: ETrangThaiTrucTiep;
}

export interface ThongKeTrucTiep {
  donCho: number;
  dangCheBien: number;
  sanSangGiao: number;
  thoiGianTB: number;
}

export interface TomTatHomNay {
  tongDon: number;
  khachHang: number;
  doanhThu: number;
  thoiGianTB: number;
}

// phân tích
export interface StatBanner {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: ETrend;
  icon: EBannerIcon;
}

export interface DoanhThuTuanItem {
  tuan: string;
  tuanNay: number;
  trungBinh: number;
}

export interface DanhMucTyLe {
  ten: string;
  tyLe: number;
  mau: string;
}

export interface TopMonItem {
  rank: number;
  ten: string;
  hinhAnh: string;
  daBan: number;
  donVi: string;
  doanhThu: number;
}

export interface DonTheoTrangThaiItem {
  key: string;
  ten: string;
  soDon: number;
  tyLe: number;
  mau: string;
}

export interface HieuSuatItem {
  label: string;
  value: string;
  unit: string;
  change: string;
  changeDetail: string;
  trend: ETrend;
}

export interface HoatDongItem {
  id: string;
  tieuDe: string;
  moTa: string;
  thoiGian: string;
  mauIcon: string;
  bgIcon: string;
  type: EHoatDongType;
}

// tác nghiệp
export interface StatCard {
  id: string;
  label: string;
  value: number;
  valueDisplay: string;
  changeText: string;
  trend: ETrend;
  iconBg: string;
  iconColor: string;
  icon: EStatIcon;
}

export interface InfoCardData {
  tiLeHoanThanh: number;
  monBanChayNhat: { ten: string; soSuat: number; hinhAnh: string };
  khuyenMai: { ten: string; conLai: string };
  diemHaiLong: { diem: number; soDanhGia: number };
}

export interface DonGanDay {
  maDon: string;
  khachHang: string;
  phong: string;
  mon: string;
  tongTien: number;
  trangThai: ETrangThaiDon;
  thoiGian: string;
}

export interface DoanhThuNgay {
  ngay: string;
  doanhThu: number;
}

export interface TrangThaiDonStat {
  key: string;
  label: string;
  value: number;
  color: string;
}

// root data shape
export interface TongQuanData {
  tacNghiep: {
    statCards: StatCard[];
    infoCard: InfoCardData;
    doanhThu7Ngay: DoanhThuNgay[];
    trangThaiDon: TrangThaiDonStat[];
    tongDonHomNay: number;
    donGanDay: DonGanDay[];
    topMon: TopMonItem[];
  };
  trucTiep: {
    thongKe: ThongKeTrucTiep;
    donHang: DonTrucTiep[];
    tomTat: TomTatHomNay;
  };
  phanTich: {
    banners: StatBanner[];
    doanhThuTuan: DoanhThuTuanItem[];
    danhMuc: DanhMucTyLe[];
    tongDanhMuc: number;
    topMon: TopMonItem[];
    donTheoTrangThai: DonTheoTrangThaiItem[];
    hieuSuat: HieuSuatItem[];
    hoatDong: HoatDongItem[];
  };
}
