import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { Order, OrderStatus, SEED_ORDERS } from '@/services/Khách hàng/Đơn Hàng';
import { formatDateTimeViVN } from '@/utils/format';

export default function useOrderModel() {
    const [orders, setOrders] = useState<Order[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('customer_orders');
            if (saved) {
                try { return JSON.parse(saved); } catch { }
            }
        }
        return SEED_ORDERS;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer_orders', JSON.stringify(orders));
        }
    }, [orders]);

    // đồng bộ trạng thái
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
                    const changedOrders: { id: string, status: string, total: number }[] = [];
                    const next = prev.map(o => {
                        const adminMatch = adminOrders.find((ao: any) => ao.maDon === o.id);
                        if (adminMatch) {
                            const newStatus = STATUS_MAP[adminMatch.trangThai] || o.status;
                            if (newStatus !== o.status) {
                                changed = true;
                                changedOrders.push({ id: o.id, status: newStatus, total: o.total });
                                return { ...o, status: newStatus };
                            }
                        }
                        return o;
                    });
                    if (changed) {
                        setTimeout(() => {
                            changedOrders.forEach(co => {
                                message.info(`Đơn hàng ${co.id} của bạn đã được cập nhật thành: ${co.status}`);

                                // gửi thông báo
                                window.dispatchEvent(new CustomEvent('new_notification', {
                                    detail: {
                                        id: `notif_${Date.now()}_${co.id}`,
                                        title: 'Trạng thái đơn hàng cập nhật',
                                        message: `Đơn hàng ${co.id} của bạn đã chuyển sang trạng thái: ${co.status}`,
                                        time: formatDateTimeViVN(),
                                        isRead: false,
                                        image: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png'
                                    }
                                }));

                                if (co.status === OrderStatus.Done) {
                                    window.dispatchEvent(new CustomEvent('order_completed', { detail: { amount: co.total } }));
                                }
                            });
                        }, 0);
                        return next;
                    }
                    return prev;
                });
            } catch (e) {
                // bỏ qua
            }
        };

        window.addEventListener('storage', handleAdminSync);
        window.addEventListener('admin_orders_updated', handleAdminSync);
        window.addEventListener('focus', handleAdminSync);

        // đồng bộ ban đầu
        handleAdminSync();

        return () => {
            window.removeEventListener('storage', handleAdminSync);
            window.removeEventListener('admin_orders_updated', handleAdminSync);
            window.removeEventListener('focus', handleAdminSync);
        };
    }, []);

    const addOrder = useCallback((newOrder: Order) => {
        setOrders(prev => [newOrder, ...prev]);

        // đồng bộ admin
        if (typeof window !== 'undefined') {
            try {
                const adminSaved = localStorage.getItem('admin_orders');
                let adminOrders: any[] = [];
                if (adminSaved) {
                    adminOrders = JSON.parse(adminSaved);
                }

                // map đơn hàng
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

                // gửi thông báo
                window.dispatchEvent(new CustomEvent('new_notification', {
                    detail: {
                        id: `notif_${Date.now()}`,
                        title: 'Đơn hàng đã được đặt thành công',
                        message: `Đơn hàng ${newOrder.id} của bạn đã được xác nhận. Bếp đang chuẩn bị!`,
                        time: formatDateTimeViVN(),
                        isRead: false,
                        image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
                    }
                }));

            } catch (e) {
                console.error("Lỗi đồng bộ đơn hàng với Admin:", e);
            }
        }
    }, []);

    const advanceOrder = useCallback((orderId: string) => {
        setOrders(prev => {
            let nextStatusToAdmin: string | null = null;
            const next = prev.map(o => {
                if (o.id !== orderId) return o;

                const nextStatus: Record<string, OrderStatus> = {
                    [OrderStatus.Pending]: OrderStatus.Preparing,
                    [OrderStatus.Preparing]: OrderStatus.Ready,
                    [OrderStatus.Ready]: OrderStatus.Done,
                    [OrderStatus.Done]: OrderStatus.Done
                };

                const finalStatus = nextStatus[o.status] || o.status;
                if (finalStatus === OrderStatus.Done && o.status !== OrderStatus.Done) {
                    nextStatusToAdmin = 'hoan_thanh';
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('order_completed', { detail: { amount: o.total } }));

                        window.dispatchEvent(new CustomEvent('new_notification', {
                            detail: {
                                id: `notif_received_${Date.now()}`,
                                title: 'Đã nhận món thành công',
                                message: `Bạn đã xác nhận nhận món cho đơn hàng ${o.id}. Chúc bạn ngon miệng! Đừng quên đánh giá nhé.`,
                                time: formatDateTimeViVN(),
                                isRead: false,
                                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
                            }
                        }));
                    }, 0);
                }

                return { ...o, status: finalStatus };
            });

            if (nextStatusToAdmin && typeof window !== 'undefined') {
                try {
                    const savedAdmin = localStorage.getItem('admin_orders');
                    if (savedAdmin) {
                        const adminList = JSON.parse(savedAdmin);
                        let adminChanged = false;
                        const newAdminList = adminList.map((ao: any) => {
                            if (ao.maDon === orderId) {
                                adminChanged = true;
                                return { ...ao, trangThai: nextStatusToAdmin };
                            }
                            return ao;
                        });
                        if (adminChanged) {
                            localStorage.setItem('admin_orders', JSON.stringify(newAdminList));
                            window.dispatchEvent(new Event('admin_orders_updated'));
                        }
                    }
                } catch (e) {
                    console.error("Lỗi đồng bộ advanceOrder:", e);
                }
            }

            return next;
        });
    }, []);

    const markAsReviewed = useCallback((orderId: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isReviewed: true } : o));
    }, []);

    const cancelOrder = useCallback((orderId: string) => {
        setOrders(prev => prev.map(o => (
            o.id === orderId ? { ...o, status: OrderStatus.Cancelled } : o
        )));

        if (typeof window !== 'undefined') {
            try {
                const savedAdmin = localStorage.getItem('admin_orders');
                if (savedAdmin) {
                    const adminList = JSON.parse(savedAdmin);
                    const newAdminList = adminList.map((ao: any) => (
                        ao.maDon === orderId ? { ...ao, trangThai: 'da_huy' } : ao
                    ));
                    localStorage.setItem('admin_orders', JSON.stringify(newAdminList));
                    window.dispatchEvent(new Event('admin_orders_updated'));
                }

                window.dispatchEvent(new CustomEvent('new_notification', {
                    detail: {
                        id: `notif_cancel_${Date.now()}_${orderId}`,
                        title: 'Đơn hàng đã huỷ',
                        message: `Đơn hàng ${orderId} đã được huỷ thanh toán.`,
                        time: formatDateTimeViVN(),
                        isRead: false,
                        image: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png'
                    }
                }));
            } catch (e) {
                console.error("Lỗi đồng bộ cancelOrder:", e);
            }
        }
    }, []);

    return {
        orders,
        addOrder,
        advanceOrder,
        markAsReviewed,
        cancelOrder
    };
}
