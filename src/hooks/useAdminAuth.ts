import { useCallback } from 'react';
import { history } from 'umi';
import { KEYS, clearAdminSession } from '@/utils/storage';
import useLocalStorage from './useLocalStorage';

interface AdminUser {
  ten: string;
  email: string;
  avatar?: string;
}

/**
 * useAdminAuth
 *
 * Custom hook quản lý trạng thái đăng nhập admin.
 * Dùng useLocalStorage để đọc/ghi token và thông tin user.
 *
 * @example
 * const { isLoggedIn, user, logout } = useAdminAuth();
 * if (!isLoggedIn) history.push('/admin-login');
 */
function useAdminAuth() {
  const [token]       = useLocalStorage<string | null>(KEYS.token, null);
  const [user, setUser] = useLocalStorage<AdminUser>(
    KEYS.user,
    { ten: 'Quản trị viên', email: 'admin@canteen.vn' },
  );

  const isLoggedIn = !!token;

  /** Đăng xuất: xoá session + redirect về login */
  const logout = useCallback(() => {
    clearAdminSession();
    history.replace('/');
  }, []);

  /** Cập nhật thông tin user (dùng khi lưu từ Cài Đặt) */
  const updateUser = useCallback((patch: Partial<AdminUser>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, [setUser]);

  return { isLoggedIn, user, logout, updateUser };
}

export default useAdminAuth;
