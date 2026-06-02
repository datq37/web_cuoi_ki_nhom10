import { useCallback, useState } from 'react';

/**
 * useLocalStorage<T>
 *
 * Custom hook đọc/ghi localStorage với TypeScript generic.
 * Tự động parse/stringify JSON, handle lỗi an toàn.
 *
 * @example
 * const [orders, setOrders] = useLocalStorage<DonTrucTiep[]>('admin_orders', []);
 * const [user, setUser]     = useLocalStorage<AdminUser>('admin_user', null);
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Đọc giá trị ban đầu từ localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Ghi giá trị mới vào cả state và localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const next = typeof value === 'function'
            ? (value as (prev: T) => T)(prev)
            : value;
          localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch {
        /* localStorage có thể bị đầy hoặc bị block */
      }
    },
    [key],
  );

  // Xoá key khỏi localStorage và reset về initialValue
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch { /* */ }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
