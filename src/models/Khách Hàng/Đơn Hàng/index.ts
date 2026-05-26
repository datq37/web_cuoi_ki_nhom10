import { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { OrderStatus } from '@/services/Khách hàng/Đơn Hàng';

export default function useDonHangModel() {
    const { orders, advanceOrder } = useModel('Khách Hàng.Orders');
    const { setSearchQuery, setActiveCategory } = useModel('Khách Hàng.Thực đơn.index');
    const { setPage, theme } = useModel('Khách Hàng.global');
    
    const [filter, setFilter] = useState('active');
    const [ratingOrder, setRatingOrder] = useState<any>(null);

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang xử lý' },
        { id: 'done', label: 'Hoàn thành' },
    ];

    const visibleOrders = useMemo(() => {
        return orders.filter(o => {
            if (filter === 'all') return true;
            if (filter === 'active') return o.status !== OrderStatus.Done && o.status !== OrderStatus.Cancelled;
            if (filter === 'done') return o.status === OrderStatus.Done;
            return true;
        });
    }, [orders, filter]);

    const handleReorder = (order: any) => {
        const firstName = order?.items?.[0]?.name || '';
        setActiveCategory('all');
        setSearchQuery(firstName);
        setPage('menu');
    };

    return {
        theme,
        filter,
        setFilter,
        ratingOrder,
        setRatingOrder,
        filters,
        visibleOrders,
        handleReorder,
        advanceOrder
    };
}
