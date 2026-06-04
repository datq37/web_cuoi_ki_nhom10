import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import comPhan from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';
import phoImg from '@/assets/trangchu/pho.png';
import bunChaImg from '@/assets/trangchu/buncha.png';
import xoiImg from '@/assets/trangchu/xoi.png';
import { formatNumberViVN } from '@/utils/format';
import type { Dish } from '@/services/KhachHang/ThucDon/typing';

export const formatVND = formatNumberViVN;

export const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

const dishFallbackImages: Record<string, string> = {
    m1: comPhan,
    m2: phoImg,
    m3: bunChaImg,
    m4: comPhan,
    m5: chaySalad,
    m6: xoiImg,
    m7: comPhan,
    m8: bunPho,
    m9: chaySalad,
    m10: anNhe,
    m11: doUong,
    m12: doUong,
};

const categoryFallbackImages: Record<string, string> = {
    rice: comPhan,
    noodle: bunPho,
    drink: doUong,
    snack: anNhe,
    veg: chaySalad,
    main: comPhan,
};

export const getDishImage = (dish?: Pick<Dish, 'id' | 'cat' | 'hinhAnh'> | null) => {
    if (dish?.hinhAnh) return dish.hinhAnh;
    if (dish?.id && dishFallbackImages[dish.id]) return dishFallbackImages[dish.id];
    if (dish?.cat && categoryFallbackImages[dish.cat]) return categoryFallbackImages[dish.cat];
    return comPhan;
};
