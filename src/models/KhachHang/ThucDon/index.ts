import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category, Dish, Review, WeekDay } from '@/services/KhachHang/ThucDon/typing';
import { SEED_REVIEWS } from '@/services/KhachHang/ThucDon';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
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
import { showCustomerNotification } from '@/utils/notification';
import { cacheCanteenSettings, getOrderingStatusFromCache } from '@/utils/businessHours';



export default function useCartModel() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [dishes, setDishes] = useState<Dish[]>([]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Tất cả', label: 'Tất cả', icon: 'AppstoreOutlined' },
  ]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${ip3}/categories`);
        if (res.data && Array.isArray(res.data)) {
          const fetchedCats = res.data.map((c: any) => ({
            id: String(c.id),
            name: c.name || 'Danh mục',
            label: c.name || 'Danh mục',
            image: c.image,
            icon: 'Utensils',
          }));
          setCategories([
            { id: 'all', name: 'Tất cả', label: 'Tất cả', icon: 'AppstoreOutlined' },
            ...fetchedCats,
          ]);
        }
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    };
    loadCategories();
  }, []);


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
    axios.get(`${ip3}/settings`)
      .then((res) => {
        if (res.data) {
          cacheCanteenSettings(res.data);
          setDays(getWeekDays());
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getWeekDays());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayTabIndex = useMemo(() => getTodayTabIndex(currentTime), [days, currentTime]);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const res = await axios.get(`${ip3}/menus/items`);
        if (res.data && res.data.items) {
           // Dùng adapter để đồng bộ dữ liệu Backend với giao diện
           setDishes(res.data.items.map(SyncAdapters.mapMenuToUI));
        }
      } catch (e) {
        console.error("Failed to load menus:", e);
      }
    };
    loadDishes();
  }, []);

  const canOrderNow = useCallback(() => {
    const status = getOrderingStatusFromCache();
    if (!status.open) {
      showCustomerNotification('Chưa đến giờ mở bán', status.message, 'error');
      return false;
    }
    return true;
  }, []);

  const addToCart = useCallback((dish: Dish, qty?: number) => {
    if (!canOrderNow()) return;
    setCart(prev => addDishToCart(prev, dish, qty));
  }, [canOrderNow]);

  const incCart = useCallback((id: string) => {
    if (!canOrderNow()) return;
    setCart(prev => increaseDishQty(prev, id));
  }, [canOrderNow]);

  const decCart = useCallback((id: string) => {
    setCart(prev => decreaseDishQty(prev, id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`${ip3}/reviews`);
      if (res.data && Array.isArray(res.data)) {
        const backendReviews = res.data;
        const allReviews = [...backendReviews];
        const backendIds = new Set(backendReviews.map((r: any) => r.id));
        SEED_REVIEWS.forEach(r => {
          if (!backendIds.has(r.id)) {
            allReviews.push(r);
          }
        });
        setReviews(allReviews);
      }
    } catch (e) {
      console.error("Lỗi khi tải đánh giá từ API:", e);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = useCallback(async (newReview: Omit<Review, 'id' | 'date'>) => {
    try {
      await axios.post(`${ip3}/reviews`, {
        dishId: newReview.dishId,
        rating: newReview.rating,
        comment: newReview.comment,
        images: newReview.images || [],
      });
      await fetchReviews();
    } catch (e) {
      console.error("Lỗi khi gửi đánh giá lên API:", e);
      setReviews(prev => [createReview(newReview), ...prev]);
    }
  }, [fetchReviews]);

  const dishesWithRating = useMemo(() => {
    return dishes.map(dish => {
      const dishReviews = reviews.filter(r => r.dishId === dish.id);
      let avgRating = 5;
      if (dishReviews.length > 0) {
        const total = dishReviews.reduce((sum, r) => sum + r.rating, 0);
        avgRating = total / dishReviews.length;
      }
      return {
        ...dish,
        rating: avgRating
      };
    });
  }, [dishes, reviews]);

  const filteredMenu = useMemo(
    () => filterMenuByCategoryAndSearch(dishesWithRating, activeCategory, searchQuery),
    [dishesWithRating, activeCategory, searchQuery]
  );

  const bestSeller = useMemo(() => {
    return dishesWithRating.reduce<Dish | undefined>((topDish, dish) => {
      if (!topDish || dish.sold > topDish.sold) return dish;
      return topDish;
    }, undefined);
  }, [dishesWithRating]);

  const categoryCounts = useMemo(
    () => buildCategoryCounts(dishesWithRating, categories),
    [categories, dishesWithRating]
  );

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
    bestSeller,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    cartOpen,
    setCartOpen,
    reviews,
    addReview,
    dishes: dishesWithRating,
    categories,
  };
}
