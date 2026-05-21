import React from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import TrucTiepView from '../Tổng Quan/components/TrucTiep';
import styles from './index.less';

const DonHang: React.FC = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Đơn hàng" />
        <div className={styles.pageBody}>
          <TrucTiepView />
        </div>
      </div>
    </div>
  );
};

export default DonHang;
