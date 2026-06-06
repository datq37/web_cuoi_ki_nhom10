import React, { createContext, useCallback, useContext, useState } from 'react';

export type NotifType =
  | 'order_pending'
  | 'order_confirmed'
  | 'order_cooking'
  | 'order_ready'
  | 'order_done'
  | 'order_cancelled'
  | 'stock_low'
  | 'stock_empty'
  | 'stock_refilled';

export interface INotif {
  id: string;
  icon: string;
  title: string;
  desc: string;
  createdAt: number;
  read: boolean;
  type: NotifType;
}

export function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

interface NotifContextValue {
  notifs: INotif[];
  addNotif: (partial: Omit<INotif, 'id' | 'createdAt' | 'read'> & { id?: string }) => void;
  markRead: (id: string) => void;
  markAll: () => void;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export const NotifProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifs, setNotifs] = useState<INotif[]>([]);

  const addNotif = useCallback((partial: Omit<INotif, 'id' | 'createdAt' | 'read'> & { id?: string }) => {
    setNotifs((prev) => {
      const id = partial.id || `notif_${Date.now()}`;
      if (prev.some((n) => n.id === id)) return prev;

      return [
        { ...partial, id, createdAt: Date.now(), read: false },
        ...prev,
      ];
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAll = useCallback(() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true }))), []);

  return (
    <NotifContext.Provider value={{ notifs, addNotif, markRead, markAll }}>
      {children}
    </NotifContext.Provider>
  );
};

export function useNotif(): NotifContextValue {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotif phải được dùng trong NotifProvider');
  return ctx;
}
