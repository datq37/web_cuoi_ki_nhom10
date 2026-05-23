import { useState, useCallback } from 'react';
import { Order, OrderStatus, SEED_ORDERS } from '@/services/Khách hàng/Đơn Hàng';

export default function useOrderModel() {
    const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);

    const addOrder = useCallback((newOrder: Order) => {
        setOrders(prev => [newOrder, ...prev]);
    }, []);

    const advanceOrder = useCallback((orderId: string) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== orderId) return o;

            const nextStatus: Record<string, OrderStatus> = {
                [OrderStatus.Pending]: OrderStatus.Preparing,
                [OrderStatus.Preparing]: OrderStatus.Ready,
                [OrderStatus.Ready]: OrderStatus.Done,
                [OrderStatus.Done]: OrderStatus.Done
            };

            return { ...o, status: nextStatus[o.status] || o.status };
        }));
    }, []);

    return {
        orders,
        addOrder,
        advanceOrder
    };
}
