export enum ETrangThaiNguyenLieu {
  DU_HANG  = 'du_hang',
  SAP_HET  = 'sap_het',
  HET_HANG = 'het_hang',
}

export interface INguyenLieu {
  id: string;
  ten: string;
  donVi: string;
  nhaCungCap: string;
  tonKho: number;
  mucToiThieu: number;
  giaNhap: number;
  trangThai: ETrangThaiNguyenLieu;
}

export interface IStatKho {
  tongNguyenLieu: number;
  sapHetHet: number;
  giaTri: string;
  nhaCungCap: number;
}
