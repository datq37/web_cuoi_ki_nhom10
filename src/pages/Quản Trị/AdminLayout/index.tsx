import React, { useEffect } from 'react';
import { NotifProvider } from '@/context/NotifContext';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
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
  return (
    <NotifProvider>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainContent}>
          {children}
        </div>
      </div>
    </NotifProvider>
  );
};

export default AdminLayout;
