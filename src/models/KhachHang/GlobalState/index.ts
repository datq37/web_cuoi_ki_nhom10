import { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeType } from '@/services/KhachHang/Component/topbar/typing';

const CUSTOMER_THEME_KEY = 'app-theme';
const ADMIN_THEME_KEY = 'ct-admin-theme';

const PAGE_TITLES: Record<string, string> = {
  home: 'Trang chủ',
  menu: 'ThucDon hôm nay',
  history: 'Lịch sử đơn hàng',
  'qr-payment': 'Thanh toán',
  vouchers: 'Kho Voucher',
  profile: 'Thông tin cá nhân',
  settings: 'Cài đặt tài khoản',
};

const applyThemeToDocument = (theme: ThemeType) => {
  if (typeof document === 'undefined') return;

  if (theme === ThemeType.DARK) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    return;
  }

  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
};

export default function useGlobalModel() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(CUSTOMER_THEME_KEY) || localStorage.getItem(ADMIN_THEME_KEY);
      return (savedTheme as ThemeType) || ThemeType.LIGHT;
    }
    return ThemeType.LIGHT;
  });
  
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPage = sessionStorage.getItem('current_page');
      return savedPage || 'home';
    }
    return 'home';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // lưu theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOMER_THEME_KEY, theme);
      localStorage.setItem(ADMIN_THEME_KEY, theme);
      window.dispatchEvent(new CustomEvent('canteen-theme-change', { detail: theme }));
    }
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<ThemeType>).detail;
      if (nextTheme === ThemeType.DARK || nextTheme === ThemeType.LIGHT) {
        setTheme(nextTheme);
      }
    };

    window.addEventListener('canteen-theme-change', handleThemeChange);

    return () => window.removeEventListener('canteen-theme-change', handleThemeChange);
  }, []);

  // lưu page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_page', page);
    }
  }, [page]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? ThemeType.DARK : ThemeType.LIGHT));
  }, []);

  const breadcrumbs = useMemo(() => {
    return ['Người dùng', PAGE_TITLES[page] || page];
  }, [page]);

  return {
    theme,
    toggleTheme,
    setTheme,
    page,
    setPage,
    breadcrumbs,
    isSidebarOpen,
    setIsSidebarOpen
  };
}
