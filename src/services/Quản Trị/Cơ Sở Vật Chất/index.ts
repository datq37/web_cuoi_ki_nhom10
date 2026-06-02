import { ELoaiBan, ETrangThaiBan, IKhuVuc } from './typing';

export const TRANG_THAI_BAN_CONFIG: Record<
  ETrangThaiBan,
  { label: string; color: string; bg: string }
> = {
  [ETrangThaiBan.SAN_SANG]:  { label: 'Sẵn sàng',   color: '#16a34a', bg: '#dcfce7' },
  [ETrangThaiBan.DANG_DUNG]: { label: 'Đang dùng',  color: '#ea580c', bg: '#ffedd5' },
  [ETrangThaiBan.BAO_TRI]:   { label: 'Bảo trì',    color: '#dc2626', bg: '#fee2e2' },
};

export const LOAI_BAN_LABEL: Record<ELoaiBan, string> = {
  [ELoaiBan.DOI]: '2 chỗ',
  [ELoaiBan.BON]: '4 chỗ',
  [ELoaiBan.SAU]: '6 chỗ',
  [ELoaiBan.TAM]: '8 chỗ',
};

export const SUC_CHUA_LOAI: Record<ELoaiBan, number> = {
  [ELoaiBan.DOI]: 2,
  [ELoaiBan.BON]: 4,
  [ELoaiBan.SAU]: 6,
  [ELoaiBan.TAM]: 8,
};

export const PRESET_COLORS = [
  '#3b82f6', '#16a34a', '#7c3aed', '#ea580c',
  '#0891b2', '#db2777', '#854d0e', '#374151',
];

export const DANH_SACH_KHU_VUC: IKhuVuc[] = [
  {
    id: 'kv_a',
    ten: 'Khu A – Trong nhà',
    moTa: 'Khu ăn uống chính có điều hoà, sức chứa lớn',
    mau: '#3b82f6',
    danhSachBan: [
      { id: 'b_a01', so: 'A01', loai: ELoaiBan.BON, sucChua: 4, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_a02', so: 'A02', loai: ELoaiBan.BON, sucChua: 4, trangThai: ETrangThaiBan.DANG_DUNG },
      { id: 'b_a03', so: 'A03', loai: ELoaiBan.SAU, sucChua: 6, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_a04', so: 'A04', loai: ELoaiBan.DOI, sucChua: 2, trangThai: ETrangThaiBan.BAO_TRI, ghiChu: 'Chân bàn bị hỏng' },
      { id: 'b_a05', so: 'A05', loai: ELoaiBan.BON, sucChua: 4, trangThai: ETrangThaiBan.DANG_DUNG },
      { id: 'b_a06', so: 'A06', loai: ELoaiBan.BON, sucChua: 4, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_a07', so: 'A07', loai: ELoaiBan.SAU, sucChua: 6, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_a08', so: 'A08', loai: ELoaiBan.TAM, sucChua: 8, trangThai: ETrangThaiBan.SAN_SANG },
    ],
  },
  {
    id: 'kv_b',
    ten: 'Khu B – Ngoài trời',
    moTa: 'Khu ăn uống ngoài trời có mái che, thoáng mát',
    mau: '#16a34a',
    danhSachBan: [
      { id: 'b_b01', so: 'B01', loai: ELoaiBan.TAM, sucChua: 8, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_b02', so: 'B02', loai: ELoaiBan.TAM, sucChua: 8, trangThai: ETrangThaiBan.DANG_DUNG },
      { id: 'b_b03', so: 'B03', loai: ELoaiBan.SAU, sucChua: 6, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_b04', so: 'B04', loai: ELoaiBan.SAU, sucChua: 6, trangThai: ETrangThaiBan.BAO_TRI, ghiChu: 'Đang sơn lại' },
      { id: 'b_b05', so: 'B05', loai: ELoaiBan.BON, sucChua: 4, trangThai: ETrangThaiBan.SAN_SANG },
    ],
  },
  {
    id: 'kv_c',
    ten: 'Khu C – VIP',
    moTa: 'Khu dành cho nhóm và họp nội bộ, phòng riêng',
    mau: '#7c3aed',
    danhSachBan: [
      { id: 'b_c01', so: 'C01', loai: ELoaiBan.TAM, sucChua: 8, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_c02', so: 'C02', loai: ELoaiBan.TAM, sucChua: 8, trangThai: ETrangThaiBan.SAN_SANG },
      { id: 'b_c03', so: 'C03', loai: ELoaiBan.SAU, sucChua: 6, trangThai: ETrangThaiBan.DANG_DUNG },
    ],
  },
];
