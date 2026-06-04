import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { SERVICE_FEE_RATE } from '@/services/KhachHang/Giỏ hàng/cartfooter';
import type { Voucher } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { VoucherLoai } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';

function isActiveCombo(c: any) {
    if (!c.hoatDong) return false;
    if (c.trangThai === 'het_han' || c.trangThai === 'tam_dung') return false;
    if (!c.hetHan) return true;

    const parts = c.hetHan.split('/');
    if (parts.length !== 3) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return exp >= today;
}

function calcComboFinalPrice(c: any, originalComboPrice: number) {
    if (c.loaiGia === 'phan_tram') {
        return Math.round(originalComboPrice * (1 - c.giaTriGiam / 100));
    }
    return c.giaTriGiam;
}

// hook tính giá
export function useCartFooterModel(selectedVoucher: Voucher | undefined) {
    const { cart } = useModel('KhachHang.ThucDon.index');
    const [combos, setCombos] = useState<any[]>([]);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const res = await axios.get(`${ip3}/combos`);
                const list = (res.data?.items || []).map(SyncAdapters.mapAdminComboToUI);
                setCombos(list.filter(isActiveCombo));
            } catch (error) {
                console.error('Failed to load cart combos:', error);
                setCombos([]);
            }
        };

        fetchCombos();
    }, []);

    const subtotal: number = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.qty,
        0,
    );

    // tính combo
    let comboDiscount = 0;
    const selectedComboIds = new Set(
        cart
            .map((item: any) => item.comboId)
            .filter(Boolean),
    );
    
    // map số lượng món
    const cartQtyMap: Record<string, number> = {};
    cart.forEach((it: any) => {
        cartQtyMap[it.id] = it.qty;
    });

    combos.forEach((c: any) => {
        if (!selectedComboIds.has(c.id)) return;
        if (!c.monAnIds || c.monAnIds.length === 0) return;
        
        // kiểm tra số combo
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
            // tính giá combo
            let originalComboPrice = 0;
            c.monAnIds.forEach((id: string) => {
                const itemInCart = cart.find((it: any) => it.id === id);
                if (itemInCart) {
                    originalComboPrice += itemInCart.price;
                }
            });

            const comboFinalPrice = calcComboFinalPrice(c, originalComboPrice);
            const discountPerSet = Math.max(0, originalComboPrice - comboFinalPrice);

            comboDiscount += (discountPerSet * maxComboCount);
            
            // giảm map số lượng
            // cho phép áp dụng đồng thời
        }
    });

    comboDiscount = Math.round(comboDiscount);

    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

    const voucherDiscount = (() => {
        if (comboDiscount > 0) return 0;
        if (!selectedVoucher) return 0;
        if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
        // tính giảm phần trăm
        if (selectedVoucher.loai === VoucherLoai.PhanTram) {
            return Math.round(subtotal * selectedVoucher.discount / 100);
        }
        // giảm tiền cố định
        return selectedVoucher.discount;
    })();

    const discount = voucherDiscount + comboDiscount;

    const total = Math.max(0, subtotal + serviceFee - discount);

    const isEmpty = cart.length === 0;

    // kiểm tra voucher
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
