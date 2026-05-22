export enum ETrangThaiKhuyenMai {
  DANG_CHAY = 'dang_chay',
  SAP_HET   = 'sap_het',
  TAM_DUNG  = 'tam_dung',
  HET_HAN   = 'het_han',
}

export enum ELoaiGiamGia {
  PHAN_TRAM = 'phan_tram',
  SO_TIEN   = 'so_tien',
  MIEN_SHIP = 'mien_ship',
}

export interface IKhuyenMai {
  id: string;
  ma: string;
  ten: string;
  moTa: string;
  loai: ELoaiGiamGia;
  giaTriGiam: number;
  donToiThieu: number;
  daDung: number;
  gioiHan: number;
  hetHan: string;
  trangThai: ETrangThaiKhuyenMai;
  hoatDong: boolean;
}

export interface IStatKhuyenMai {
  dangHoatDong: number;
  luotSuDung: number;
  doanhThuTao: string;
  tyLeChuyenDoi: number;
}
