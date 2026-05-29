import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dish, Review, WeekDay } from '@/services/Khách hàng/Thực đơn/typing';
import { MENU_CATEGORIES, SEED_MENU, SEED_REVIEWS } from '@/services/Khách hàng/Thực đơn';
import { DANH_SACH_MON } from '@/services/Quản Trị/Quản Lý Món';
import {
  formatMenuDate,
  formatMenuTime,
  getGreeting,
} from './Hero';
import {
  getTodayTabIndex,
  getWeekDays,
} from './DateTabs';
import {
  buildCategoryCounts,
  filterMenuByCategoryAndSearch,
} from './CategoryBar';
import {
  addDishToCart,
  decreaseDishQty,
  increaseDishQty,
} from './DishCard';
import type { CartItem } from './DishCard';
import { createReview } from './DishDetailModal';

const mapAdminToCustomerDishes = (adminList: any[]): Dish[] => {
  return adminList.map((item: any) => {
    let cat = 'main';
    if (item.danhMuc === 'do_uong') cat = 'drink';
    else if (item.danhMuc === 'an_vat') cat = 'snack';
    else if (item.danhMuc === 'mon_chay') cat = 'veg';
    else if (item.danhMuc === 'rice') cat = 'rice';
    else if (item.danhMuc === 'noodle') cat = 'noodle';

    return {
      id: item.id,
      name: item.ten,
      cat: cat,
      price: item.giaBan,
      desc: item.moTa || '',
      emoji: item.emoji || (item.danhMuc === 'do_uong' ? '☕' : '🍱'),
      tags: item.isHot ? ['hot'] : [],
      rating: item.danhGia || 5,
      sold: item.sold || 0,
      prep: item.thoiGian || 10,
      kcal: item.calo || 0,
      ingredients: item.nguyenLieu || [],
      hinhAnh: item.hinhAnh,
    };
  });
};

export default function useCartModel() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [dishes, setDishes] = useState<Dish[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_dishes');
      if (saved) {
        try {
          return mapAdminToCustomerDishes(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        localStorage.setItem('admin_dishes', JSON.stringify(DANH_SACH_MON));
        return mapAdminToCustomerDishes(DANH_SACH_MON);
      }
    }
    return SEED_MENU;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setGreeting(getGreeting(now));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = formatMenuTime(currentTime);
  const dateStr = formatMenuDate(currentTime);

  const [days, setDays] = useState<WeekDay[]>(getWeekDays());

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getWeekDays());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayTabIndex = getTodayTabIndex();

  useEffect(() => {
    const loadDishes = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('admin_dishes');
        if (saved) {
          try {
            setDishes(mapAdminToCustomerDishes(JSON.parse(saved)));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    loadDishes();
    window.addEventListener('storage', loadDishes);
    window.addEventListener('focus', loadDishes);
    return () => {
      window.removeEventListener('storage', loadDishes);
      window.removeEventListener('focus', loadDishes);
    };
  }, []);

  const addToCart = useCallback((dish: Dish) => {
    setCart(prev => addDishToCart(prev, dish));
  }, []);

  const incCart = useCallback((id: string) => {
    setCart(prev => increaseDishQty(prev, id));
  }, []);

  const decCart = useCallback((id: string) => {
    setCart(prev => decreaseDishQty(prev, id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const filteredMenu = useMemo(
    () => filterMenuByCategoryAndSearch(dishes, activeCategory, searchQuery),
    [dishes, activeCategory, searchQuery]
  );

  const categoryCounts = useMemo(
    () => buildCategoryCounts(dishes, MENU_CATEGORIES),
    [dishes]
  );

  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const addReview = useCallback((newReview: Omit<Review, 'id' | 'date'>) => {
    setReviews(prev => [createReview(newReview), ...prev]);
  }, []);

  return {
    greeting,
    timeStr,
    dateStr,
    days,
    todayTabIndex,
    cart,
    addToCart,
    incCart,
    decCart,
    clearCart,
    activeCategory,
    setActiveCategory,
    filteredMenu,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    cartOpen,
    setCartOpen,
    reviews,
    addReview,
    dishes,
  };
}
