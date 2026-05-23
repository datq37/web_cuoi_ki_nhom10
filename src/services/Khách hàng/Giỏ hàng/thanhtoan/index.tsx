import { Wallet, QrCode } from 'lucide-react';
import { PaymentMethod } from '@/services/Khách hàng/Đơn Hàng';

// ─── Danh sách phương thức thanh toán ────────────────────────────────────────
export const PAYMENT_METHODS = [
    { key: PaymentMethod.Cash, label: 'Tiền mặt', icon: <Wallet size={38} /> },
    { key: PaymentMethod.QR, label: 'QR / Bank', icon: <QrCode size={38} /> },
];
