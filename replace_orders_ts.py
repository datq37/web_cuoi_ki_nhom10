import re

with open('src/models/KhachHang/Đơn Hàng/Orders.ts', 'r') as f:
    content = f.read()

# I need to completely rewrite the Orders.ts to use API instead of localStorage and SEED_ORDERS.
# But looking at Orders.ts, it also handles adding orders, advancing orders via localStorage which was syncing with Admin.
# All this localStorage logic should be removed.

new_content = """import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { Order, OrderStatus } from '@/services/KhachHang/Đơn Hàng';
import axios from '@/utils/axios';
import { ip3 } from '@/services/api/base';
import { SyncAdapters } from '@/services/api/adapters';

export default function useOrderModel() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${ip3}/orders/history`);
            if (res.data && Array.isArray(res.data)) {
                const uiOrders = res.data.map(SyncAdapters.mapOrderResponseToUI);
                setOrders(uiOrders);
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch sử đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const addOrder = useCallback(async (newOrder: Order) => {
        // Mặc dù trong model đang dùng addOrder để mutate state,
        // Nhưng logic tạo đơn thực sự đã nằm trong `models/KhachHang/Giỏ hàng/index.ts`.
        // Ở đây ta chỉ cần gọi lại fetchOrders.
        await fetchOrders();
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
        // Đã đánh giá -> API thực tế gọi review xong thì tải lại
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
        loading
    };
}
"""

with open('src/models/KhachHang/Đơn Hàng/Orders.ts', 'w') as f:
    f.write(new_content)
