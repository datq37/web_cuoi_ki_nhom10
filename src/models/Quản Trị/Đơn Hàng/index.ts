import { useCallback, useEffect, useMemo, useState } from 'react';

const KEY = 'admin_orders';

// Trạng thái enum value — tránh import circular
const HOAN_THANH  = 'hoan_thanh';
const CHO_XAC_NHAN = 'cho_xac_nhan';
const DANG_CHE_BIEN = 'dang_che_bien';
const SAN_SANG = 'san_sang';

export default function useDonHangModel() {
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const list = JSON.parse(s);
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch { /* */ }
    return [];
  });

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        JSON.parse(saved).forEach((o: any) => {
          if (o.trangThai === 'da_huy') s.add(o.maDon);
        });
      }
    } catch { /* */ }
    return s;
  });

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem(KEY, JSON.stringify(orders));
    }
  }, [orders]);

  const stats = useMemo(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tong: active.length,
      choXacNhan:  active.filter((o) => o.trangThai === CHO_XAC_NHAN).length,
      dangCheBien: active.filter((o) => o.trangThai === DANG_CHE_BIEN).length,
      doanhThu:    active.filter((o) => o.trangThai === HOAN_THANH).reduce((s: number, o: any) => s + o.tongTien, 0),
    };
  }, [orders, cancelledIds]);

  const tabCounts = useMemo<Record<string, number>>(() => {
    const active = orders.filter((o) => !cancelledIds.has(o.maDon));
    return {
      tat_ca:         active.length,
      [CHO_XAC_NHAN]:  active.filter((o) => o.trangThai === CHO_XAC_NHAN).length,
      [DANG_CHE_BIEN]: active.filter((o) => o.trangThai === DANG_CHE_BIEN).length,
      [SAN_SANG]:      active.filter((o) => o.trangThai === SAN_SANG).length,
      [HOAN_THANH]:    active.filter((o) => o.trangThai === HOAN_THANH).length,
      da_huy:          cancelledIds.size,
    };
  }, [orders, cancelledIds]);

  const moveStatus = useCallback((maDon: string, newStatus: string) => {
    if (newStatus === 'da_huy') setCancelledIds((p) => new Set([...p, maDon]));
    setOrders((p) => p.map((o) => o.maDon === maDon ? { ...o, trangThai: newStatus } : o));
  }, []);

  const bulkMoveStatus = useCallback((maDons: string[], newStatus: string) => {
    if (newStatus === 'da_huy') setCancelledIds((p) => new Set([...p, ...maDons]));
    setOrders((p) => p.map((o) => maDons.includes(o.maDon) ? { ...o, trangThai: newStatus } : o));
  }, []);

  return { orders, setOrders, cancelledIds, stats, tabCounts, moveStatus, bulkMoveStatus };
}
