import { PaymentMethod } from '@/services/Khách hàng/Đơn Hàng';

export interface ThanhToanProps {
    payment: PaymentMethod;
    onSelect: (key: PaymentMethod) => void;
}
