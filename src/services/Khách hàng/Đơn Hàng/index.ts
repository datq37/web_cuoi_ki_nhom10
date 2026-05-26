import React from 'react';
import { 
    ClockCircleOutlined, 
    SyncOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    QrcodeOutlined,
    MoneyCollectOutlined
} from '@ant-design/icons';
import { Order } from './typing';

export enum OrderStatus {
    Pending = 'pending',
    Preparing = 'preparing',
    Ready = 'ready',
    Done = 'done',
    Cancelled = 'cancelled'
}

export enum PaymentMethod {
    QR = 'qr',
    Cash = 'cash'
}

export * from './typing';

export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    [OrderStatus.Pending]:   { label: 'Chờ xác nhận', color: 'warn',  icon: React.createElement(ClockCircleOutlined) },
    [OrderStatus.Preparing]: { label: 'Đang nấu',     color: 'info',  icon: React.createElement(SyncOutlined, { spin: true }) },
    [OrderStatus.Ready]:     { label: 'Sẵn sàng',     color: 'green', icon: React.createElement(CheckCircleOutlined) },
    [OrderStatus.Done]:      { label: 'Hoàn thành',   color: 'green', icon: React.createElement(CheckCircleOutlined) },
    [OrderStatus.Cancelled]: { label: 'Đã huỷ',       color: 'err',   icon: React.createElement(CloseCircleOutlined) },
};

export const PAYMENT_METHODS = {
    [PaymentMethod.QR]:     { label: 'QR/Bank',   icon: React.createElement(QrcodeOutlined) },
    [PaymentMethod.Cash]:   { label: 'Tiền mặt',  icon: React.createElement(MoneyCollectOutlined) },
};

export const SEED_ORDERS: Order[] = [
    {
        id: 'BU-2842',
        user: 'u1',
        userName: 'Nguyễn Minh Anh',
        dept: 'Engineering',
        items: [
            { id: 'm2', name: 'Phở bò tái nạm', qty: 1, price: 50000 }
        ],
        total: 50000,
        status: OrderStatus.Pending,
        payment: PaymentMethod.Cash,
        created: '12:00',
        pickup: '12:15',
        note: 'Không hành'
    },
    {
        id: 'BU-9999',
        user: 'u1',
        userName: 'Nguyễn Minh Anh',
        dept: 'Engineering',
        items: [
            { id: 'm1', name: 'Cơm tấm sườn bì chả', qty: 1, price: 45000 },
            { id: 'm5', name: 'Trà đá', qty: 1, price: 5000 }
        ],
        total: 50000,
        status: OrderStatus.Done,
        payment: PaymentMethod.QR,
        created: '10:30',
        pickup: '11:00',
        note: 'Giao nhanh giúp em'
    }
];
