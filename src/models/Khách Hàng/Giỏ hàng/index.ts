import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import type { Order } from '@/services/Khách hàng/Orders/typing';

// ─── Custom Hook quản lý toàn bộ State & Logic nghiệp vụ của Giỏ Hàng ───────────
export function useGioHangModel() {
    // ── State toàn cục từ model ───────────────────────────────────────────────
    const { cart, cartOpen, setCartOpen, clearCart } = useModel('Khách Hàng.Thực đơn.index');
    const { addOrder } = useModel('Khách Hàng.Orders');
    const { setPage } = useModel('Khách Hàng.global');
    const { addNotification } = useModel('Khách Hàng.Notifications');

    // ── State cục bộ của giỏ hàng ─────────────────────────────────────────────
    const [note, setNote] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>(undefined);
    const [payment, setPayment] = useState('cash');
    const [isLoading, setIsLoading] = useState(false);

    const cartQty = cart.reduce((s: number, i: any) => s + i.qty, 0);
    const subtotal = cart.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    // Tự động gỡ voucher nếu giỏ hàng trống hoặc không đủ điều kiện
    useEffect(() => {
        if (cart.length === 0 && selectedVoucher) {
            setSelectedVoucher(undefined);
        } else if (selectedVoucher && selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) {
            setSelectedVoucher(undefined);
        }
    }, [cart.length, subtotal, selectedVoucher]);

    // ── Xác nhận đặt món ──────────────────────────────────────────────────────
    const handleConfirm = () => {
        setIsLoading(true);
        
        setTimeout(() => {
            const SERVICE_FEE_RATE = 0.05;
            const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
            const discount = (() => {
                if (!selectedVoucher) return 0;
                if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
                return selectedVoucher.discount;
            })();
            const total = Math.max(0, subtotal + serviceFee - discount);

            const newOrder: Order = {
                id: `BU-${Math.floor(Math.random() * 9000) + 1000}`,
                user: 'u1',
                userName: 'Khách Hàng',
                dept: 'Guest',
                items: cart.map((it: any) => ({
                    id: it.id,
                    name: it.name,
                    qty: it.qty,
                    price: it.price
                })),
                total: total,
                status: 'pending',
                payment: payment as any,
                created: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                pickup: '15 phút nữa',
                note: note
            };

            addOrder(newOrder);

            // Thêm thông báo
            addNotification({
                id: `n-${Date.now()}`,
                title: 'Đơn hàng đã được đặt thành công',
                message: `Đơn hàng ${newOrder.id} của bạn đã được xác nhận và bếp đang bắt đầu chuẩn bị.`,
                time: new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                isRead: false,
                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
            });

            clearCart();
            setNote('');
            setSelectedVoucher(undefined);
            
            setIsLoading(false);
            setCartOpen(false);
            setPage('history');
        }, 1000);
    };

    return {
        cart,
        cartOpen,
        setCartOpen,
        clearCart,
        note,
        setNote,
        selectedVoucher,
        setSelectedVoucher,
        payment,
        setPayment,
        isLoading,
        setIsLoading,
        cartQty,
        subtotal,
        handleConfirm,
        setPage,
    };
}

export default useGioHangModel;
