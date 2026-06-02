import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import comPhan from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';
import { formatNumberViVN } from '@/utils/format';

export const formatVND = formatNumberViVN;

export const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

export const getDishImage = (cat?: string) => {
    if (cat === 'noodle') return bunPho;
    if (cat === 'drink') return doUong;
    if (cat === 'snack') return anNhe;
    if (cat === 'veg') return chaySalad;
    return comPhan;
};
