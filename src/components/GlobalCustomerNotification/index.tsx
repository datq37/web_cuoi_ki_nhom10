import React, { useEffect, useState, useCallback } from 'react';
import type { CustomerNotificationPayload, NotificationType } from '@/utils/notification';

const ICONS: Record<NotificationType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const COLORS: Record<NotificationType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'linear-gradient(135deg, #0f2027, #1a3a1a)',
    border: '#22c55e',
    icon: '#22c55e',
  },
  error: {
    bg: 'linear-gradient(135deg, #2a0a0a, #3a1010)',
    border: '#ef4444',
    icon: '#ef4444',
  },
  info: {
    bg: 'linear-gradient(135deg, #0a1a2a, #102040)',
    border: '#3b82f6',
    icon: '#3b82f6',
  },
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
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const type = toast.type || 'success';
        const color = COLORS[type];
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'all',
              cursor: 'pointer',
              minWidth: 320,
              maxWidth: 400,
              padding: '16px 20px',
              borderRadius: 16,
              background: color.bg,
              border: `1.5px solid ${color.border}`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color.border}22`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              transform: toast.visible ? 'translateX(0)' : 'translateX(110%)',
              opacity: toast.visible ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `${color.border}22`,
                border: `2px solid ${color.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {ICONS[type]}
            </div>

            {/* Text */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: 1.3,
                  marginBottom: toast.description ? 4 : 0,
                }}
              >
                {toast.title}
              </div>
              {toast.description && (
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {toast.description}
                </div>
              )}
            </div>

            {/* Close button */}
            <div
              style={{
                color: '#64748b',
                fontSize: 16,
                lineHeight: 1,
                flexShrink: 0,
                paddingTop: 2,
              }}
            >
              ×
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalCustomerNotification;
