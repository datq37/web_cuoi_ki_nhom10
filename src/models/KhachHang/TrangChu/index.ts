import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import { SEED_VOUCHERS } from '@/services/KhachHang/Giỏ hàng/cartoption';
import type { Dish } from '@/services/KhachHang/ThucDon/typing';
import comPhan from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';

export default function useTrangChuModel() {
    const { setPage } = useModel('KhachHang.GlobalState.index') as any;
    const { cart, addToCart, incCart, decCart } = useModel('KhachHang.ThucDon.index') as any;
    const { orders } = useModel('KhachHang.Đơn Hàng.Orders') as any;
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    const bestSellingDishes = useMemo(
        () => [...SEED_MENU].sort((a, b) => b.sold - a.sold).slice(0, 3),
        [],
    );

    const cartQty = (id: string) => {
        const item = cart.find((c: any) => c.id === id);
        return item ? item.qty : 0;
    };

    const getDishImage = (dish: Dish) => {
        if (dish.cat === 'noodle') return bunPho;
        if (dish.cat === 'drink') return doUong;
        if (dish.cat === 'snack') return anNhe;
        if (dish.cat === 'veg') return chaySalad;
        return comPhan;
    };

    return {
        setPage,
        cart,
        addToCart,
        incCart,
        decCart,
        selectedDish,
        setSelectedDish,
        bestSellingDishes,
        todayDishCount: SEED_MENU.length,
        activeOfferCount: SEED_VOUCHERS.length,
        placedOrderCount: orders.length,
        cartQty,
        getDishImage,
    };
}
