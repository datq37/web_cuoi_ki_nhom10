import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { hasLoginToken } from '@/utils/auth';
import { SyncAdapters } from '@/services/api/adapters';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';

// Trạng thái enum value
const HOAN_THANH = 'hoan_thanh';
const CHO_XAC_NHAN = 'cho_xac_nhan';
const DANG_CHE_BIEN = 'dang_che_bien';
const SAN_SANG = 'san_sang';
const DA_HUY = 'da_huy';
const CANCELLED = 'cancelled';
const PENDING = 'pending_confirmation';
const CONFIRMED = 'confirmed';
const PROCESSING = 'processing';
const DELIVERED = 'delivered';

const localizeOrderStatus = (order: any) => {
  let tt = order.trangThai;
  if (tt === CANCELLED) tt = DA_HUY;
  else if (tt === PENDING) tt = CHO_XAC_NHAN;
  else if (tt === CONFIRMED) tt = SAN_SANG;
  else if (tt === PROCESSING) tt = DANG_CHE_BIEN;
  else if (tt === DELIVERED) tt = HOAN_THANH;
  return { ...order, trangThai: tt };
};

export default function useDonHangModel() {
  const [orders, setOrders] = useState<DonTrucTiep[]>([]);

  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    if (!hasLoginToken()) {
      setOrders([]);
      setCancelledIds(new Set());
      return;
    }
    try {
      const res = await axios.get(`${ip3}/admin/orders`);
      if (res.data) {
        const mappedList = res.data.map(SyncAdapters.mapAdminOrderToUI);
        const localizedList = mappedList.map(localizeOrderStatus);
        
        setOrders(localizedList);
        
        const s = new Set<string>();
        localizedList.forEach((o: any) => {
          if (o.trangThai === DA_HUY) s.add(o.maDon);
        });
        setCancelledIds(s);
      }
    } catch (error) {
      console.error("Failed to load admin orders:", error);
    }
  }, []);

  useEffect(() => {
    if (!hasLoginToken()) return undefined;
    fetchOrders();
    // Khởi tạo interval polling 10s một lần (tuỳ chọn)
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);



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

  const moveStatus = useCallback(async (maDon: string, newStatus: string) => {
    let backendStatus = '';
    if (newStatus === DA_HUY) backendStatus = CANCELLED;
    else if (newStatus === CHO_XAC_NHAN) backendStatus = PENDING;
    else if (newStatus === SAN_SANG) backendStatus = CONFIRMED;
    else if (newStatus === DANG_CHE_BIEN) backendStatus = PROCESSING;
    else if (newStatus === HOAN_THANH) backendStatus = DELIVERED;
    
    if (backendStatus) {
       try {
         await axios.put(`${ip3}/admin/orders/${maDon}/status`, { trangThai: backendStatus });
       } catch (error) {
         console.error("Failed to update order status", error);
         throw error;
       }
    }

    if (newStatus === DA_HUY) setCancelledIds((p) => new Set([...p, maDon]));
    setOrders((p) =>
      p.map((o) => (o.maDon === maDon ? { ...o, trangThai: newStatus as any } : o)),
    );
  }, []);

  const bulkMoveStatus = useCallback(async (maDons: string[], newStatus: string) => {
    let backendStatus = '';
    if (newStatus === DA_HUY) backendStatus = CANCELLED;
    else if (newStatus === CHO_XAC_NHAN) backendStatus = PENDING;
    else if (newStatus === SAN_SANG) backendStatus = CONFIRMED;
    else if (newStatus === DANG_CHE_BIEN) backendStatus = PROCESSING;
    else if (newStatus === HOAN_THANH) backendStatus = DELIVERED;
    
    if (backendStatus) {
       try {
         await Promise.all(maDons.map(maDon => 
            axios.put(`${ip3}/admin/orders/${maDon}/status`, { trangThai: backendStatus })
         ));
       } catch (error) {
         console.error("Failed to update bulk orders status", error);
         throw error;
       }
    }

    if (newStatus === DA_HUY) setCancelledIds((p) => new Set([...p, ...maDons]));
    setOrders((p) =>
      p.map((o) => (maDons.includes(o.maDon) ? { ...o, trangThai: newStatus as any } : o)),
    );
  }, []);

  const confirmBankingPayment = useCallback(async (maDon: string) => {
    try {
      const res = await axios.put(`${ip3}/admin/orders/${maDon}/payment/confirm`);
      const updatedOrder = localizeOrderStatus(SyncAdapters.mapAdminOrderToUI(res.data));
      setOrders((prev) => prev.map((order) => (order.maDon === maDon ? updatedOrder : order)));
      return updatedOrder;
    } catch (error) {
      console.error("Failed to confirm order payment", error);
      throw error;
    }
  }, []);

  return {
    orders,
    setOrders,
    cancelledIds,
    stats,
    tabCounts,
    moveStatus,
    bulkMoveStatus,
    confirmBankingPayment,
    fetchOrders,
  };
}
