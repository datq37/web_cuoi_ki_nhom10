import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { message } from 'antd';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { Order, OrderStatus, PaymentMethod } from '@/services/Khách hàng/Đơn Hàng';

// ─── Custom Hook quản lý toàn bộ State & Logic nghiệp vụ của Giỏ Hàng ───────────
export function useGioHangModel() {
    // ── State toàn cục từ model ───────────────────────────────────────────────
    const { cart, cartOpen, setCartOpen, clearCart } = useModel('Khách Hàng.Thực đơn.index');
    const { addOrder } = useModel('Khách Hàng.Orders');
    const { setPage } = useModel('Khách Hàng.global');
    const { addNotification } = useModel('Khách Hàng.Notifications');
    const { setPendingOrder } = useModel('Khách Hàng.Thanh toán QR.index');

    // ── State cục bộ của giỏ hàng ─────────────────────────────────────────────
    const [note, setNote] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>(undefined);
    const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.Cash);
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

    // ── Claim voucher (đồng bộ) để tránh race condition ──────────────────────
    // Trả về true nếu claim thành công, false nếu hết lượt
    const claimVoucher = (voucherId: string): boolean => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('admin_vouchers');
        if (!saved) return true;
        try {
            const list = JSON.parse(saved);
            const idx = list.findIndex((k: any) => k.id === voucherId);
            if (idx === -1) return true; // voucher không còn trong hệ thống
            const k = list[idx];
            // Kiểm tra lại lần cuối: đã hết lượt?
            if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
            // Đã tắt hoặc hết hạn?
            if (!k.hoatDong || k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
            // Claim: tăng daDung ngay lập tức (đồng bộ, trước khi async xử lý)
            const daDung = (k.daDung || 0) + 1;
            const hetLuot = daDung >= k.gioiHan;
            list[idx] = {
                ...k,
                daDung,
                trangThai: hetLuot ? 'het_han' : k.trangThai,
                hoatDong: hetLuot ? false : k.hoatDong,
            };
            localStorage.setItem('admin_vouchers', JSON.stringify(list));
            return true;
        } catch {
            return true; // lỗi parse thì cho qua
        }
    };

    // ── Xác nhận đặt món ──────────────────────────────────────────────────────
    const handleConfirm = () => {
        // 1. Claim voucher TRƯỚC (đồng bộ) — nếu 2 người cùng bấm, chỉ người đầu thành công
        if (selectedVoucher) {
            const claimed = claimVoucher(selectedVoucher.id);
            if (!claimed) {
                // Voucher hết lượt do người khác vừa dùng → báo lỗi, gỡ voucher
                setSelectedVoucher(undefined);
                message.error('Voucher này vừa hết lượt sử dụng! Vui lòng chọn voucher khác.');
                return;
            }
        }

        setIsLoading(true);
        
        setTimeout(() => {
            const SERVICE_FEE_RATE = 0.05;
            const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
            const discount = (() => {
                if (!selectedVoucher) return 0;
                if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
                if (selectedVoucher.loai === 'phan_tram') {
                    return Math.round(subtotal * selectedVoucher.discount / 100);
                }
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
                status: OrderStatus.Pending,
                payment: payment,
                created: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                pickup: '15 phút nữa',
                note: note
            };

            addOrder(newOrder);
            // Lưu ý: daDung đã được tăng đồng bộ ở claimVoucher() ở trên rồi,
            // KHÔNG cần tăng lại ở đây nữa.

            const isQRPayment = payment === PaymentMethod.QR;

            if (isQRPayment) {
                setPendingOrder(newOrder);
            }

            // Thêm thông báo
            addNotification({
                id: `n-${Date.now()}`,
                title: isQRPayment ? 'Đơn hàng đang chờ thanh toán QR' : 'Đơn hàng đã được đặt thành công',
                message: isQRPayment
                    ? `Đơn hàng ${newOrder.id} đã được tạo. Vui lòng quét mã QR để hoàn tất thanh toán.`
                    : `Đơn hàng ${newOrder.id} của bạn đã được xác nhận và bếp đang bắt đầu chuẩn bị.`,
                time: new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                isRead: false,
                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
            });

            clearCart();
            setNote('');
            setSelectedVoucher(undefined);
            
            setIsLoading(false);
            setCartOpen(false);
            setPage(isQRPayment ? 'qr-payment' : 'history');
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
