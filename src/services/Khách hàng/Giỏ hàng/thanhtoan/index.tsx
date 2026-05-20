import { Wallet, QrCode } from 'lucide-react';

// ─── Danh sách phương thức thanh toán ────────────────────────────────────────
export const PAYMENT_METHODS = [
    { key: 'cash', label: 'Tiền mặt', icon: <Wallet size={38} /> },
    { key: 'qr', label: 'QR / Bank', icon: <QrCode size={38} /> },
];
