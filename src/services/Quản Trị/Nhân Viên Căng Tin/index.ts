import { EVaiTroNhanVien, INhanVien } from './typing';

export const DANH_SACH_NHAN_VIEN: INhanVien[] = [
  {
    id: 'nv1',
    hoTen: 'Nguyễn Minh Tâm',
    email: 'tam.nm@canteen.vn',
    vietTat: 'MT',
    mauNen: '#f9a8d4',
    vaiTro: EVaiTroNhanVien.QUAN_TRI_VIEN,
    hoatDongGanNhat: 'Vừa xong',
  },
  {
    id: 'nv2',
    hoTen: 'Lý Thu Trang',
    email: 'trang.lt@canteen.vn',
    vietTat: 'TT',
    mauNen: '#93c5fd',
    vaiTro: EVaiTroNhanVien.BEP_TRUONG,
    hoatDongGanNhat: '5 phút trước',
  },
  {
    id: 'nv3',
    hoTen: 'Đặng Văn Khoa',
    email: 'khoa.dv@canteen.vn',
    vietTat: 'VK',
    mauNen: '#60a5fa',
    vaiTro: EVaiTroNhanVien.THU_NGAN,
    hoatDongGanNhat: '2 giờ trước',
  },
  {
    id: 'nv4',
    hoTen: 'Nguyễn Bảo Vy',
    email: 'vy.nb@canteen.vn',
    vietTat: 'BV',
    mauNen: '#86efac',
    vaiTro: EVaiTroNhanVien.NHAN_VIEN_BEP,
    hoatDongGanNhat: '3 giờ trước',
  },
  {
    id: 'nv5',
    hoTen: 'Trần Thành Long',
    email: 'long.tt@canteen.vn',
    vietTat: 'TL',
    mauNen: '#c4b5fd',
    vaiTro: EVaiTroNhanVien.NHAN_VIEN_PHUC_VU,
    hoatDongGanNhat: '1 ngày trước',
  },
];

export const VAI_TRO_NV_CONFIG: Record<
  EVaiTroNhanVien,
  { label: string; color: string; bg: string }
> = {
  [EVaiTroNhanVien.QUAN_TRI_VIEN]:     { label: 'Quản trị viên',    color: '#166534', bg: '#dcfce7' },
  [EVaiTroNhanVien.BEP_TRUONG]:        { label: 'Bếp trưởng',       color: '#166534', bg: '#dcfce7' },
  [EVaiTroNhanVien.THU_NGAN]:          { label: 'Thu ngân',          color: '#166534', bg: '#dcfce7' },
  [EVaiTroNhanVien.NHAN_VIEN_BEP]:     { label: 'Nhân viên bếp',    color: '#1e40af', bg: '#dbeafe' },
  [EVaiTroNhanVien.NHAN_VIEN_PHUC_VU]: { label: 'Nhân viên phục vụ', color: '#92400e', bg: '#fef3c7' },
};
