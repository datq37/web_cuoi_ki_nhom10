import { useEffect, useState } from 'react';
import { KEYS, store } from '@/utils/storage';
import { ip3 } from '@/utils/ip';

// ── Kiểu dữ liệu thông tin căng tin ──────────────────────────────
export interface ICanteenInfo {
  ten: string;
  diaChi: string;
  sdt: string;
  email: string;
  logo: string; // base64 hoặc đường dẫn ảnh
}

// ── Giá trị mặc định ─────────────────────────────────────────────
export const DEFAULT_CANTEEN_INFO: ICanteenInfo = {
  ten: 'Căng tin Doanh nghiệp',
  diaChi: 'Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM',
  sdt: '0283 555 1234',
  email: 'canteen@abc.com.vn',
  logo: '/logo.webp',
};

/** Sự kiện nội bộ phát ra khi admin lưu thông tin căng tin */
export const CANTEEN_INFO_CHANGE_EVENT = 'canteen_info_change';

/** Đọc thông tin căng tin từ canteen_settings trong localStorage */
function readCanteenInfoFromCache(): ICanteenInfo {
  try {
    const settings = store.get<any>(KEYS.settings, {});
    const info = settings?.thongTin ?? {};
    return {
      ten: info.ten || DEFAULT_CANTEEN_INFO.ten,
      diaChi: info.diaChi || DEFAULT_CANTEEN_INFO.diaChi,
      sdt: info.sdt || DEFAULT_CANTEEN_INFO.sdt,
      email: info.email || DEFAULT_CANTEEN_INFO.email,
      logo: info.logo || DEFAULT_CANTEEN_INFO.logo,
    };
  } catch {
    return DEFAULT_CANTEEN_INFO;
  }
}

/**
 * Hook trả về thông tin căng tin và tự động cập nhật khi admin thay đổi.
 * - Khởi tạo từ localStorage cache (hiển thị ngay, không flicker)
 * - Đồng thời fetch từ API để lấy dữ liệu mới nhất từ database
 * - Lắng nghe custom event (cùng tab) và storage event (tab khác)
 */
export function useCanteenInfo(): ICanteenInfo {
  const [info, setInfo] = useState<ICanteenInfo>(readCanteenInfoFromCache);

  useEffect(() => {
    // Đọc lại từ cache khi có thay đổi
    const refreshFromCache = () => setInfo(readCanteenInfoFromCache());

    window.addEventListener(CANTEEN_INFO_CHANGE_EVENT, refreshFromCache);
    window.addEventListener('storage', refreshFromCache);

    // Fetch từ API để lấy dữ liệu mới nhất từ database
    const token = localStorage.getItem('loginToken');
    fetch(`${ip3}/settings`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.thongTin) {
          // Cập nhật cache
          const current = store.get<any>(KEYS.settings, {});
          store.set(KEYS.settings, { ...current, ...data });
          refreshFromCache();
        }
      })
      .catch(() => { /* giữ nguyên cache nếu offline */ });

    return () => {
      window.removeEventListener(CANTEEN_INFO_CHANGE_EVENT, refreshFromCache);
      window.removeEventListener('storage', refreshFromCache);
    };
  }, []);

  return info;
}

