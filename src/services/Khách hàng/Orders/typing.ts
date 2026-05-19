import React from 'react';
import { 
    ClockCircleOutlined, 
    SyncOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    WalletOutlined,
    QrcodeOutlined,
    MoneyCollectOutlined,
    CreditCardOutlined
} from '@ant-design/icons';

export interface OrderItem {
    id: string;
    name: string;
    qty: number;
    price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'done' | 'cancelled';

export interface Order {
    id: string;
    user: string;
    userName: string;
    dept: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    payment: 'wallet' | 'qr' | 'cash' | 'salary';
    created: string;
    pickup: string;
    note?: string;
}

export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending:   { label: 'Chờ xác nhận', color: 'warn',  icon: React.createElement(ClockCircleOutlined) },
    preparing: { label: 'Đang nấu',     color: 'info',  icon: React.createElement(SyncOutlined, { spin: true }) },
    ready:     { label: 'Sẵn sàng',     color: 'green', icon: React.createElement(CheckCircleOutlined) },
    done:      { label: 'Hoàn thành',   color: 'green', icon: React.createElement(CheckCircleOutlined) },
    cancelled: { label: 'Đã huỷ',       color: 'err',   icon: React.createElement(CloseCircleOutlined) },
};

export const PAYMENT_METHODS = {
    wallet: { label: 'Ví nội bộ', icon: React.createElement(WalletOutlined) },
    qr:     { label: 'QR/Bank',   icon: React.createElement(QrcodeOutlined) },
    cash:   { label: 'Tiền mặt',  icon: React.createElement(MoneyCollectOutlined) },
    salary: { label: 'Trừ lương', icon: React.createElement(CreditCardOutlined) },
};
