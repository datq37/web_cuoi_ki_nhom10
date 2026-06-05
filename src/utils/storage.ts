
export function setAdminSession(user: { ten: string; email: string; avatar?: string }) {
  localStorage.setItem('admin_token', JSON.stringify('authenticated'));
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export const KEYS = {
  orders: 'admin_orders',
  inventory: 'kho_nguyen_lieu',
  importHistory: 'lich_su_nhap',
  settings: 'canteen_settings',
  user: 'admin_user',
  token: 'admin_token',
  dishes: 'admin_dishes',
  customers: 'admin_customers',
  staff: 'admin_staff',
  tables: 'admin_tables',
} as const;

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch { return fallback; }
  },
  set(key: string, val: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* quota exceeded */ }
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};
