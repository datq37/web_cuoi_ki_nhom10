export enum EVaiTroNhanVien {
  QUAN_TRI_VIEN     = 'quan_tri_vien',
  BEP_TRUONG        = 'bep_truong',
  THU_NGAN          = 'thu_ngan',
  NHAN_VIEN_BEP     = 'nhan_vien_bep',
  NHAN_VIEN_PHUC_VU = 'nhan_vien_phuc_vu',
}

export interface INhanVien {
  id: string;
  hoTen: string;
  email: string;
  vietTat: string;
  mauNen: string;
  vaiTro: EVaiTroNhanVien;
  hoatDongGanNhat: string;
}
