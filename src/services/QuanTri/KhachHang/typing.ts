export enum EVaiTro {
  NHAN_VIEN    = 'nhan_vien',
  TRUONG_PHONG = 'truong_phong',
  GIAM_DOC     = 'giam_doc',
}

export enum ETrangThaiKhach {
  HOAT_DONG = 'hoat_dong',
  TAM_KHOA  = 'tam_khoa',
}

export interface IKhachHang {
  id: string;
  hoTen: string;
  email: string;
  avatar?: string;
  vietTat: string;
  mauNen: string;
  phongBan: string;
  vaiTro: EVaiTro;
  soDon: number;
  chiTieu: number;
  thamGia: string;
  trangThai: ETrangThaiKhach;
}

export interface IStatKhach {
  tongKhach: number;
  hoatDong: number;
  chiTieuTB: string;
  topTuan: { ten: string; soDon: number };
}
