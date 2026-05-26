export enum ETrangThaiBan {
  SAN_SANG  = 'san_sang',
  DANG_DUNG = 'dang_dung',
  BAO_TRI   = 'bao_tri',
}

export enum ELoaiBan {
  DOI = 'doi',
  BON = 'bon',
  SAU = 'sau',
  TAM = 'tam',
}

export interface IBan {
  id: string;
  so: string;
  loai: ELoaiBan;
  sucChua: number;
  trangThai: ETrangThaiBan;
  ghiChu?: string;
}

export interface IKhuVuc {
  id: string;
  ten: string;
  moTa: string;
  mau: string;
  danhSachBan: IBan[];
}
