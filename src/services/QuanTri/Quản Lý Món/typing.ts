export enum EDanhMuc {
  TAT_CA    = 'tat_ca',
  MON_CHINH = 'mon_chinh',
  DO_UONG   = 'do_uong',
  AN_VAT    = 'an_vat',
  MON_CHAY  = 'mon_chay',
}

export interface IMonAn {
  id: string;
  ten: string;
  moTa: string;
  danhMuc: EDanhMuc | number | string;
  giaBan: number;
  thoiGian: number;
  calo: number;
  danhGia: number;
  isHot: boolean;
  mauNen: string;
}
