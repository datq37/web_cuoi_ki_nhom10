import React from 'react';
import { CheckOutlined, BellOutlined, LoadingOutlined } from '@ant-design/icons';
import { OrderStatus } from '@/services/Khách hàng/Orders/typing';

interface Props {
    status: OrderStatus;
}

const OrderTracker: React.FC<Props> = ({ status }) => {
    const steps = [
        { key: 'pending', label: 'Đã đặt', icon: <CheckOutlined /> },
        { key: 'preparing', label: 'Đang nấu', icon: <LoadingOutlined /> },
        { key: 'ready', label: 'Sẵn sàng', icon: <BellOutlined /> },
        { key: 'done', label: 'Hoàn thành', icon: <CheckOutlined /> },
    ];

    const order: OrderStatus[] = ['pending', 'preparing', 'ready', 'done'];
    const idx = order.indexOf(status === 'cancelled' ? 'pending' : status);

    return (
        <div className="tracker">
            {steps.map((s, i) => {
                const isDone = i < idx || status === 'done';
                const isActive = i === idx && status !== 'done' && status !== 'cancelled';
                const cls = isDone ? 'done' : isActive ? 'active' : '';

                return (
                    <div key={s.key} className={`tracker-step ${cls}`}>
                        <div className="dot">
                            {isDone ? <CheckOutlined style={{ fontSize: 12 }} /> : s.icon}
                        </div>
                        <div className="label">{s.label}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTracker;
