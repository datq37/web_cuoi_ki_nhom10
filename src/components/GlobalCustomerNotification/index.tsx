import React, { useEffect, useState, useCallback } from 'react';
import type { CustomerNotificationPayload, NotificationType } from '@/utils/notification';
import './index.less';

const ICONS: Record<NotificationType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

interface ToastItem extends CustomerNotificationPayload {
  id: number;
  visible: boolean;
}

let idCounter = 0;

const GlobalCustomerNotification: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      if (!e.detail) return;
      const id = ++idCounter;
      const toast: ToastItem = {
        id,
        title: e.detail.title,
        description: e.detail.description,
        type: e.detail.type || 'success',
        visible: true,
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => removeToast(id), 3000);
    };

    window.addEventListener('show_global_customer_notification', handler);
    return () => window.removeEventListener('show_global_customer_notification', handler);
  }, [removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="global-notification-wrapper">
      {toasts.map((toast) => {
        const type = toast.type || 'success';
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`toast-item toast-${type} ${toast.visible ? 'visible' : ''}`}
          >
            {/* Icon circle */}
            <div className="toast-icon-circle">
              {ICONS[type]}
            </div>

            {/* Text */}
            <div className="toast-text-content">
              <div className={`toast-title ${toast.description ? 'has-desc' : ''}`}>
                {toast.title}
              </div>
              {toast.description && (
                <div className="toast-description">
                  {toast.description}
                </div>
              )}
            </div>

            {/* Close button */}
            <div className="toast-close-btn">
              ×
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalCustomerNotification;
