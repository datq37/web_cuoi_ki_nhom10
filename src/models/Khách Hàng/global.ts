import { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

const PAGE_TITLES: Record<string, string> = {
  home: 'Trang chủ',
  menu: 'Thực đơn hôm nay',
  history: 'Lịch sử đơn hàng',
  'qr-payment': 'Thanh toán',
  vouchers: 'Kho Voucher',
  profile: 'Thông tin cá nhân',
  settings: 'Cài đặt tài khoản',
};

export default function useGlobalModel() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return (savedTheme as ThemeType) || ThemeType.LIGHT;
  });
  const [page, setPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lưu theme vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? ThemeType.DARK : ThemeType.LIGHT));
  }, []);

  const breadcrumbs = useMemo(() => {
    return ['Khách hàng', PAGE_TITLES[page] || page];
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
