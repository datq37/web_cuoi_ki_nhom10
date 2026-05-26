import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';

export const formatVND = (amount: number) =>
    amount.toLocaleString('vi-VN');

export const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

export const getDishImage = (cat?: string) => {
    if (cat === 'noodle') return bunPho;
    if (cat === 'drink') return doUong;
    if (cat === 'snack') return anNhe;
    if (cat === 'veg') return chaySalad;
    return comPhan;
};
