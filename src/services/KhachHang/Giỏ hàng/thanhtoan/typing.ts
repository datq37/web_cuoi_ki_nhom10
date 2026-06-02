import { PaymentMethod } from '@/services/KhachHang/Đơn Hàng';

export interface ThanhToanProps {
    payment: PaymentMethod;
    onSelect: (key: PaymentMethod) => void;
}
