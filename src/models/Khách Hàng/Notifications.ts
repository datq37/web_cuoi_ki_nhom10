import { useState, useCallback, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  image?: string;
}

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n2',
    title: 'Đơn hàng đã được đặt thành công',
    message: 'Đơn hàng BU-2842 của bạn đã được xác nhận và bếp đang bắt đầu chuẩn bị.',
    time: '18/05/2026 09:30',
    isRead: true,
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
  },
  {
    id: 'n3',
    title: 'Đơn hàng sắp được giao tới bạn',
    message: 'Đơn hàng BU-2842 đã chuẩn bị xong và đang trên đường giao đến bạn. Vui lòng chú ý điện thoại!',
    time: '18/05/2026 09:45',
    isRead: false,
    image: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png'
  }
];

export default function useNotificationModel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_NOTIFICATIONS;
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notif: NotificationItem) => {
    setNotifications(prev => [notif, ...prev]);
  }, []);

  useEffect(() => {
    const handleNewNotif = (e: any) => {
      if (e.detail) {
        addNotification(e.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'app_notifications' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          setNotifications(list);
        } catch {}
      }
    };

    window.addEventListener('new_notification', handleNewNotif);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('new_notification', handleNewNotif);
      window.removeEventListener('storage', handleStorage);
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    isNotificationOpen,
    setIsNotificationOpen,
    markAsRead,
    markAllAsRead,
    addNotification
  };
}
