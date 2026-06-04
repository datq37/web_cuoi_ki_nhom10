import type { FormInstance } from 'antd';

export interface UserProfile {
  id?: string;
  avatar: string;
  name: string;
  phone?: string;
  email?: string;
  dept: string;
  building?: string;
  floor?: string;
  desk?: string;
  points?: number;
  totalSpent?: number;
}
// sidebar
export interface ThanhBenProps {
  nguoiDungHienTai: UserProfile;
  duongDanAnhDaiDien: string;
  laAnhDaiDien: () => boolean;
  truocKhiTaiLen: (file: File) => boolean | string;
  thongTinHang?: any;
}
// from thông tin
export interface BieuMauProps {
  bieuMau: FormInstance;
  khiHoanThanh: (
    values: Partial<UserProfile>,
    capNhatHoSo: (data: Partial<UserProfile>) => void | Promise<void>,
  ) => void | Promise<void>;
  capNhatHoSo: (data: Partial<UserProfile>) => void | Promise<void>;
}
