import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { Order } from '@/services/KhachHang/Đơn Hàng';
import { OrderStatus } from '@/services/KhachHang/Đơn Hàng';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import { hasLoginToken } from '@/utils/auth';
import { notifyCustomerOrderReady } from '@/utils/customerNotifications';

export default function useOrderModel() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!hasLoginToken()) {
            setOrders([]);
            if (!silent) setLoading(false);
            return;
        }
        try {
            if (!silent) setLoading(true);
            const res = await axios.get(`${ip3}/orders/history`);
            if (res.data && Array.isArray(res.data)) {
                const uiOrders = res.data.map(SyncAdapters.mapOrderResponseToUI);
                const reviewedOrderIds = JSON.parse(localStorage.getItem('reviewed_orders') || '[]');
                const updatedOrders = uiOrders.map(o => ({
                    ...o,
                    isReviewed: reviewedOrderIds.includes(o.id)
                }));
                updatedOrders.forEach((order) => {
                    if (order.status === OrderStatus.Ready) {
                        notifyCustomerOrderReady(order.id);
                    }
                });
                setOrders(updatedOrders);
            }
        } catch (error: any) {
            console.error("Lỗi khi tải lịch sử đơn hàng:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasLoginToken()) return undefined;
        fetchOrders();
        const intervalRef: { current?: ReturnType<typeof setInterval> } = {};

        const doPoll = async () => {
            try {
                await fetchOrders(true);
            } catch (err: any) {
                if (err?.response?.status === 401) {
                    if (intervalRef.current) clearInterval(intervalRef.current); // Dừng polling nếu token hết hạn
                }
            }
        };

        // Polling để cập nhật trạng thái đơn hàng thời gian thực
        intervalRef.current = setInterval(doPoll, 5000); // 5 giây cập nhật 1 lần
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchOrders]);

    const addOrder = useCallback(async (newOrder: Order) => {
        // Cập nhật state ngay lập tức để UI phản hồi nhanh
        setOrders(prev => [newOrder, ...prev]);
        // Đồng thời gọi API lấy danh sách mới nhất ngầm bên dưới
        fetchOrders();
    }, [fetchOrders]);

    const advanceOrder = useCallback(async (orderId: string) => {
        // Trong hệ thống thật, việc chuyển trạng thái "Đã nhận món" (advanceOrder)
        // chưa có API cụ thể bên Backend cho Khách Hàng tự cập nhật,
        // Hoặc chúng ta có thể gọi cập nhật trạng thái nếu Backend hỗ trợ.
        // Tuy nhiên Backend không có API cho Khách hàng chuyển trạng thái thành DONE.
        // Tạm thời chỉ thông báo lỗi hoặc bỏ qua.
        message.info("Vui lòng đợi nhân viên cập nhật trạng thái đơn hàng.");
        await fetchOrders();
    }, [fetchOrders]);

    const markAsReviewed = useCallback(async (orderId: string) => {
        try {
            const reviewedOrderIds = JSON.parse(localStorage.getItem('reviewed_orders') || '[]');
            if (!reviewedOrderIds.includes(orderId)) {
                reviewedOrderIds.push(orderId);
                localStorage.setItem('reviewed_orders', JSON.stringify(reviewedOrderIds));
            }
        } catch (e) {
            console.error("Lỗi lưu trạng thái đánh giá vào localStorage:", e);
        }
        await fetchOrders();
    }, [fetchOrders]);

    const cancelOrder = useCallback(async (orderId: string) => {
        try {
            await axios.post(`${ip3}/orders/${orderId}/cancel`);
            message.success("Đã hủy đơn hàng thành công");
            await fetchOrders();
        } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
            message.error("Không thể hủy đơn hàng lúc này");
        }
    }, [fetchOrders]);

    return {
        orders,
        addOrder,
        advanceOrder,
        markAsReviewed,
        cancelOrder,
        fetchOrders,
        loading
    };
}
