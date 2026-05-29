import React from 'react';
import { CheckOutlined, BellOutlined, LoadingOutlined } from '@ant-design/icons';
import { OrderStatus, OrderTrackerProps } from '@/services/Khách hàng/Đơn Hàng';

const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
    const steps = [
        { key: OrderStatus.Pending, label: 'Đã đặt', icon: <CheckOutlined /> },
        { key: OrderStatus.Preparing, label: 'Đang nấu', icon: <LoadingOutlined /> },
        { key: OrderStatus.Ready, label: 'Sẵn sàng', icon: <BellOutlined /> },
        { key: OrderStatus.Done, label: 'Hoàn thành', icon: <CheckOutlined /> },
    ];

    const order: OrderStatus[] = [OrderStatus.Pending, OrderStatus.Preparing, OrderStatus.Ready, OrderStatus.Done];
    const idx = order.indexOf(status === OrderStatus.Cancelled ? OrderStatus.Pending : status);

    return (
        <div className="thanhTheoDoi">
            {steps.map((s, i) => {
                const isDone = i < idx || status === OrderStatus.Done;
                const isActive = i === idx && status !== OrderStatus.Done && status !== OrderStatus.Cancelled;
                const cls = isDone ? 'hoanThanh' : isActive ? 'dangChon' : '';

                return (
                    <div key={s.key} className={`buocTheoDoi ${cls}`}>
                        <div className="cham">
                            {isDone ? <CheckOutlined style={{ fontSize: 12 }} /> : s.icon}
                        </div>
                        <div className="nhan">{s.label}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTracker;
