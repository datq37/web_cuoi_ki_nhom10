import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockData } from '@/services/QuanTri/Tổng Quan';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';

// Trạng thái enum value — tránh import circular
const HOAN_THANH = 'hoan_thanh';
const CHO_XAC_NHAN = 'cho_xac_nhan';
const DANG_CHE_BIEN = 'dang_che_bien';
const SAN_SANG = 'san_sang';
const DA_HUY = 'da_huy';

function loadOrders(): DonTrucTiep[] {
  try {
    const saved = localStorage.getItem('admin_orders');
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch { /* fallback */ }
  return mockData.trucTiep.donHang;
}

export default function useDonHangModel() {
  const [orders, setOrders] = useState<DonTrucTiep[]>(loadOrders);

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    loadOrders().forEach((o) => {
      if ((o.trangThai as any) === DA_HUY) s.add(o.maDon);
    });
    return s;
  });

  // Đồng bộ xuống localStorage mỗi khi orders thay đổi
  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('admin_orders_updated'));
  }, [orders]);

  // Lắng nghe thay đổi từ tab khác hoặc từ phía KhachHang
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('admin_orders');
      if (!saved) return;
      try {
        const list = JSON.parse(saved);
        if (!Array.isArray(list)) return;
        setOrders((prev) => (JSON.stringify(prev) === saved ? prev : list));
        setCancelledIds(() => {
          const s = new Set<string>();
          list.forEach((o: any) => {
            if (o.trangThai === DA_HUY) s.add(o.maDon);
          });
          return s;
        });
      } catch { /* bỏ qua */ }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const fetchOrders = useCallback(() => {
    const list = loadOrders();
    setOrders(list);
    const s = new Set<string>();
    list.forEach((o) => {
      if ((o.trangThai as any) === DA_HUY) s.add(o.maDon);
    });
    setCancelledIds(s);
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tong: active.length,
      choXacNhan: active.filter((o) => o.trangThai === CHO_XAC_NHAN).length,
      dangCheBien: active.filter((o) => o.trangThai === DANG_CHE_BIEN).length,
      doanhThu: active
        .filter((o) => o.trangThai === HOAN_THANH)
        .reduce((s, o) => s + o.tongTien, 0),
    };
  }, [orders, cancelledIds]);

  const tabCounts = useMemo<Record<string, number>>(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tat_ca: active.length,
      [CHO_XAC_NHAN]: active.filter((o) => o.trangThai === CHO_XAC_NHAN).length,
      [DANG_CHE_BIEN]: active.filter((o) => o.trangThai === DANG_CHE_BIEN).length,
      [SAN_SANG]: active.filter((o) => o.trangThai === SAN_SANG).length,
      [HOAN_THANH]: active.filter((o) => o.trangThai === HOAN_THANH).length,
      da_huy: cancelledIds.size,
    };
  }, [orders, cancelledIds]);

  const moveStatus = useCallback((maDon: string, newStatus: string) => {
    if (newStatus === DA_HUY) setCancelledIds((p) => new Set([...p, maDon]));
    setOrders((p) =>
      p.map((o) => (o.maDon === maDon ? { ...o, trangThai: newStatus as any } : o)),
    );
  }, []);

  const bulkMoveStatus = useCallback((maDons: string[], newStatus: string) => {
    if (newStatus === DA_HUY) setCancelledIds((p) => new Set([...p, ...maDons]));
    setOrders((p) =>
      p.map((o) => (maDons.includes(o.maDon) ? { ...o, trangThai: newStatus as any } : o)),
    );
  }, []);

  return {
    orders,
    setOrders,
    cancelledIds,
    stats,
    tabCounts,
    moveStatus,
    bulkMoveStatus,
    fetchOrders,
  };
}
