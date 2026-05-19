import { useState, useCallback, useMemo, useEffect } from 'react';
import { Dish } from '@/services/Khách hàng/Thực đơn/typing';
import { SEED_MENU, MENU_CATEGORIES } from '@/services/Khách hàng/Thực đơn';
import { SEED_REVIEWS, Review } from '@/services/Khách hàng/Thực đơn/reviews';

// ─── Logic lời chào theo giờ trong ngày ───────────────────────────────────────────────
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Chào buổi sáng! ☀️';
  if (hour >= 11 && hour < 13) return 'Chào buổi trưa! 🍱';
  if (hour >= 13 && hour < 18) return 'Chào buổi chiều! 🌤️';
  return 'Chào buổi tối! 🌙';
};

// ─── Logic tính ngày trong tuần hiện tại ──────────────────────────────────────────────
export interface WeekDay {
  name: string;
  num: number;
  month: number;
  isToday: boolean;
}

const getWeekDays = (): WeekDay[] => {
  const today = new Date();
  const dow = today.getDay(); // 0=CN, 1=T2, ...6=T7
  const mondayOffset = dow === 0 ? -6 : 1 - dow; // tính offset đến Thứ 2
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return dayNames.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name,
      num: d.getDate(),
      month: d.getMonth() + 1,
      isToday: d.toDateString() === today.toDateString(),
    };
  });
};
const getTodayTabIndex = (): number => {
  const dow = new Date().getDay(); // 0=CN, 1=T2,...6=T7
  if (dow === 0) return 0; // Chủ nhật → mặc định chọn tab Thứ 2
  return Math.min(dow - 1, 5); // T2=0, T3=1, ..., T7=5
};


// ──────────────────────────────────────────────────────────────────────────────

export default function useCartModel() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  // Từ khóa tìm kiếm món ăn theo tên
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Lời chào và đồng hồ thời gian thực ───────────────────────────────────────────────
  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setGreeting(getGreeting());
    }, 60000); // cập nhật lời chào và giờ mỗi phút
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  // ─── Danh sách ngày trong tuần hiện tại ───────────────────────────────────────────────
  const [days, setDays] = useState<WeekDay[]>(getWeekDays());

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getWeekDays());
    }, 60000); // kiểm tra và cập nhật mỗi phút khi sang ngày mới
    return () => clearInterval(timer);
  }, []);

  const todayTabIndex = getTodayTabIndex();

  // ─── Quản lý giỏ hàng ──────────────────────────────────────────────────────────
  const addToCart = useCallback((dish: Dish) => {
    setCart(prev => [...prev, { ...dish, qty: 1 }]);
  }, []);

  const incCart = useCallback((id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  }, []);

  const decCart = useCallback((id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ─── Lọc thực đơn theo danh mục và từ khóa tìm kiếm ──────────────────────────────
  const filteredMenu = useMemo(() => {
    let result = activeCategory === 'all' ? SEED_MENU : SEED_MENU.filter(d => d.cat === activeCategory);
    if (searchQuery.trim()) {
      const keyword = searchQuery.trim().toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(keyword));
    }
    return result;
  }, [activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SEED_MENU.length };
    MENU_CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = SEED_MENU.filter(d => d.cat === cat.id).length;
      }
    });
    return counts;
  }, []);

  // ─── Quản lý đánh giá/bình luận món ăn ───────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const addReview = useCallback((newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: `r_${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
    };
    setReviews(prev => [review, ...prev]);
  }, []);

  return {
    // lời chào và giờ hiện tại
    greeting,
    timeStr,
    dateStr,
    // ngày trong tuần
    days,
    todayTabIndex,
    // giỏ hàng
    cart,
    addToCart,
    incCart,
    decCart,
    clearCart,
    // thực đơn
    activeCategory,
    setActiveCategory,
    filteredMenu,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    // mốc thời gian
    // giao diện
    cartOpen,
    setCartOpen,
    // đánh giá
    reviews,
    addReview,
  };
}
