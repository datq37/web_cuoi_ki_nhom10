import { useState, useEffect } from 'react';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import { SEED_VOUCHERS, BUFFER_MIN } from '@/services/KhachHang/Giỏ hàng/cartoption';
import type { Voucher } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { VoucherLoai, VoucherTheme } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { formatCurrency, formatTimeHHMM } from '@/utils/format';

function mapAdminVouchersToCustomer(adminList: any[]): Voucher[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return adminList
        .filter((k: any) => {
            if (!k.hoatDong) return false;
            if (k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
            // lọc hết lượt
            if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
            // lọc hết hạn (hỗ trợ cả YYYY-MM-DD và DD/MM/YYYY)
            if (k.hetHan) {
                let expiry: Date;
                if (k.hetHan.includes('-')) {
                    expiry = new Date(k.hetHan);
                } else {
                    const parts = k.hetHan.split('/');
                    if (parts.length === 3) {
                        expiry = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                    } else {
                        expiry = new Date(k.hetHan);
                    }
                }
                if (expiry < today) return false;
            }
            return true;
        })
        .map((k: any): Voucher => {
            let discount = 0;
            let valueLabel = '';
            let typeLabel = 'GIẢM GIÁ';
            let theme: VoucherTheme = VoucherTheme.Green;

            if (k.loai === VoucherLoai.PhanTram || k.loai === 'phan_tram') {
                // tính phần trăm
                discount = k.giaTriGiam || 0;
                valueLabel = `${discount}%`;
                typeLabel = 'GIẢM %';
                theme = VoucherTheme.Lime;
            } else if (k.loai === VoucherLoai.SoTien || k.loai === 'so_tien') {
                discount = k.giaTriGiam || 0;
                valueLabel = formatCurrency(Number(discount));
                typeLabel = 'GIẢM GIÁ';
                theme = VoucherTheme.Green;
            } else if (k.loai === VoucherLoai.MienShip || k.loai === 'mien_ship') {
                discount = 2000;
                valueLabel = 'MIỄN PHÍ';
                typeLabel = 'PHỤC VỤ';
                theme = VoucherTheme.Orange;
            }

            return {
                id: k.id?.toString() || '',
                code: k.ma || '',
                discount,
                loai: k.loai as VoucherLoai,
                desc: k.ten || k.moTa || k.ma,
                minOrder: k.donToiThieu || k.dontooithieu || 0,
                badge: k.trangThai === 'sap_het' ? 'Sắp hết' : 'Ưu đãi có hạn',
                expire: k.hetHan || '31.12.2026',
                valueLabel,
                typeLabel,
                theme,
            };
        });
}

// tính giờ nhận tự động
export function getCartPrepMinutes(cart: any[]): number {
    if (cart.length === 0) return 0;

    return cart.reduce((total: number, item: any) => {
        const dish = SEED_MENU.find(d => d.id === item.id);
        const prepPerItem = dish?.prep ?? BUFFER_MIN;
        const qty = Math.max(1, Number(item.qty || 1));
        return total + prepPerItem * qty;
    }, 0);
}

export function formatPickupTimeFrom(baseDate: Date, prepMin: number): string {
    if (prepMin <= 0) return '--:--';

    const ready = new Date(baseDate.getTime() + prepMin * 60 * 1000);
    return formatTimeHHMM(ready);
}

export function calcPickupTime(cart: any[]): { timeStr: string; prepMin: number } {
    const totalMin = getCartPrepMinutes(cart);
    if (totalMin <= 0) return { timeStr: '--:--', prepMin: 0 };

    const timeStr = formatPickupTimeFrom(new Date(), totalMin);

    return { timeStr, prepMin: totalMin };
}

// hook quản lý cart option
export function useCartOptionModel(
    cart: any[],
    subtotal: number,
    selectedVoucher: Voucher | undefined,
    onSelectVoucher: (v: Voucher | undefined) => void,
    isVoucherModalOpen: boolean,
    setIsVoucherModalOpen: (open: boolean) => void
) {
    const [pickup, setPickup] = useState(() => calcPickupTime(cart));
    const [allVouchers, setAllVouchers] = useState<Voucher[]>(SEED_VOUCHERS);

    useEffect(() => {
        setPickup(calcPickupTime(cart));
        const timer = setInterval(() => setPickup(calcPickupTime(cart)), 60000);
        return () => clearInterval(timer);
    }, [cart]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                // Sử dụng axios để fetch trực tiếp từ API promotions của Khách hàng
                const axios = (await import('@/utils/axios')).default;
                const ip3 = (await import('@/utils/ip')).ip3;
                const SyncAdapters = (await import('@/services/api/adapters')).SyncAdapters;

                const res = await axios.get(`${ip3}/promotions/active`);
                if (res.data && res.data.items) {
                    const uiItems = res.data.items.map(SyncAdapters.mapAdminPromoToUI);
                    const converted = mapAdminVouchersToCustomer(uiItems);
                    setAllVouchers(converted.length > 0 ? converted : SEED_VOUCHERS);
                }
            } catch (error) {
                console.error('Lỗi khi tải voucher:', error);
            }
        };

        fetchVouchers();
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
