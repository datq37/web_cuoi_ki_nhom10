import React from 'react';
import { CheckOutlined, BellOutlined, LoadingOutlined } from '@ant-design/icons';
import { OrderStatus } from '@/services/Khách hàng/Đơn Hàng';

interface Props {
    status: OrderStatus;
}

const OrderTracker: React.FC<Props> = ({ status }) => {
    const steps = [
        { key: OrderStatus.Pending, label: 'Đã đặt', icon: <CheckOutlined /> },
        { key: OrderStatus.Preparing, label: 'Đang nấu', icon: <LoadingOutlined /> },
        { key: OrderStatus.Ready, label: 'Sẵn sàng', icon: <BellOutlined /> },
        { key: OrderStatus.Done, label: 'Hoàn thành', icon: <CheckOutlined /> },
    ];

    const order: OrderStatus[] = [OrderStatus.Pending, OrderStatus.Preparing, OrderStatus.Ready, OrderStatus.Done];
    const idx = order.indexOf(status === OrderStatus.Cancelled ? OrderStatus.Pending : status);

    return (
        <div className="tracker">
            {steps.map((s, i) => {
                const isDone = i < idx || status === OrderStatus.Done;
                const isActive = i === idx && status !== OrderStatus.Done && status !== OrderStatus.Cancelled;
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
