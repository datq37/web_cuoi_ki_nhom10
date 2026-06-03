import { ArrowUpOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  buildBarLineOptions,
  buildDonutOptions,
  fmt,
  fmtShort,
} from '@/models/QuanTri/Tổng Quan';
import { mockData } from '@/services/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { KEYS, store } from '@/utils/storage';
import styles from './index.less';

const BannerIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, React.ReactNode> = {
    revenue: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H10.5a1.5 1.5 0 000 3H15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    order: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.8" />
        <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    customer: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    average: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke="white" strokeWidth="1.8" />
        <path d="M1 10h22" stroke="white" strokeWidth="1.8" />
      </svg>
    ),
  };
  return <div className={styles.bannerIconWrap}>{icons[type]}</div>;
};


type Range = 'week' | 'month' | 'quarter';

const RANGE_DATA: Record<Range, { labels: string[]; tuanNay: number[]; trungBinh: number[] }> = {
  week: {
    labels:    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    tuanNay:   [1800000, 2200000, 1950000, 2800000, 3200000, 2600000, 1400000],
    trungBinh: [2000000, 2100000, 2000000, 2100000, 2000000, 2100000, 1600000],
  },
  month: {
    labels:    ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    tuanNay:   [14500000, 16800000, 13200000, 17400000],
    trungBinh: [15000000, 15000000, 15000000, 15000000],
  },
  quarter: {
    labels:    ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
    tuanNay:   [42000000,38000000,55000000,61000000,49000000,52000000,68000000,71000000,58000000,63000000,74000000,82000000],
    trungBinh: [50000000,50000000,55000000,55000000,55000000,55000000,60000000,60000000,60000000,65000000,65000000,70000000],
  },
};

const RANGE_CFG: Record<Range, { label: string; title: string }> = {
  week:    { label: '1 tuần',  title: 'Doanh thu 7 ngày gần nhất' },
  month:   { label: '1 tháng', title: 'Doanh thu 4 tuần gần nhất' },
  quarter: { label: '1 quý',   title: 'Doanh thu 12 tháng gần nhất' },
};

const HEAT_HOURS = ['7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h'];
const HEAT_DAYS  = ['T2','T3','T4','T5','T6','T7','CN'];
const HEAT_VALS  = [
  [12, 28, 45, 62, 78, 85, 72, 38, 25, 18, 10,  5],
  [10, 25, 42, 58, 75, 82, 68, 35, 22, 15,  8,  3],
  [15, 30, 48, 65, 80, 85, 74, 40, 28, 20, 12,  6],
  [ 8, 22, 40, 55, 72, 78, 65, 32, 20, 14,  7,  2],
  [18, 35, 52, 70, 82, 85, 76, 45, 32, 24, 15,  8],
  [25, 45, 60, 70, 72, 68, 55, 42, 35, 28, 20, 12],
  [ 5, 12, 20, 28, 35, 40, 38, 25, 15,  8,  4,  2],
];
const HEAT_MAX = 85;

const CssHeatmap: React.FC = () => {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState<{
    day: string; hour: string; val: number; top: number; left: number;
  } | null>(null);

  const handleEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: string,
    hour: string,
    val: number,
  ) => {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const cell = e.currentTarget.getBoundingClientRect();
    if (!wrap) return;
    setTooltip({
      day, hour, val,
      top:  cell.top  - wrap.top  - 52,
      left: cell.left - wrap.left + cell.width / 2,
    });
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {tooltip && (
        <div className={styles.heatTooltip} style={{ top: tooltip.top, left: tooltip.left }}>
          <div className={styles.heatTooltipHead}>{tooltip.day} · {tooltip.hour}</div>
          <div className={styles.heatTooltipVal}>{tooltip.val} đơn</div>
        </div>
      )}
      <div className={styles.heatGrid}>
        <div className={styles.heatEmpty} />
        {HEAT_HOURS.map((h) => (
          <div key={h} className={styles.heatHourLabel}>{h}</div>
        ))}
        {HEAT_DAYS.map((day, di) => (
          <React.Fragment key={day}>
            <div className={styles.heatDayLabel}>{day}</div>
            {HEAT_VALS[di].map((val, hi) => {
              const pct = Math.round((val / HEAT_MAX) * 100);
              return (
                <div
                  key={hi}
                  className={styles.heatCell}
                  style={{ background: `color-mix(in oklab, var(--accent-primary, #16a34a) ${pct}%, var(--surface-sunken, #f3f4f6))` } as React.CSSProperties}
                  onMouseEnter={(e) => handleEnter(e, day, HEAT_HOURS[hi], val)}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface PhanTichProps {
  orders: any[];
}

const PhanTichView: React.FC<PhanTichProps> = ({ orders }) => {
  const [range, setRange] = useState<Range>('week');
  const { danhMuc, tongDanhMuc } = mockData.phanTich;

  // ── Banner dùng data thật ─────────────────────────
  const realBanners = useMemo(() => {
    const cancelledSet = new Set<string>();
    orders.forEach((o) => { if (o.trangthai === 'da_huy' || o.trangThai === 'da_huy') cancelledSet.add(o.maDon || o._id); });
    const active  = orders.filter((o) => !cancelledSet.has(o.maDon || o._id));
    const done    = active.filter((o) => o.trangthai === ETrangThaiTrucTiep.HOAN_THANH || o.trangThai === ETrangThaiTrucTiep.HOAN_THANH);
    const revenue = done.reduce((s, o) => s + (o.tongtien || o.tongTien), 0);
    const uniqueKH = new Set(active.map((o) => o.khachhang?.tenkhachhang || o.khachHang?.ten || 'Vãng lai')).size;
    const avgPerOrder = done.length > 0 ? Math.round(revenue / done.length) : 0;

    return [
      { id: 'revenue',  label: 'DOANH THU HÔM NAY', value: fmt(revenue),       change: `${done.length} đơn hoàn thành`,  icon: 'revenue'  },
      { id: 'order',    label: 'TỔNG ĐƠN HÔM NAY',  value: String(active.length), change: `${cancelledSet.size} đơn đã huỷ`, icon: 'order'    },
      { id: 'customer', label: 'KHÁCH ĐÃ ĐẶT',       value: String(uniqueKH),      change: 'Khách duy nhất hôm nay',          icon: 'customer' },
      { id: 'average',  label: 'TRUNG BÌNH / ĐƠN',   value: fmt(avgPerOrder),      change: 'Tính từ đơn hoàn thành',          icon: 'average'  },
    ];
  }, [orders]);

  // ── Data thật ─────────────────────────────────────
  const realOrders = orders;

  const realCancelledIds = useMemo(() => {
    const s = new Set<string>();
    realOrders.forEach((o) => { if (o.trangthai === 'da_huy' || o.trangThai === 'da_huy') s.add(o.maDon || o._id); });
    return s;
  }, [realOrders]);

  const realActive   = realOrders.filter((o) => !realCancelledIds.has(o.maDon || o._id));
  const realDone     = realActive.filter((o) => o.trangthai === ETrangThaiTrucTiep.HOAN_THANH || o.trangThai === ETrangThaiTrucTiep.HOAN_THANH);
  const realWaiting  = realActive.filter((o) => o.trangthai === ETrangThaiTrucTiep.CHO_XAC_NHAN || o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN);
  const realCooking  = realActive.filter((o) => o.trangthai === ETrangThaiTrucTiep.DANG_CHE_BIEN || o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN);
  const realReady    = realActive.filter((o) => o.trangthai === ETrangThaiTrucTiep.SAN_SANG || o.trangThai === ETrangThaiTrucTiep.SAN_SANG);
  const total        = realOrders.length;

  // Top món bán chạy từ data thật
  const realTopMon = useMemo(() => {
    const counter: Record<string, number> = {};
    realDone.forEach((o) => {
      const dsMon = o.monan || o.monAn || [];
      dsMon.forEach((m: any) => { 
        const tenMon = m.ten || m.tenmon;
        counter[tenMon] = (counter[tenMon] ?? 0) + (m.soLuong || m.soluong); 
      });
    });
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ten, soLuong], idx) => ({ rank: idx + 1, ten, soLuong }));
  }, [realDone]);

  // Đơn theo trạng thái từ data thật
  const realDonTheoTrangThai = useMemo(() => {
    const items = [
      { ten: 'Hoàn thành',    mau: '#16a34a', so: realDone.length },
      { ten: 'Đang chế biến', mau: '#2563eb', so: realCooking.length },
      { ten: 'Sẵn sàng',      mau: '#7c3aed', so: realReady.length },
      { ten: 'Chờ xác nhận',  mau: '#ea580c', so: realWaiting.length },
      { ten: 'Đã huỷ',        mau: '#9ca3af', so: realCancelledIds.size },
    ];
    return items.map((t) => ({
      ...t,
      tyLe: total > 0 ? Math.round((t.so / total) * 100) : 0,
    }));
  }, [realDone, realCooking, realReady, realWaiting, realCancelledIds, total]);

  // 5 đơn hoàn thành gần nhất
  const recentDone = useMemo(() =>
    [...realDone].reverse().slice(0, 5),
  [realDone]);

  const rd = RANGE_DATA[range];
  const barOptions = useMemo(() => buildBarLineOptions(rd.labels), [rd]);
  const barSeries = useMemo(() => [
    { name: 'Doanh thu', type: 'bar',  data: rd.tuanNay },
    { name: 'Trung bình', type: 'line', data: rd.trungBinh },
  ], [rd]);
  const donutOptions = useMemo(
    () => buildDonutOptions(danhMuc.map((d) => d.ten), danhMuc.map((d) => d.mau), tongDanhMuc),
    [danhMuc, tongDanhMuc],
  );
  const donutSeries = danhMuc.map((d) => d.tyLe);

  return (
    <div className={styles.phanTichWrap}>
      {/* ── Banner thống kê — data thật từ localStorage ── */}
      <div className={styles.statBanner}>
        {realBanners.map((b, i) => (
          <React.Fragment key={b.id}>
            {i > 0 && <div className={styles.bannerDiv} />}
            <div className={styles.bannerItem}>
              <div className={styles.bannerTop}>
                <div>
                  <div className={styles.bannerLabel}>{b.label}</div>
                  <div className={styles.bannerValue}>{b.value}</div>
                  <div className={styles.bannerChange}>
                    <ArrowUpOutlined style={{ fontSize: 10, marginRight: 3 }} />
                    {b.change}
                  </div>
                </div>
                <BannerIcon type={b.icon} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── Biểu đồ — dữ liệu mô phỏng ── */}
      <div className={styles.chartRow2}>
        <div className={styles.barChartCard}>
          <div className={styles.chartHeader2}>
            <div>
              <span className={styles.chartTitle2}>{RANGE_CFG[range].title}</span>
              <span className={styles.mockNote}>· Dữ liệu mô phỏng</span>
            </div>
            <div className={styles.rangeToggle}>
              {(['week', 'month', 'quarter'] as Range[]).map((r) => (
                <button
                  key={r}
                  className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ''}`}
                  onClick={() => setRange(r)}
                >
                  {RANGE_CFG[r].label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.chartLegend} style={{ marginBottom: 4 }}>
            <span className={styles.legendBox} style={{ background: '#16a34a' }} />
            <span>Doanh thu</span>
            <span className={styles.legendDash} />
            <span>Trung bình</span>
          </div>
          <ReactApexChart options={barOptions} series={barSeries} type="bar" height={220} />
        </div>
        <div className={styles.donutCard}>
          <div className={styles.chartTitle2}>Theo danh mục</div>
          <div className={styles.donutSubtitle}>Tỷ lệ doanh thu hôm nay</div>
          <div className={styles.donutWrap2}>
            <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={180} />
            <div className={styles.donutLeg}>
              {danhMuc.map((d) => (
                <div key={d.ten} className={styles.donutLegRow}>
                  <span className={styles.donutLegDot} style={{ background: d.mau }} />
                  <span className={styles.donutLegLabel}>{d.ten}</span>
                  <span className={styles.donutLegPct}>{d.tyLe}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom 3 cột ── */}
      <div className={styles.bottomRow}>

        {/* Top món bán chạy — data thật */}
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Top món hôm nay</span>
            <span className={styles.realDataBadge}>Data thật</span>
          </div>
          {realTopMon.length === 0 ? (
            <div style={{ fontSize: 13, color: '#9ca3af', padding: '12px 0' }}>
              Chưa có đơn hoàn thành hôm nay
            </div>
          ) : (
            <table className={styles.topMonTable}>
              <thead>
                <tr>
                  <th>MÓN ĂN</th>
                  <th>ĐÃ BÁN</th>
                </tr>
              </thead>
              <tbody>
                {realTopMon.map((m) => (
                  <tr key={m.ten}>
                    <td>
                      <div className={styles.topMonCell}>
                        <span className={styles.rankNum}>{m.rank}</span>
                        <span>{m.ten}</span>
                      </div>
                    </td>
                    <td className={styles.tdCenter} style={{ fontWeight: 700, color: '#16a34a' }}>
                      ×{m.soLuong}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Đơn theo trạng thái — data thật */}
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Phân bổ đơn hàng</span>
            <span className={styles.realDataBadge}>Data thật</span>
          </div>
          <div className={styles.trangThaiList}>
            {realDonTheoTrangThai.map((t) => (
              <div key={t.ten} className={styles.trangThaiRow}>
                <div className={styles.trangThaiLeft}>
                  <span className={styles.trangThaiDot} style={{ background: t.mau }} />
                  <span className={styles.trangThaiTen}>{t.ten}</span>
                </div>
                <span className={styles.trangThaiSo}>{t.so} đơn</span>
                <div className={styles.progressWrap2}>
                  <div className={styles.progressBar} style={{ width: `${t.tyLe}%`, background: t.mau }} />
                </div>
                <span className={styles.trangThaiPct}>{t.tyLe}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap giờ cao điểm */}
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Giờ cao điểm trong tuần</span>
            <span className={styles.mockNote}>Mô phỏng</span>
          </div>
          <div className={styles.heatLegend}>
            <span className={styles.heatLegendLabel}>Ít đơn</span>
            <div className={styles.heatLegendBar}>
              {[10, 30, 50, 70, 90].map((p) => (
                <div key={p} className={styles.heatLegendCell}
                  style={{ background: `color-mix(in oklab, var(--accent-primary, #16a34a) ${p}%, var(--surface-sunken, #f3f4f6))` } as React.CSSProperties}
                />
              ))}
            </div>
            <span className={styles.heatLegendLabel}>Nhiều đơn</span>
          </div>
          <CssHeatmap />
        </div>
      </div>

      {/* ── Bảng chi tiết đơn hoàn thành hôm nay ── */}
      <div className={styles.bottomCard} style={{ marginTop: 0 }}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>Đơn hoàn thành gần nhất</span>
          <span className={styles.realDataBadge}>Data thật</span>
        </div>
        {recentDone.length === 0 ? (
          <div style={{ fontSize: 13, color: '#9ca3af', padding: '12px 0' }}>
            Chưa có đơn hoàn thành hôm nay
          </div>
        ) : (
          <table className={styles.topMonTable}>
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>MÓN ĂN</th>
                <th>GIỜ</th>
                <th style={{ textAlign: 'right' }}>TỔNG TIỀN</th>
              </tr>
            </thead>
            <tbody>
              {recentDone.map((o) => {
                const dsMon = o.monan || o.monAn || [];
                const khTen = o.khachhang?.tenkhachhang || o.khachHang?.ten || '';
                return (
                  <tr key={o.maDon || o._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{o.maDon || o._id}</td>
                    <td style={{ fontWeight: 500 }}>{khTen}</td>
                    <td style={{ color: '#6b7280', fontSize: 12 }}>
                      {dsMon.map((m: any) => `${m.ten || m.tenmon} ×${m.soLuong || m.soluong}`).join(', ')}
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: 12 }}>{o.thoigiandat || o.thoiGian}</td>
                    <td className={styles.tdRight} style={{ color: '#16a34a' }}>{fmt(o.tongtien || o.tongTien)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default PhanTichView;
