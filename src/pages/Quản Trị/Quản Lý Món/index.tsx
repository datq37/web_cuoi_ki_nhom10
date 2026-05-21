import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FireOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import { DANH_SACH_MON, SO_LUONG_THEO_DANH_MUC } from '@/services/Quản Trị/Quản Lý Món';
import { EDanhMuc, IMonAn } from '@/services/Quản Trị/Quản Lý Món/typing';
import styles from './index.less';

interface TabDanhMuc {
  key: EDanhMuc | 'tat_ca';
  label: string;
  soLuong: number;
}

const TABS: TabDanhMuc[] = [
  { key: 'tat_ca',            label: 'Tất cả',    soLuong: SO_LUONG_THEO_DANH_MUC.tat_ca   },
  { key: EDanhMuc.MON_CHINH,  label: 'Món chính', soLuong: SO_LUONG_THEO_DANH_MUC.mon_chinh },
  { key: EDanhMuc.DO_UONG,    label: 'Đồ uống',   soLuong: SO_LUONG_THEO_DANH_MUC.do_uong  },
  { key: EDanhMuc.AN_VAT,     label: 'Ăn vặt',    soLuong: SO_LUONG_THEO_DANH_MUC.an_vat   },
  { key: EDanhMuc.MON_CHAY,   label: 'Món chay',  soLuong: SO_LUONG_THEO_DANH_MUC.mon_chay },
];

function formatGia(gia: number): string {
  return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
}

const MonCard: React.FC<{ mon: IMonAn }> = ({ mon }) => (
  <div className={styles.monCard}>
    <div className={styles.cardImage} style={{ background: mon.mauNen }}>
      <span className={styles.cardEmoji}>{mon.emoji}</span>
      {mon.isHot && (
        <span className={styles.hotBadge}>
          <FireOutlined style={{ marginRight: 3 }} />HOT
        </span>
      )}
    </div>

    <div className={styles.cardBody}>
      <div className={styles.cardName}>{mon.ten}</div>
      <div className={styles.cardMoTa}>{mon.moTa}</div>

      <div className={styles.cardStats}>
        <span className={styles.statItem}>
          <ClockCircleOutlined className={styles.statIcon} />
          {mon.thoiGian} phút
        </span>
        <span className={styles.statItem}>
          🔥 {mon.calo} kcal
        </span>
        <span className={styles.statItem}>
          <StarFilled className={styles.starIcon} />
          {mon.danhGia}
        </span>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardGia}>{formatGia(mon.giaBan)}</span>
        <div className={styles.cardActions}>
          <button className={styles.actionBtn} title="Chỉnh sửa">
            <EditOutlined />
          </button>
          <button className={`${styles.actionBtn} ${styles.actionDelete}`} title="Xóa">
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const QuanLyMon: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EDanhMuc | 'tat_ca'>('tat_ca');
  const [tuKhoa, setTuKhoa] = useState('');
  const [isGrid, setIsGrid] = useState(true);

  const danhSachLoc = useMemo(() => {
    let ds = DANH_SACH_MON;
    if (activeTab !== 'tat_ca') {
      ds = ds.filter((m) => m.danhMuc === activeTab);
    }
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      ds = ds.filter(
        (m) => m.ten.toLowerCase().includes(kw) || m.moTa.toLowerCase().includes(kw),
      );
    }
    return ds;
  }, [activeTab, tuKhoa]);

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Quản lý món ăn" />

        <div className={styles.pageBody}>
          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>
            <div className={styles.tabsRow}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  <span className={styles.tabCount}>{t.soLuong}</span>
                </button>
              ))}
            </div>

            <div className={styles.toolbarRight}>
              <Input
                prefix={<SearchOutlined className={styles.searchIcon} />}
                placeholder="Tìm kiếm món ăn..."
                className={styles.searchInput}
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
              />
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleBtn} ${isGrid ? styles.toggleActive : ''}`}
                  onClick={() => setIsGrid(true)}
                  title="Dạng lưới"
                >
                  <AppstoreOutlined />
                </button>
                <button
                  className={`${styles.toggleBtn} ${!isGrid ? styles.toggleActive : ''}`}
                  onClick={() => setIsGrid(false)}
                  title="Dạng danh sách"
                >
                  <UnorderedListOutlined />
                </button>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addBtn}
              >
                Thêm món mới
              </Button>
            </div>
          </div>

          {/* ── Grid ── */}
          <div className={isGrid ? styles.gridView : styles.listView}>
            {danhSachLoc.map((mon) => (
              <MonCard key={mon.id} mon={mon} />
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy món ăn phù hợp</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuanLyMon;
