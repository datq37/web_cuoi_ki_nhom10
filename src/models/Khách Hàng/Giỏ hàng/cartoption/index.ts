import { useState, useEffect } from 'react';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import { SEED_VOUCHERS, BUFFER_MIN } from '@/services/Khách hàng/Giỏ hàng/cartoption';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { VoucherLoai, VoucherTheme } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { formatCurrency, formatTimeHHMM } from '@/utils/format';

//  Chuyển đổi IKhuyenMai (Admin) → Voucher (Customer)
function mapAdminVouchersToCustomer(adminList: any[]): Voucher[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return adminList
        .filter((k: any) => {
            if (!k.hoatDong) return false;
            if (k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
            // Lọc hết lượt dùng
            if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
            // Lọc hết hạn theo ngày thực tế (format D/M/YYYY)
            if (k.hetHan) {
                const parts = k.hetHan.split('/');
                if (parts.length === 3) {
                    const expiry = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                    if (expiry < today) return false;
                }
            }
            return true;
        })
        .map((k: any): Voucher => {
            let discount = 0;
            let valueLabel = '';
            let typeLabel = 'GIẢM GIÁ';
            let theme: VoucherTheme = VoucherTheme.Green;

            if (k.loai === VoucherLoai.PhanTram) {
                // Sẽ tính theo % đơn hàng; lưu giá trị % vào discount tạm
                discount = k.giaTriGiam;
                valueLabel = `${k.giaTriGiam}%`;
                typeLabel = 'GIẢM %';
                theme = VoucherTheme.Lime;
            } else if (k.loai === VoucherLoai.SoTien) {
                discount = k.giaTriGiam;
                valueLabel = formatCurrency(Number(k.giaTriGiam));
                typeLabel = 'GIẢM GIÁ';
                theme = VoucherTheme.Green;
            } else if (k.loai === VoucherLoai.MienShip) {
                discount = 2000;
                valueLabel = 'MIỄN PHÍ';
                typeLabel = 'PHỤC VỤ';
                theme = VoucherTheme.Orange;
            }

            return {
                id: k.id,
                code: k.ma,
                discount,
                loai: k.loai as VoucherLoai,
                desc: k.ten || k.moTa || k.ma,
                minOrder: k.donToiThieu || 0,
                badge: k.trangThai === 'sap_het' ? 'Sắp hết' : 'Ưu đãi có hạn',
                expire: k.hetHan || '31.12.2026',
                valueLabel,
                typeLabel,
                theme,
            };
        });
}

function loadVouchersFromStorage(): Voucher[] {
    if (typeof window === 'undefined') return SEED_VOUCHERS;
    const saved = localStorage.getItem('admin_vouchers');
    if (saved) {
        try {
            const adminList = JSON.parse(saved);
            const converted = mapAdminVouchersToCustomer(adminList);
            return converted.length > 0 ? converted : SEED_VOUCHERS;
        } catch { /* ignore */ }
    }
    return SEED_VOUCHERS;
}

//  Tính giờ nhận tự động
export function calcPickupTime(cart: any[]): { timeStr: string; prepMin: number } {
    if (cart.length === 0) return { timeStr: '--:--', prepMin: 0 };

    const maxPrep = cart.reduce((max: number, item: any) => {
        const dish = SEED_MENU.find(d => d.id === item.id);
        return Math.max(max, dish?.prep ?? 0);
    }, 0);

    const totalMin = maxPrep + BUFFER_MIN;
    const ready = new Date(Date.now() + totalMin * 60 * 1000);

    const timeStr = formatTimeHHMM(ready);

    return { timeStr, prepMin: totalMin };
}

// Custom Hook quản lý State của CartOption 
export function useCartOptionModel(
    cart: any[],
    subtotal: number,
    selectedVoucher: Voucher | undefined,
    onSelectVoucher: (v: Voucher | undefined) => void,
    isVoucherModalOpen: boolean,
    setIsVoucherModalOpen: (open: boolean) => void
) {
    const [pickup, setPickup] = useState(() => calcPickupTime(cart));
    const [allVouchers, setAllVouchers] = useState<Voucher[]>(() => loadVouchersFromStorage());

    useEffect(() => {
        setPickup(calcPickupTime(cart));
        const timer = setInterval(() => setPickup(calcPickupTime(cart)), 60000);
        return () => clearInterval(timer);
    }, [cart]);

    useEffect(() => {
        const reload = () => setAllVouchers(loadVouchersFromStorage());
        reload();
        window.addEventListener('storage', reload);
        window.addEventListener('focus', reload);
        return () => {
            window.removeEventListener('storage', reload);
            window.removeEventListener('focus', reload);
        };
    }, []);

    const availableVouchers = allVouchers.filter(v => !v.minOrder || subtotal >= v.minOrder);
    const unavailableVouchers = allVouchers.filter(v => v.minOrder && subtotal < v.minOrder);

    const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(selectedVoucher?.id);

    useEffect(() => {
        if (isVoucherModalOpen) {
            setTempSelectedId(selectedVoucher?.id);
        }
    }, [isVoucherModalOpen, selectedVoucher]);

    const confirmSelection = () => {
        const v = allVouchers.find(x => x.id === tempSelectedId);
        onSelectVoucher(v);
        setIsVoucherModalOpen(false);
    };

    return {
        pickup,
        availableVouchers,
        unavailableVouchers,
        tempSelectedId,
        setTempSelectedId,
        confirmSelection,
    };
}
