import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import React from 'react';
import {
  COT_CONFIG,
  GHI_CHU_CONFIG,
  filterDon,
  fmt,
  tongTienCot,
} from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import type { DonTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import styles from './index.less';

// ── Ghi chú badge ───────────────────────────────────────────
const GhiChuBadge: React.FC<{ type: keyof typeof GHI_CHU_CONFIG }> = ({ type }) => {
  const cfg = GHI_CHU_CONFIG[type];
  return (
    <div className={styles.ghiChu} style={{ color: cfg.mau, background: cfg.bg }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      {cfg.label}
    </div>
  );
};

// ── Thẻ đơn hàng ────────────────────────────────────────────
const DonCard: React.FC<{ don: DonTrucTiep; trangThai: ETrangThaiTrucTiep }> = ({ don, trangThai }) => {
  const cfg    = COT_CONFIG[trangThai];
  const hienMon = don.monAn.slice(0, 2);
  const conLai  = don.monAn.length - 2;

  return (
    <div className={styles.donCard}>
      <div className={styles.donCardHeader}>
        <span className={styles.maDon}>{don.maDon}</span>
        <span className={styles.thoiGianDon}>{don.thoiGian}</span>
      </div>
      <div className={styles.khachRow}>
        <div className={styles.avatarCir} style={{ background: don.khachHang.mauNen, color: don.khachHang.mauChu }}>
          {don.khachHang.vietTat}
        </div>
        <span className={styles.tenKH}>{don.khachHang.ten}</span>
      </div>
      <div className={styles.monList}>
        {hienMon.map((m, i) => (
          <div key={i} className={styles.monRow}>
            <span>• {m.ten}</span>
            <span className={styles.slMon}>x{m.soLuong}</span>
          </div>
        ))}
        {conLai > 0 && <div className={styles.conLai}>+{conLai} món khác</div>}
      </div>
      {don.loaiGhiChu && <GhiChuBadge type={don.loaiGhiChu} />}
      <div className={styles.donCardFooter}>
        <span className={styles.tongTienDon}>{fmt(don.tongTien)}</span>
        {trangThai === ETrangThaiTrucTiep.HOAN_THANH ? (
          <CheckCircleOutlined style={{ fontSize: 20, color: '#16a34a' }} />
        ) : (
          <button className={styles.actionBtn} style={{ background: cfg.actionColor, color: '#fff' }}>
            {trangThai === ETrangThaiTrucTiep.SAN_SANG && <CheckCircleOutlined style={{ marginRight: 4 }} />}
            {cfg.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Cột Kanban ──────────────────────────────────────────────
const KanbanCot: React.FC<{ trangThai: ETrangThaiTrucTiep; dons: DonTrucTiep[] }> = ({ trangThai, dons }) => {
  const cfg      = COT_CONFIG[trangThai];
  const tongTien = tongTienCot(dons);

  return (
    <div className={styles.kanbanCot}>
      <div className={styles.cotHeader}>
        <div className={styles.cotTitleRow}>
          <span className={styles.cotDot} style={{ background: cfg.mau }} />
          <span className={styles.cotTitle}>{cfg.tieuDe}</span>
          <span className={styles.cotBadge} style={{ color: cfg.mau, background: cfg.bgLight }}>
            {dons.length}
          </span>
        </div>
      </div>

      <div className={styles.cotBody}>
        {dons.map((d) => (
          <DonCard key={d.maDon} don={d} trangThai={trangThai} />
        ))}

        {trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN && dons.length === 1 && (
          <div className={styles.emptyHint}>
            <div className={styles.emptyIllus}>
              <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
                <ellipse cx="28" cy="38" rx="20" ry="5" fill="#fde68a" opacity="0.4" />
                <path d="M10 32c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#fcd34d" strokeWidth="2" fill="none" />
                <circle cx="28" cy="20" r="6" fill="#fbbf24" />
                <rect x="18" y="30" width="20" height="4" rx="2" fill="#f59e0b" />
                <circle cx="28" cy="34" r="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
              </svg>
            </div>
            <p className={styles.emptyText}>Đơn mới sẽ hiển thị tại đây</p>
          </div>
        )}

        {trangThai === ETrangThaiTrucTiep.HOAN_THANH && (
          <div className={styles.trophyCard}>
            <TrophyOutlined style={{ fontSize: 24, color: '#16a34a', marginBottom: 6 }} />
            <div className={styles.trophyLabel}>Tổng hoàn thành hôm nay</div>
            <div className={styles.trophyValue}>4 đơn · 276.000đ</div>
          </div>
        )}
      </div>

      {(trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN || trangThai === ETrangThaiTrucTiep.SAN_SANG) && dons.length > 0 && (
        <div className={styles.cotFooter}>
          Tổng {dons.length} đơn · {fmt(tongTien)}
        </div>
      )}
    </div>
  );
};

// ── TrucTiepView ────────────────────────────────────────────
const TrucTiepView: React.FC = () => {
  const { thongKe, donHang, tomTat } = mockData.trucTiep;
  const cols: ETrangThaiTrucTiep[] = [
    ETrangThaiTrucTiep.CHO_XAC_NHAN,
    ETrangThaiTrucTiep.DANG_CHE_BIEN,
    ETrangThaiTrucTiep.SAN_SANG,
    ETrangThaiTrucTiep.HOAN_THANH,
  ];

  return (
    <div className={styles.trucTiepWrap}>
      <div className={styles.liveBar}>
        <div className={styles.liveLeft}>
          <span className={styles.liveDot} />
          <strong className={styles.liveTxt}>LIVE</strong>
          <span className={styles.liveDesc}>Hệ thống đang cập nhật</span>
        </div>
        <div className={styles.liveStats}>
          <div className={styles.liveStat}>
            <span className={styles.liveStatIcon} style={{ background: '#fff7ed', color: '#f97316' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <strong>{thongKe.donCho}</strong>
            <span>đơn chờ</span>
          </div>
          <div className={styles.liveStatDiv} />
          <div className={styles.liveStat}>
            <span className={styles.liveStatIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M3 10h18M3 14h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <strong>{thongKe.dangCheBien}</strong>
            <span>đang chế biến</span>
          </div>
          <div className={styles.liveStatDiv} />
          <div className={styles.liveStat}>
            <span className={styles.liveStatIcon} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h6m-3-3v6M9 17h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <strong>{thongKe.sanSangGiao}</strong>
            <span>sẵn sàng giao</span>
          </div>
          <div className={styles.liveStatDiv} />
          <div className={styles.liveStat}>
            <span className={styles.liveStatIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 10, color: '#9ca3af' }}>Thời gian TB</div>
              <strong style={{ fontSize: 14 }}>{thongKe.thoiGianTB} phút</strong>
            </div>
          </div>
        </div>
        <button className={styles.autoBtn}>
          <ReloadOutlined style={{ marginRight: 5 }} />
          Tự động (10s)
        </button>
      </div>
      <div className={styles.kanbanBoard}>
        {cols.map((col) => (
          <KanbanCot key={col} trangThai={col} dons={filterDon(donHang, col)} />
        ))}
      </div>
      <div className={styles.summaryBar}>
        <div className={styles.summaryLeft}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
            <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="9" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
            <circle cx="20" cy="16" r="1" fill="currentColor" />
          </svg>
          <span className={styles.summaryTitle}>Tổng quan hôm nay</span>
        </div>
        <div className={styles.summaryDiv} />
        <div className={styles.summaryStat}>
          <strong>{tomTat.tongDon}</strong>
          <span>Tổng đơn hàng</span>
        </div>
        <div className={styles.summaryDiv} />
        <div className={styles.summaryStat}>
          <strong>{tomTat.khachHang}</strong>
          <span>Khách hàng</span>
        </div>
        <div className={styles.summaryDiv} />
        <div className={styles.summaryStat}>
          <strong style={{ color: '#16a34a' }}>{fmt(tomTat.doanhThu)}</strong>
          <span>Doanh thu</span>
        </div>
        <div className={styles.summaryDiv} />
        <div className={styles.summaryStat}>
          <strong>{tomTat.thoiGianTB} phút</strong>
          <span>Thời gian TB</span>
        </div>
        <a href="#" className={styles.summaryLink}>
          Xem chi tiết <ArrowRightOutlined style={{ fontSize: 11 }} />
        </a>
      </div>
    </div>
  );
};

export default TrucTiepView;
