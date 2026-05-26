import React from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import styles from './index.less';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.layout}>
    <Sidebar />
    <div className={styles.mainContent}>
      {children}
    </div>
  </div>
);

export default AdminLayout;
