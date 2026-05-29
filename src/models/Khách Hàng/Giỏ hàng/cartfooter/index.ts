import { useModel } from 'umi';
import { SERVICE_FEE_RATE } from '@/services/Khách hàng/Giỏ hàng/cartfooter';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { VoucherLoai } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';

function getActiveCombos() {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('admin_combos');
    if (!saved) return [];
    try {
        const comboList = JSON.parse(saved);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return comboList.filter((c: any) => {
            if (!c.hoatDong) return false;
            if (c.trangThai === 'het_han' || c.trangThai === 'tam_dung') return false;
            if (c.hetHan) {
                const parts = c.hetHan.split('/');
                if (parts.length === 3) {
                    const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                    if (exp < today) return false;
                }
            }
            return true;
        });
    } catch {
        return [];
    }
}

// ─── Custom Hook quản lý logic tính toán giá cho CartFooter ───────────────────
export function useCartFooterModel(selectedVoucher: Voucher | undefined) {
    const { cart } = useModel('Khách Hàng.Thực đơn.index');

    const subtotal: number = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.qty,
        0,
    );

    // Tính toán combo tự động
    const combos = getActiveCombos();
    let comboDiscount = 0;
    
    // Tạo map số lượng món trong giỏ
    const cartQtyMap: Record<string, number> = {};
    cart.forEach((it: any) => {
        cartQtyMap[it.id] = it.qty;
    });

    combos.forEach((c: any) => {
        if (!c.monAnIds || c.monAnIds.length === 0) return;
        
        // Xem giỏ hàng thoả mãn bao nhiêu set combo này
        const requiredQtyMap: Record<string, number> = {};
        c.monAnIds.forEach((id: string) => {
            requiredQtyMap[id] = (requiredQtyMap[id] || 0) + 1;
        });

        let maxComboCount = Number.MAX_SAFE_INTEGER;
        for (const [id, reqQty] of Object.entries(requiredQtyMap)) {
            const avail = cartQtyMap[id] || 0;
            const possible = Math.floor(avail / reqQty);
            if (possible < maxComboCount) {
                maxComboCount = possible;
            }
        }

        if (maxComboCount > 0) {
            // Tính giá gốc của 1 bộ combo
            let originalComboPrice = 0;
            c.monAnIds.forEach((id: string) => {
                const itemInCart = cart.find((it: any) => it.id === id);
                if (itemInCart) {
                    originalComboPrice += itemInCart.price;
                }
            });

            // Tính tiền giảm cho 1 bộ
            let discountPerSet = 0;
            if (c.loaiGia === 'phan_tram') {
                discountPerSet = originalComboPrice * c.giaTriGiam / 100;
            } else {
                discountPerSet = c.giaTriGiam;
            }

            comboDiscount += (discountPerSet * maxComboCount);
            
            // Giảm số lượng trong map để không áp dụng trùng combo khác (nếu cần thiết)
            // Tạm thời cho phép áp dụng đồng thời nếu đủ số lượng
        }
    });

    comboDiscount = Math.round(comboDiscount);

    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

    const voucherDiscount = (() => {
        if (!selectedVoucher) return 0;
        if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
        // Nếu loại giảm là phần trăm, tính theo % của subtotal
        if (selectedVoucher.loai === VoucherLoai.PhanTram) {
            return Math.round(subtotal * selectedVoucher.discount / 100);
        }
        // Ngược lại dùng số tiền cố định
        return selectedVoucher.discount;
    })();

    const discount = voucherDiscount + comboDiscount;

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
        voucherDiscount,
        comboDiscount,
        total,
        isEmpty,
        voucherNotMet,
    };
}
