// --- Enum Types ---
export enum PaymentMethod {
  CASH = 'cash',
  BANKING = 'banking',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum OrderStatus {
  CART = 'cart',
  PENDING_CONFIRMATION = 'pending_confirmation',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// --- User / Auth Types ---
export interface KhachHangResponse {
  makh: string;
  taikhoan?: string;
  ten?: string;
  tuoi?: number;
  lichsudathang?: string;
  vaitro?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  dept?: string;
  building?: string;
  floor?: string;
  desk?: string;
  points?: number;
  totalSpent?: number;
  total_spent?: number;
  soDon?: number;
  so_don?: number;
}

export interface KhachHangListResponse {
  items: KhachHangResponse[];
  total: number;
  page: number;
  pageSize?: number;
  page_size?: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// --- Menu / Product Types ---
export interface ThucDonResponse {
  mamon: string;
  ten?: string;
  gia?: number;
  soluong?: number;
  hinhanh?: string;
  mieuta?: string;
  soluongdaban?: number;
  hethang?: boolean;
  tags?: string[];
  danhmucid?: number;
  nguyenLieu?: unknown[];
}

export interface ThucDonListResponse {
  items: ThucDonResponse[];
  total: number;
}

// --- Order Types ---
export interface OrderDetailResponse {
  id: number;
  orderId: string;
  mamon: string;
  soluong: number;
  gia?: number;
  thucdon?: ThucDonResponse;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  method?: PaymentMethod;
  status: PaymentStatus;
  createdAt?: string;
  tongtien?: number;
}

export interface OrderResponse {
  maDon: string;
  maKh: string;
  tongTien: number;
  trangThai: OrderStatus;
  hinhthucthanhtoan?: PaymentMethod;
  thoiGianDat?: string;
  chitiet?: OrderDetailResponse[];
  payments?: PaymentResponse[];
  khachhang?: KhachHangResponse;
  ghiChu?: string;
}
