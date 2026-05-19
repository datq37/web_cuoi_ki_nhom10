import React from 'react';
import { MoneyCollectOutlined, QrcodeOutlined } from '@ant-design/icons';


export const PAYMENT_METHODS = [
    { key: 'cash', label: 'Tiền mặt', icon: React.createElement(MoneyCollectOutlined) },
    { key: 'qr', label: 'QR / Bank', icon: React.createElement(QrcodeOutlined) },
];
