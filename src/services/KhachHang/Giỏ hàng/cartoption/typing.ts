export enum VoucherLoai {
  PhanTram = 'phan_tram',
  SoTien = 'so_tien',
  MienShip = 'mien_ship'
}

export enum VoucherTheme {
  Green = 'green',
  Orange = 'orange',
  Lime = 'lime'
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  giamGia?: number;
  loai?: VoucherLoai;
  desc: string;
  minOrder?: number;
  badge?: string;
  huyHieu?: string;
  expire?: string;
  valueLabel?: string;
  typeLabel?: string;
  theme?: VoucherTheme;
}

export interface CartOptionProps {
  note: string;
  onChangeNote: (note: string) => void;
  selectedVoucher?: Voucher;
  onSelectVoucher: (voucher: Voucher | undefined) => void;
  subtotal: number;
}

export interface TimeSlot {
  time: string;
  label: string;
}
