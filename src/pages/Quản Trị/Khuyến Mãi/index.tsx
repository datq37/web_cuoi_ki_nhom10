import {
  FilterOutlined,
  GiftOutlined,
  MoreOutlined,
  PercentageOutlined,
  PlusOutlined,
  RiseOutlined,
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Button, Input, Switch } from 'antd';
import React, { useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_KHUYEN_MAI,
  STAT_KHUYEN_MAI,
  TRANG_THAI_KM_CONFIG,
} from '@/services/Quản Trị/Khuyến Mãi';
import { IKhuyenMai } from '@/services/Quản Trị/Khuyến Mãi/typing';
import styles from './index.less';

const STAT_CARDS = [
  {
    label: 'ĐANG HOẠT ĐỘNG',
    value: String(STAT_KHUYEN_MAI.dangHoatDong),
    icon: TagOutlined,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    sub: null,
  },
  {
    label: 'LƯỢT SỬ DỤNG',
    value: String(STAT_KHUYEN_MAI.luotSuDung),
    icon: GiftOutlined,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    sub: '+18% so với tuần trước',
    subTrend: 'up',
  },
  {
    label: 'DOANH THU ĐƯỢC TẠO',
    value: STAT_KHUYEN_MAI.doanhThuTao,
    icon: RiseOutlined,
    iconBg: '#fed7aa',
    iconColor: '#ea580c',
    sub: '+8.4% so với tuần trước',
    subTrend: 'up',
  },
  {
    label: 'TỶ LỆ CHUYỂN ĐỔI',
    value: `${STAT_KHUYEN_MAI.tyLeChuyenDoi}%`,
    icon: PercentageOutlined,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    subBold: '3 mã sắp hết',
    subBoldColor: '#dc2626',
    subSuffix: 'so với tuần trước',
  },
];

const KhuyenMaiRow: React.FC<{ item: IKhuyenMai }> = ({ item }) => {
  const [active, setActive] = useState(item.hoatDong);
  const cfg = TRANG_THAI_KM_CONFIG[item.trangThai];
  const pct = Math.min(100, Math.round((item.daDung / item.gioiHan) * 100));

  return (
    <div className={styles.promoRow}>
      {/* Left: badges + info */}
      <div className={styles.promoLeft}>
        <div className={styles.promoBadges}>
          <span className={styles.promoCode}>{item.ma}</span>
          <span
            className={styles.promoStatus}
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
        </div>
        <div className={styles.promoName}>{item.ten}</div>
        <div className={styles.promoMoTa}>{item.moTa}</div>
      </div>

      {/* Center: usage progress */}
      <div className={styles.promoUsage}>
        <div className={styles.usageHeader}>
          <span className={styles.usageLabel}>Đã dùng</span>
          <span className={styles.usageCount}>
            {item.daDung} / {item.gioiHan}
          </span>
        </div>
        <div className={styles.usageBar}>
          <div
            className={styles.usageFill}
            style={{
              width: `${pct}%`,
              background: pct >= 90 ? '#ef4444' : '#22c55e',
            }}
          />
        </div>
      </div>

      {/* Right: expiry + toggle + more */}
      <div className={styles.promoRight}>
        <div className={styles.expiryWrap}>
          <span className={styles.expiryLabel}>Hết hạn</span>
          <span className={styles.expiryDate}>{item.hetHan}</span>
        </div>
        <Switch
          checked={active}
          onChange={setActive}
          className={active ? styles.switchOn : styles.switchOff}
        />
        <button className={styles.moreBtn}>
          <MoreOutlined />
        </button>
      </div>
    </div>
  );
};

const KhuyenMai: React.FC = () => {
  const [tuKhoa, setTuKhoa] = useState('');

  const danhSachLoc = useMemo(() => {
    if (!tuKhoa.trim()) return DANH_SACH_KHUYEN_MAI;
    const kw = tuKhoa.toLowerCase();
    return DANH_SACH_KHUYEN_MAI.filter(
      (k) =>
        k.ma.toLowerCase().includes(kw) ||
        k.ten.toLowerCase().includes(kw),
    );
  }, [tuKhoa]);

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Khuyến mãi" />

        <div className={styles.pageBody}>
          {/* ── Stat cards ── */}
          <div className={styles.statGrid}>
            {STAT_CARDS.map((card) => (
              <div key={card.label} className={styles.statCard}>
                <div className={styles.statLeft}>
                  <div className={styles.statLabel}>{card.label}</div>
                  <div className={styles.statValue}>{card.value}</div>
                  {card.sub && (
                    <div className={`${styles.statSub} ${card.subTrend === 'up' ? styles.subUp : ''}`}>
                      {card.subTrend === 'up' && '↗ '}{card.sub}
                    </div>
                  )}
                  {card.subBold && (
                    <div className={styles.statSubComplex}>
                      <span style={{ color: card.subBoldColor, fontWeight: 600 }}>
                        ↘ {card.subBold}
                      </span>{' '}
                      <span className={styles.statSubSuffix}>{card.subSuffix}</span>
                    </div>
                  )}
                </div>
                <div
                  className={styles.statIconWrap}
                  style={{ background: card.iconBg }}
                >
                  <card.icon style={{ fontSize: 20, color: card.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>
            <Input
              prefix={<SearchOutlined className={styles.searchIcon} />}
              placeholder="Tìm mã, tên chương trình..."
              className={styles.searchInput}
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
            />
            <Button icon={<FilterOutlined />} className={styles.btnFilter}>
              Lọc trạng thái
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.btnCreate}
            >
              Tạo khuyến mãi
            </Button>
          </div>

          {/* ── Promo list ── */}
          <div className={styles.promoList}>
            {danhSachLoc.map((item, idx) => (
              <React.Fragment key={item.id}>
                <KhuyenMaiRow item={item} />
                {idx < danhSachLoc.length - 1 && <div className={styles.divider} />}
              </React.Fragment>
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy khuyến mãi phù hợp</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhuyenMai;
