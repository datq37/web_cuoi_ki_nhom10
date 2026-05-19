import React from 'react';
import { MoneyCollectOutlined, QrcodeOutlined } from '@ant-design/icons';

// ─── Danh sách phương thức thanh toán ────────────────────────────────────────
export const PAYMENT_METHODS = [
    { key: 'cash', label: 'Tiền mặt', icon: <MoneyCollectOutlined /> },
    { key: 'qr',   label: 'QR / Bank', icon: <QrcodeOutlined /> },
];
