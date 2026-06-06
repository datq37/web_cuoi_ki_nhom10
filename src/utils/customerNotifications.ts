import type { NotificationItem } from '@/services/KhachHang/Thông báo';

const APP_NOTIFICATIONS_KEY = 'app_notifications';
const READY_ORDER_IDS_KEY = 'notified_ready_orders';

const readJsonArray = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJsonArray = <T,>(key: string, value: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const formatNow = () =>
  new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const pushCustomerNotification = (notif: NotificationItem) => {
  if (typeof window === 'undefined') return;

  const current = readJsonArray<NotificationItem>(APP_NOTIFICATIONS_KEY);
  if (!current.some((item) => item.id === notif.id)) {
    writeJsonArray(APP_NOTIFICATIONS_KEY, [notif, ...current]);
  }

  window.dispatchEvent(new CustomEvent('new_notification', { detail: notif }));
};

export const notifyCustomerOrderReady = (orderId: string) => {
  if (!orderId || typeof window === 'undefined') return;

  const notifiedIds = readJsonArray<string>(READY_ORDER_IDS_KEY);
  if (notifiedIds.includes(orderId)) return;

  pushCustomerNotification({
    id: `order_ready_${orderId}`,
    title: 'Đơn hàng sắp được giao',
    message: `Đơn hàng ${orderId} sắp được giao tới bạn.`,
    time: formatNow(),
    isRead: false,
  });

  writeJsonArray(READY_ORDER_IDS_KEY, [orderId, ...notifiedIds]);
};
