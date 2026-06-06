import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { NotifProvider, useNotif } from '@/context/NotifContext';
import Sidebar from '@/pages/QuanTri/Sidebar';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { KEYS, store } from '@/utils/storage';
import styles from './index.less';

// Đặt token mặc định nếu chưa có (để không bị chặn trong dev)
// Khi tích hợp auth thật: xoá dòng này và bật guard bên dưới
if (!store.get<string | null>(KEYS.token, null)) {
  store.set(KEYS.token, 'authenticated');
  store.set(KEYS.user, { ten: 'Quản trị viên', email: 'admin@canteen.vn' });
}

function useDocumentTitle() {
  useEffect(() => {
    const update = () => {
      const orders = store.get<any[]>(KEYS.orders, []);
      const pending = orders.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN).length;
      document.title = pending > 0
        ? `(${pending}) Đơn chờ · Admin Căng tin`
        : 'Admin Căng tin';
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);
}

const AdminOrderNotifier: React.FC = () => {
  const { addNotif } = useNotif();
  const { orders = [] } = useModel('QuanTri.Đơn Hàng.index') || {};
  const seenOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!orders.length) return;

    const seen = seenOrderIdsRef.current;
    orders.forEach((order: DonTrucTiep) => {
      if (seen.has(order.maDon)) return;
      seen.add(order.maDon);

      if (order.trangThai !== ETrangThaiTrucTiep.CHO_XAC_NHAN) return;

      const isBankingPending = order.thanhToan?.method === 'banking' && order.thanhToan?.status !== 'paid';
      const itemText = order.monAn
        .slice(0, 2)
        .map((item) => `${item.ten} x${item.soLuong}`)
        .join(', ');

      addNotif({
        id: `order_waiting_${order.maDon}`,
        icon: isBankingPending ? '🏦' : '🛒',
        title: isBankingPending
          ? `Đơn ${order.maDon} chờ xác nhận CK`
          : `Đơn ${order.maDon} chờ xác nhận`,
        desc: `${order.khachHang.ten} đặt ${itemText || `${order.monAn.length} món`}`,
        type: 'order_pending',
      });
    });
  }, [orders, addNotif]);

  return null;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDocumentTitle();
  const [expanded, setExpanded] = useState(false);
  return (
    <NotifProvider>
      <AdminOrderNotifier />
      <div className={styles.layout}>
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div className={`${styles.mainContent} ${expanded ? styles.mainExpanded : ''}`}>
          {children}
        </div>
      </div>
    </NotifProvider>
  );
};

export default AdminLayout;
