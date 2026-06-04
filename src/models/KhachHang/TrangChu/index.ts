import { useMemo, useState, useEffect } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { Dish } from '@/services/KhachHang/ThucDon/typing';
import { SyncAdapters } from '@/services/api/adapters';
import comPhan from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';

export default function useTrangChuModel() {
    const { setPage } = useModel('KhachHang.GlobalState.index') as any;
    const { cart, addToCart, incCart, decCart, dishes, categories, reviews } = useModel('KhachHang.ThucDon.index') as any;
    const { orders } = useModel('KhachHang.Đơn Hàng.Orders') as any;
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
    const [todayBestSellingDishes, setTodayBestSellingDishes] = useState<Dish[]>([]);

    const fallbackBestSellingDishes = useMemo(
        () => [...(dishes || [])].sort((a, b) => b.sold - a.sold).slice(0, 3),
        [dishes],
    );
    const bestSellingDishes = useMemo(() => {
        const baseList = todayBestSellingDishes.length > 0 ? todayBestSellingDishes : fallbackBestSellingDishes;
        return baseList.map(dish => {
            const dishReviews = (reviews || []).filter((r: any) => r.dishId === dish.id);
            let avgRating = 5;
            if (dishReviews.length > 0) {
                const total = dishReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                avgRating = total / dishReviews.length;
            }
            return {
                ...dish,
                rating: avgRating
            };
        });
    }, [todayBestSellingDishes, fallbackBestSellingDishes, reviews]);

    useEffect(() => {
        const fetchTodayBestSelling = async () => {
            try {
                const res = await axios.get(`${ip3}/menus/top-selling-today?limit=3`);
                const list = (res.data?.items || []).map(SyncAdapters.mapMenuToUI);
                setTodayBestSellingDishes(list);
            } catch (e) {
                console.error("Failed to load today's best-selling dishes", e);
                setTodayBestSellingDishes([]);
            }
        };

        fetchTodayBestSelling();
    }, [orders?.length]);

    const cartQty = (id: string) => {
        const item = cart.find((c: any) => c.id === id);
        return item ? item.qty : 0;
    };

    const getDishImage = (dish: Dish) => {
        if (dish.hinhAnh) return dish.hinhAnh;
        if (dish.cat === 'noodle') return bunPho;
        if (dish.cat === 'drink') return doUong;
        if (dish.cat === 'snack') return anNhe;
        if (dish.cat === 'veg') return chaySalad;
        return comPhan;
    };

    const [activeOfferCount, setActiveOfferCount] = useState(0);

    // Lấy số lượng ưu đãi từ backend
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await axios.get(`${ip3}/promotions`);
                if (res.data && Array.isArray(res.data)) {
                    // Lọc các khuyến mãi đang hoạt động
                    const active = res.data.filter((p: any) => p.hoatdong === true || p.hoatdong === 1);
                    setActiveOfferCount(active.length);
                }
            } catch (e) {
                console.error("Failed to load promotions for stats", e);
            }
        };
        fetchPromotions();
    }, []);

    return {
        setPage,
        cart,
        addToCart,
        incCart,
        decCart,
        selectedDish,
        setSelectedDish,
        bestSellingDishes,
        todayDishCount: dishes?.length || 0,
        activeOfferCount,
        placedOrderCount: orders?.length || 0,
        cartQty,
        getDishImage,
        categories,
    };
}
