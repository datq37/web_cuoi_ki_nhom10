
export interface Voucher {
    id: string;
    code: string;
    discount: number; // số tiền giảm hoặc % (tùy logic xử lý sau này)
    desc: string;
    minOrder?: number;
}

export interface CartOptionProps {
    pickupTime: string;
    onSelectTime: (time: string) => void;
    note: string;
    onChangeNote: (note: string) => void;
    selectedVoucher?: Voucher;
    onSelectVoucher: (voucher: Voucher | undefined) => void;
}

// ─── Dữ liệu Voucher mẫu ─────────────────────────────────────────────────────
export const SEED_VOUCHERS: Voucher[] = [
    { id: 'v1', code: 'GIAM10K', discount: 10000, desc: 'Giảm 10.000đ cho đơn từ 50k', minOrder: 50000 },
    { id: 'v2', code: 'FREESHIP', discount: 2000, desc: 'Miễn phí phục vụ', minOrder: 0 },
    { id: 'v3', code: 'BANMOI', discount: 15000, desc: 'Giảm 15.000đ cho khách hàng mới', minOrder: 30000 },
];
