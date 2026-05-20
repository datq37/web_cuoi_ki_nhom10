import type { Voucher } from './typing';

export const BUFFER_MIN = 5;

export const SEED_VOUCHERS: Voucher[] = [
    { id: 'v1', code: 'GIAM10K', discount: 10000, desc: 'Giảm 10.000đ cho đơn từ 50k', minOrder: 50000 },
    { id: 'v2', code: 'FREESHIP', discount: 2000, desc: 'Miễn phí phục vụ', minOrder: 0 },
    { id: 'v3', code: 'BANMOI', discount: 15000, desc: 'Giảm 15.000đ cho khách hàng mới', minOrder: 30000 },
];
