import { useState, useCallback, useEffect } from 'react';

import { NotificationItem, SEED_NOTIFICATIONS } from '@/services/Khách hàng/Thông báo';

export default function useNotificationModel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch { }
      }
    }
    return SEED_NOTIFICATIONS;
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);


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
        } catch { }
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
