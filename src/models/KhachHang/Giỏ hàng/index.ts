import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import type { Voucher } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { VoucherLoai } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { Order, OrderStatus, PaymentMethod } from '@/services/KhachHang/Đơn Hàng';
import { formatDateTimeViVN, formatTimeHHMM } from '@/utils/format';
import { showCustomerNotification } from '@/utils/notification';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
export function useGioHangModel() {
    const { cart, cartOpen, setCartOpen, clearCart } = useModel('KhachHang.ThucDon.index');
    const { addOrder } = useModel('KhachHang.Đơn Hàng.Orders');
    const { setPage } = useModel('KhachHang.GlobalState.index');
    const { addNotification } = useModel('KhachHang.Thông Báo.index');
    const { setPendingOrder } = useModel('KhachHang.Thanh toán QR.index');
    const [note, setNote] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>(undefined);
    const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.Cash);
    const [isLoading, setIsLoading] = useState(false);

    const cartQty = cart.reduce((s: number, i: any) => s + i.qty, 0);
    const subtotal = cart.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    // huỷ mã giảm giá khi giỏ trống
    useEffect(() => {
        const hasComboSelected = cart.some((item: any) => item.comboId || item.isComboItem);
        if (cart.length === 0 && selectedVoucher) {
            setSelectedVoucher(undefined);
        } else if (hasComboSelected && selectedVoucher) {
            setSelectedVoucher(undefined);
        } else if (selectedVoucher && selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) {
            setSelectedVoucher(undefined);
        }
    }, [cart, subtotal, selectedVoucher]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (selectedVoucher) {
            localStorage.setItem('selected_customer_voucher', JSON.stringify(selectedVoucher));
        } else {
            localStorage.removeItem('selected_customer_voucher');
        }
    }, [selectedVoucher]);
    // kiểm tra khi app mã giảm 
    const claimVoucher = (voucherId: string): boolean => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('admin_vouchers');
        if (!saved) return true;
        try {
            const list = JSON.parse(saved);
            const idx = list.findIndex((k: any) => k.id === voucherId);
            if (idx === -1) return true;
            const k = list[idx];
            if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
            if (!k.hoatDong || k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
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
            return true;
        }
    };

    // Xác nhận đặt 
    const handleConfirm = async () => {
        const today = new Date();
        if (today.getDay() === 0) {
            showCustomerNotification('Căng tin nghỉ Chủ Nhật', 'Rất xin lỗi, căng tin không hoạt động vào ngày Chủ Nhật. Vui lòng đặt hàng vào các ngày trong tuần!', 'error');
            return;
        }

        if (selectedVoucher) {
            const claimed = claimVoucher(selectedVoucher.id);
            if (!claimed) {
                setSelectedVoucher(undefined);
                showCustomerNotification('Voucher này vừa hết lượt sử dụng! Vui lòng chọn voucher khác.', undefined, 'error');
                return;
            }
        }

        setIsLoading(true);

        try {
            // 1. Tạo đơn hàng (Giỏ hàng) ở Backend
            const payload = {
                hinhthucthanhtoan: payment === PaymentMethod.QR ? 'banking' : payment,
                chitiet: cart.map((it: any) => ({
                    mamon: it.id,
                    soluong: it.qty
                }))
            };

            const createRes = await axios.post(`${ip3}/orders`, payload);
            const createdOrder = createRes.data;
            const orderId = createdOrder.maDon || createdOrder.id; // tuỳ alias trong OrderResponse

            // 2. Chốt đơn hàng (Chuyển sang chờ xác nhận)
            await axios.post(`${ip3}/orders/${orderId}/confirm`);

            // Tính toán tổng tiền ở frontend (để show UI nhanh)
            const SERVICE_FEE_RATE = 0.05;
            const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
            const discount = (() => {
                if (!selectedVoucher) return 0;
                if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
                if (selectedVoucher.loai === VoucherLoai.PhanTram) {
                    return Math.round(subtotal * selectedVoucher.discount / 100);
                }
                return selectedVoucher.discount;
            })();
            const total = Math.max(0, subtotal + serviceFee - discount);

            const newOrder: Order = {
                id: orderId,
                user: createdOrder.maKh || 'u1',
                userName: 'KhachHang',
                dept: 'Guest',
                items: cart.map((it: any) => ({
                    id: it.id,
                    name: it.name,
                    qty: it.qty,
                    price: it.price,
                    image: it.hinhAnh
                })),
                total: total,
                status: OrderStatus.Pending,
                payment: payment,
                created: formatTimeHHMM(),
                pickup: '15 phút nữa',
                note: note
            };

            addOrder(newOrder);

            const isQRPayment = payment === PaymentMethod.QR;
            if (isQRPayment) {
                setPendingOrder(newOrder);
            }

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('order_completed'));
            }

            // thêm thông báo
            addNotification({
                id: `n-${Date.now()}`,
                title: isQRPayment ? 'Đơn hàng đang chờ thanh toán QR' : 'Đơn hàng đã được đặt thành công',
                message: isQRPayment
                    ? `Đơn hàng ${newOrder.id} đã được tạo. Vui lòng quét mã QR để hoàn tất thanh toán.`
                    : `Đơn hàng ${newOrder.id} của bạn đã được xác nhận và bếp đang bắt đầu chuẩn bị.`,
                time: formatDateTimeViVN(),
                isRead: false,
                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
            });

            clearCart();
            setNote('');
            setSelectedVoucher(undefined);
            setIsLoading(false);
            setCartOpen(false);

            showCustomerNotification(
                isQRPayment ? 'Vui lòng thanh toán' : 'Đặt đơn thành công!',
                isQRPayment
                    ? `Đơn hàng ${newOrder.id} đang chờ thanh toán qua mã QR.`
                    : `Đơn hàng ${newOrder.id} của bạn đã được xác nhận.`,
                isQRPayment ? 'info' : 'success'
            );

            setPage(isQRPayment ? 'qr-payment' : 'history');
        } catch (error) {
            console.error("Lỗi đặt hàng", error);
            setIsLoading(false);
            showCustomerNotification('Lỗi đặt hàng', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', 'error');
        }
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
