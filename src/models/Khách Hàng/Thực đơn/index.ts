import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dish, Review, WeekDay } from '@/services/Khách hàng/Thực đơn/typing';
import { MENU_CATEGORIES, SEED_MENU, SEED_REVIEWS } from '@/services/Khách hàng/Thực đơn';
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

export default function useCartModel() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

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
    () => filterMenuByCategoryAndSearch(SEED_MENU, activeCategory, searchQuery),
    [activeCategory, searchQuery]
  );

  const categoryCounts = useMemo(
    () => buildCategoryCounts(SEED_MENU, MENU_CATEGORIES),
    []
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
  };
}
