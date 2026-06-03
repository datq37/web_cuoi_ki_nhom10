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

