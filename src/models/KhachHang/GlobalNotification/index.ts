import { useState, useCallback, useEffect } from 'react';
import type { CustomerNotificationPayload } from '@/utils/notification';

export default function useGlobalNotificationModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<CustomerNotificationPayload | null>(null);

  const closeNotification = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleNotificationEvent = (e: any) => {
      if (e.detail) {
        setNotification(e.detail);
        setIsOpen(true);
      }
    };

    window.addEventListener('show_global_customer_notification', handleNotificationEvent);
    
    return () => {
      window.removeEventListener('show_global_customer_notification', handleNotificationEvent);
    };
  }, []);

  return {
    isOpen,
    notification,
    closeNotification,
  };
}
