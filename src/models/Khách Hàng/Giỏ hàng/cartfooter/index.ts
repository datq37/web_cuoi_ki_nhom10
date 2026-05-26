import { useModel } from 'umi';
import { SERVICE_FEE_RATE } from '@/services/Khách hàng/Giỏ hàng/cartfooter';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';

// ─── Custom Hook quản lý logic tính toán giá cho CartFooter ───────────────────
export function useCartFooterModel(selectedVoucher: Voucher | undefined) {
    const { cart } = useModel('Khách Hàng.Thực đơn.index');

    const subtotal: number = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.qty,
        0,
    );

    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

    const discount = (() => {
        if (!selectedVoucher) return 0;
        if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
        // Nếu loại giảm là phần trăm, tính theo % của subtotal
        if (selectedVoucher.loai === 'phan_tram') {
            return Math.round(subtotal * selectedVoucher.discount / 100);
        }
        // Ngược lại dùng số tiền cố định
        return selectedVoucher.discount;
    })();

    const total = Math.max(0, subtotal + serviceFee - discount);

    const isEmpty = cart.length === 0;

    // Kiểm tra voucher không đủ điều kiện
    const voucherNotMet =
        !!selectedVoucher &&
        !!selectedVoucher.minOrder &&
        subtotal < selectedVoucher.minOrder;

    return {
        cart,
        subtotal,
        serviceFee,
        discount,
        total,
        isEmpty,
        voucherNotMet,
    };
}
