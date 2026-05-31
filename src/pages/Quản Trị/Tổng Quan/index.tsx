import { CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('moment/locale/vi');
import Topbar from '@/pages/Quản Trị/Topbar';
import { ETabKey } from '@/services/Quản Trị/Tổng Quan/typing';
import BaoCaoModal from './components/BaoCao';
import TacNghiepView from './components/TacNghiep';
import PhanTichView  from './components/PhanTich';
import styles from './index.less';

moment.locale('vi');

const TongQuan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ETabKey>(ETabKey.TAC_NGHIEP);
  const [reportOpen, setReportOpen] = useState(false);

  const tabs: { key: ETabKey; label: string }[] = [
    { key: ETabKey.TAC_NGHIEP, label: 'Tác nghiệp' },
    { key: ETabKey.PHAN_TICH,  label: 'Phân tích' },
  ];

  return (
    <>
      <Topbar title="Tổng quan" />

      <div className={styles.pageBody}>
          {/* Hàng 1: Tabs */}
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

          {/* Hàng 2: Date + Export */}
          <div className={styles.pageHeader}>
            <span className={styles.dateChip}>
              <CalendarOutlined style={{ marginRight: 5, color: '#9ca3af' }} />
              Hôm nay · {moment().format('D/M/YYYY')}
            </span>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className={styles.exportBtn}
              onClick={() => setReportOpen(true)}
            >
              Xuất báo cáo
            </Button>
          </div>

          {activeTab === ETabKey.PHAN_TICH  && <PhanTichView />}
          {activeTab === ETabKey.TAC_NGHIEP && <TacNghiepView />}
      </div>

      <BaoCaoModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
};

export default TongQuan;
