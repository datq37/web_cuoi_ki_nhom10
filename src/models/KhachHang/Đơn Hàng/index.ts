import { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { OrderStatus } from '@/services/KhachHang/Đơn Hàng';

export default function useDonHangModel() {
    const { orders, advanceOrder } = useModel('KhachHang.Đơn Hàng.Orders');
    const { setSearchQuery, setActiveCategory } = useModel('KhachHang.ThucDon.index');
    const { setPage, theme } = useModel('KhachHang.GlobalState.index');
    
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
