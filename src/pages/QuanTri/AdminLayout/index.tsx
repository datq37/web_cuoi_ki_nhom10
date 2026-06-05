import React, { useEffect, useState } from 'react';
import { NotifProvider } from '@/context/NotifContext';
import Sidebar from '@/pages/QuanTri/Sidebar';
import { mockData } from '@/services/QuanTri/Tổng Quan';
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
      const orders = store.get<typeof mockData.trucTiep.donHang>(KEYS.orders, []);
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

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDocumentTitle();
  const [expanded, setExpanded] = useState(false);
  return (
    <NotifProvider>
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
