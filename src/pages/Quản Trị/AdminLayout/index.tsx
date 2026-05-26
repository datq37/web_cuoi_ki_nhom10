import React from 'react';
import { NotifProvider } from '@/context/NotifContext';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import styles from './index.less';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotifProvider>
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  </NotifProvider>
);

export default AdminLayout;
