import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { Order, OrderStatus, SEED_ORDERS } from '@/services/Khách hàng/Đơn Hàng';

export default function useOrderModel() {
    const [orders, setOrders] = useState<Order[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('customer_orders');
            if (saved) {
                try { return JSON.parse(saved); } catch {}
            }
        }
        return SEED_ORDERS;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer_orders', JSON.stringify(orders));
        }
    }, [orders]);

    // Lắng nghe thay đổi từ admin_orders để đồng bộ trạng thái về phía khách hàng
    useEffect(() => {
        const handleAdminSync = () => {
            const adminSaved = localStorage.getItem('admin_orders');
            if (!adminSaved) return;
            try {
                const adminOrders = JSON.parse(adminSaved);
                if (!Array.isArray(adminOrders)) return;
                
                const STATUS_MAP: Record<string, OrderStatus> = {
                    'cho_xac_nhan': OrderStatus.Pending,
                    'dang_che_bien': OrderStatus.Preparing,
                    'san_sang': OrderStatus.Ready,
                    'hoan_thanh': OrderStatus.Done,
                    'da_huy': OrderStatus.Cancelled
                };

                setOrders(prev => {
                    let changed = false;
                    const changedOrders: { id: string, status: string }[] = [];
                    const next = prev.map(o => {
                        const adminMatch = adminOrders.find((ao: any) => ao.maDon === o.id);
                        if (adminMatch) {
                            const newStatus = STATUS_MAP[adminMatch.trangThai] || o.status;
                            if (newStatus !== o.status) {
                                changed = true;
                                changedOrders.push({ id: o.id, status: newStatus });
                                return { ...o, status: newStatus };
                            }
                        }
                        return o;
                    });
                    if (changed) {
                        setTimeout(() => {
                            changedOrders.forEach(co => {
                                message.info(`Đơn hàng ${co.id} của bạn đã được cập nhật thành: ${co.status}`);
                            });
                        }, 0);
                        return next;
                    }
                    return prev;
                });
            } catch (e) {
                // ignore
            }
        };

        window.addEventListener('storage', handleAdminSync);
        window.addEventListener('admin_orders_updated', handleAdminSync);
        window.addEventListener('focus', handleAdminSync);

        // Initial sync on mount
        handleAdminSync();

        return () => {
            window.removeEventListener('storage', handleAdminSync);
            window.removeEventListener('admin_orders_updated', handleAdminSync);
            window.removeEventListener('focus', handleAdminSync);
        };
    }, []);

    const addOrder = useCallback((newOrder: Order) => {
        setOrders(prev => [newOrder, ...prev]);

        // -- Sync to admin --
        if (typeof window !== 'undefined') {
            try {
                const adminSaved = localStorage.getItem('admin_orders');
                let adminOrders: any[] = [];
                if (adminSaved) {
                    adminOrders = JSON.parse(adminSaved);
                }

                // Map Customer Order -> Admin DonTrucTiep
                const donTrucTiep = {
                    maDon: newOrder.id,
                    thoiGian: newOrder.created,
                    khachHang: {
                        ten: newOrder.userName || 'Khách Hàng',
                        vietTat: 'KH',
                        mauNen: '#E8F5E9',
                        mauChu: '#2E7D32'
                    },
                    monAn: newOrder.items.map(it => ({ ten: it.name, soLuong: it.qty })),
                    ghiChu: newOrder.note,
                    tongTien: newOrder.total,
                    trangThai: 'cho_xac_nhan', // ETrangThaiTrucTiep.CHO_XAC_NHAN
                };

                adminOrders = [donTrucTiep, ...adminOrders];
                localStorage.setItem('admin_orders', JSON.stringify(adminOrders));
                window.dispatchEvent(new Event('admin_orders_updated'));
            } catch (e) {
                console.error("Lỗi đồng bộ đơn hàng với Admin:", e);
            }
        }
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
