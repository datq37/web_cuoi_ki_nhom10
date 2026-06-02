import React, { createContext, useContext, useState } from 'react';
import { DANH_SACH_NGUYEN_LIEU } from '@/services/QuanTri/Kho Nguyên Liệu';
import { ETrangThaiNguyenLieu } from '@/services/QuanTri/Kho Nguyên Liệu/typing';
import { mockData } from '@/services/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';

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

function buildInitialNotifs(): INotif[] {
  const now = Date.now();
  const notifs: INotif[] = [];

  mockData.trucTiep.donHang
    .filter((d) => d.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN)
    .forEach((d, i) => {
      notifs.push({
        id: `init_order_${d.maDon}`,
        icon: '🛒',
        title: `Đơn hàng mới ${d.maDon}`,
        desc: `${d.khachHang.ten} đặt ${d.monAn.length} món · ${d.monAn
          .slice(0, 2)
          .map((m) => m.ten)
          .join(', ')}`,
        createdAt: now - (i + 1) * 2 * 60 * 1000,
        read: false,
        type: 'order_pending',
      });
    });

  DANH_SACH_NGUYEN_LIEU.filter(
    (n) => n.trangThai === ETrangThaiNguyenLieu.SAP_HET,
  ).forEach((n, i) => {
    notifs.push({
      id: `init_low_${n.id}`,
      icon: '⚠️',
      title: `Kho sắp hết — ${n.ten}`,
      desc: `Còn ${n.tonKho} ${n.donVi}, dưới mức tối thiểu (${n.mucToiThieu} ${n.donVi})`,
      createdAt: now - (i + 1) * 15 * 60 * 1000,
      read: false,
      type: 'stock_low',
    });
  });

  DANH_SACH_NGUYEN_LIEU.filter(
    (n) => n.trangThai === ETrangThaiNguyenLieu.HET_HANG,
  ).forEach((n, i) => {
    notifs.push({
      id: `init_empty_${n.id}`,
      icon: '🚫',
      title: `Hết hàng — ${n.ten}`,
      desc: `${n.ten} đã hết trong kho, cần nhập ngay`,
      createdAt: now - (i + 1) * 60 * 60 * 1000,
      read: true,
      type: 'stock_empty',
    });
  });

  return notifs;
}

interface NotifContextValue {
  notifs: INotif[];
  addNotif: (partial: Omit<INotif, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAll: () => void;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export const NotifProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifs, setNotifs] = useState<INotif[]>(buildInitialNotifs);

  const addNotif = (partial: Omit<INotif, 'id' | 'createdAt' | 'read'>) => {
    setNotifs((prev) => [
      { ...partial, id: `notif_${Date.now()}`, createdAt: Date.now(), read: false },
      ...prev,
    ]);
  };

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAll = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

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
