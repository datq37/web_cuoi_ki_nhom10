import { VoucherTheme, type Voucher } from './typing';

export const BUFFER_MIN = 5;

export const SEED_VOUCHERS: Voucher[] = [
    {
        id: 'v1',
        code: 'VCH10K',
        discount: 10000,
        desc: 'Giảm 10.000đ cho đơn từ 50k',
        minOrder: 50000,
        badge: 'Ưu đãi có hạn',
        expire: '31.05.2026',
        valueLabel: '10.000đ',
        typeLabel: 'GIẢM GIÁ',
        theme: VoucherTheme.Green,
    },
    {
        id: 'v2',
        code: 'VCHFREE',
        discount: 2000,
        desc: 'Miễn phí phục vụ',
        minOrder: 0,
        badge: 'Ưu đãi có hạn',
        expire: '31.05.2026',
        valueLabel: 'MIỄN PHÍ',
        typeLabel: 'PHỤC VỤ',
        theme: VoucherTheme.Orange,
    },
    {
        id: 'v3',
        code: 'NEW15K',
        discount: 15000,
        desc: 'Giảm 15.000đ cho khách hàng mới',
        minOrder: 30000,
        badge: 'Khách mới',
        expire: '31.05.2026',
        valueLabel: '15.000đ',
        typeLabel: 'GIẢM GIÁ',
        theme: VoucherTheme.Lime,
    },
];
