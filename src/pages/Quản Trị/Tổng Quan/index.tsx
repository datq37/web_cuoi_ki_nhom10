import { CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('moment/locale/vi');
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import { ETabKey } from '@/services/Quản Trị/Tổng Quan/typing';
import TacNghiepView from './components/TacNghiep';
import TrucTiepView  from './components/TrucTiep';
import PhanTichView  from './components/PhanTich';
import styles from './index.less';

moment.locale('vi');

const TongQuan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ETabKey>(ETabKey.PHAN_TICH);

  const tabs: { key: ETabKey; label: string }[] = [
    { key: ETabKey.TAC_NGHIEP, label: 'Tác nghiệp' },
    { key: ETabKey.PHAN_TICH,  label: 'Phân tích' },
    { key: ETabKey.TRUC_TIEP,  label: 'Trực tiếp' },
  ];

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Tổng quan" />

        <div className={styles.pageBody}>
          {/* ── Header: tabs + date + export ── */}
          <div className={styles.pageHeader}>
            <div className={styles.tabsRow}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.headerRight}>
              <span className={styles.dateChip}>
                <CalendarOutlined style={{ marginRight: 5, color: '#9ca3af' }} />
                Hôm nay · {moment().format('D/M/YYYY')}
              </span>
              <Button type="primary" icon={<DownloadOutlined />} className={styles.exportBtn}>
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* ── Content ── */}
          {activeTab === ETabKey.TRUC_TIEP  && <TrucTiepView />}
          {activeTab === ETabKey.PHAN_TICH  && <PhanTichView />}
          {activeTab === ETabKey.TAC_NGHIEP && <TacNghiepView />}
        </div>
      </div>
    </div>
  );
};

export default TongQuan;
