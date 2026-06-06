import { ArrowUpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  buildBarLineOptions,
  buildDonutOptions,
  fmt,
} from '@/models/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
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

const RANGE_CFG: Record<Range, { label: string; title: string }> = {
  week:    { label: '1 tuần',  title: 'Doanh thu 7 ngày gần nhất' },
  month:   { label: '1 tháng', title: 'Doanh thu 4 tuần gần nhất' },
  quarter: { label: '1 quý',   title: 'Doanh thu 12 tháng gần nhất' },
};

const HEAT_HOURS = ['7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h'];
const HEAT_DAYS  = ['T2','T3','T4','T5','T6','T7','CN'];

const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#7c3aed', '#0891b2', '#d97706'];

const getStatus = (order: any) => order.trangThai || order.trangthai;
const getOrderId = (order: any) => order.maDon || order._id || order.id;
const getAmount = (order: any) => Number(order.tongTien ?? order.tongtien ?? 0);
const getItems = (order: any) => order.monAn || order.monan || [];
const getQty = (item: any) => Number(item.soLuong ?? item.soluong ?? 0);
const getItemName = (item: any) => item.ten || item.tenmon || item.name || 'Món chưa tên';
const getOrderDate = (order: any) => {
  const value = order.thoiGianDat || order.thoigiandat || order.createdAt || order.thoiGian;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : undefined;
};

const buildRangeRevenue = (orders: any[], range: Range) => {
  const now = dayjs();
  const labels: string[] = [];
  const keys: string[] = [];
  const revenueByKey: Record<string, number> = {};

  if (range === 'week') {
    for (let i = 6; i >= 0; i -= 1) {
      const d = now.subtract(i, 'day');
      labels.push(['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.day()]);
      keys.push(d.format('YYYY-MM-DD'));
    }
    orders.forEach((o) => {
      const d = getOrderDate(o);
      if (!d) return;
      const key = d.format('YYYY-MM-DD');
      if (keys.includes(key)) revenueByKey[key] = (revenueByKey[key] ?? 0) + getAmount(o);
    });
  } else if (range === 'month') {
    for (let i = 3; i >= 0; i -= 1) {
      const end = now.subtract(i * 7, 'day').endOf('day');
      const start = end.subtract(6, 'day').startOf('day');
      const key = `${start.format('YYYY-MM-DD')}_${end.format('YYYY-MM-DD')}`;
      labels.push(`Tuần ${4 - i}`);
      keys.push(key);
    }
    orders.forEach((o) => {
      const d = getOrderDate(o);
      if (!d) return;
      keys.forEach((key) => {
        const [start, end] = key.split('_');
        if (d.isAfter(dayjs(start).subtract(1, 'millisecond')) && d.isBefore(dayjs(end).add(1, 'day'))) {
          revenueByKey[key] = (revenueByKey[key] ?? 0) + getAmount(o);
        }
      });
    });
  } else {
    for (let i = 11; i >= 0; i -= 1) {
      const d = now.subtract(i, 'month');
      labels.push(`T${d.month() + 1}`);
      keys.push(d.format('YYYY-MM'));
    }
    orders.forEach((o) => {
      const d = getOrderDate(o);
      if (!d) return;
      const key = d.format('YYYY-MM');
      if (keys.includes(key)) revenueByKey[key] = (revenueByKey[key] ?? 0) + getAmount(o);
    });
  }

  const tuanNay = keys.map((key) => revenueByKey[key] ?? 0);
  const average = tuanNay.length > 0 ? Math.round(tuanNay.reduce((sum, value) => sum + value, 0) / tuanNay.length) : 0;
  return { labels, tuanNay, trungBinh: tuanNay.map(() => average) };
};

const buildHeatValues = (orders: any[]) => {
  const values = HEAT_DAYS.map(() => HEAT_HOURS.map(() => 0));
  const start = dayjs().subtract(6, 'day').startOf('day');
  const end = dayjs().endOf('day');

  orders.forEach((o) => {
    const d = getOrderDate(o);
    if (!d || d.isBefore(start) || d.isAfter(end)) return;
    const dayIdx = d.day() === 0 ? 6 : d.day() - 1;
    const hourIdx = HEAT_HOURS.indexOf(`${d.hour()}h`);
    if (dayIdx >= 0 && hourIdx >= 0) values[dayIdx][hourIdx] += 1;
  });

  return values;
};

const CssHeatmap: React.FC<{ values: number[][] }> = ({ values }) => {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState<{
    day: string; hour: string; val: number; top: number; left: number;
  } | null>(null);
  const heatMax = Math.max(1, ...values.flat());

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
            {values[di].map((val, hi) => {
              const pct = Math.round((val / heatMax) * 100);
              return (
                <div
                  key={`${day}-${HEAT_HOURS[hi]}`}
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

  // ── Banner dùng data thật ─────────────────────────
  const realBanners = useMemo(() => {
    const cancelledSet = new Set<string>();
    orders.forEach((o) => { if (getStatus(o) === 'da_huy') cancelledSet.add(getOrderId(o)); });
    const today = dayjs();
    const active  = orders.filter((o) => !cancelledSet.has(getOrderId(o)));
    const todayOrders = active.filter((o) => getOrderDate(o)?.isSame(today, 'day'));
    const cancelledToday = orders.filter((o) => getStatus(o) === 'da_huy' && getOrderDate(o)?.isSame(today, 'day')).length;
    const done    = todayOrders.filter((o) => getStatus(o) === ETrangThaiTrucTiep.HOAN_THANH);
    const revenue = done.reduce((s, o) => s + getAmount(o), 0);
    const uniqueKH = new Set(todayOrders.map((o) => o.khachhang?.tenkhachhang || o.khachHang?.ten || 'Vãng lai')).size;
    const avgPerOrder = done.length > 0 ? Math.round(revenue / done.length) : 0;

    return [
      { id: 'revenue',  label: 'DOANH THU HÔM NAY', value: fmt(revenue),       change: `${done.length} đơn hoàn thành`,  icon: 'revenue'  },
      { id: 'order',    label: 'TỔNG ĐƠN HÔM NAY',  value: String(todayOrders.length), change: `${cancelledToday} đơn đã huỷ`, icon: 'order'    },
      { id: 'customer', label: 'KHÁCH ĐÃ ĐẶT',       value: String(uniqueKH),      change: 'Khách duy nhất hôm nay',          icon: 'customer' },
      { id: 'average',  label: 'TRUNG BÌNH / ĐƠN',   value: fmt(avgPerOrder),      change: 'Tính từ đơn hoàn thành',          icon: 'average'  },
    ];
  }, [orders]);

  // ── Data thật ─────────────────────────────────────
  const realOrders = orders;

  const realCancelledIds = useMemo(() => {
    const s = new Set<string>();
    realOrders.forEach((o) => { if (getStatus(o) === 'da_huy') s.add(getOrderId(o)); });
    return s;
  }, [realOrders]);

  const realActive   = realOrders.filter((o) => !realCancelledIds.has(getOrderId(o)));
  const realDone     = realActive.filter((o) => getStatus(o) === ETrangThaiTrucTiep.HOAN_THANH);
  const realWaiting  = realActive.filter((o) => getStatus(o) === ETrangThaiTrucTiep.CHO_XAC_NHAN);
  const realCooking  = realActive.filter((o) => getStatus(o) === ETrangThaiTrucTiep.DANG_CHE_BIEN);
  const realReady    = realActive.filter((o) => getStatus(o) === ETrangThaiTrucTiep.SAN_SANG);
  const total        = realOrders.length;
  const realTodayDone = useMemo(
    () => realDone.filter((o) => getOrderDate(o)?.isSame(dayjs(), 'day')),
    [realDone],
  );

  // Top món bán chạy từ data thật
  const realTopMon = useMemo(() => {
    const counter: Record<string, number> = {};
    realTodayDone.forEach((o) => {
      const dsMon = getItems(o);
      dsMon.forEach((m: any) => { 
        const tenMon = getItemName(m);
        counter[tenMon] = (counter[tenMon] ?? 0) + getQty(m); 
      });
    });
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ten, soLuong], idx) => ({ rank: idx + 1, ten, soLuong }));
  }, [realTodayDone]);

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

  const rd = useMemo(() => buildRangeRevenue(realDone, range), [realDone, range]);
  const barOptions = useMemo(() => buildBarLineOptions(rd.labels), [rd]);
  const barSeries = useMemo(() => [
    { name: 'Doanh thu', type: 'bar',  data: rd.tuanNay },
    { name: 'Trung bình', type: 'line', data: rd.trungBinh },
  ], [rd]);
  const danhMuc = useMemo(() => {
    const counter: Record<string, number> = {};
    realTodayDone.forEach((o) => {
      const dsMon = getItems(o);
      const tongSoLuong = dsMon.reduce((sum: number, item: any) => sum + getQty(item), 0) || 1;
      dsMon.forEach((m: any) => {
        const ten = getItemName(m);
        counter[ten] = (counter[ten] ?? 0) + Math.round((getAmount(o) * getQty(m)) / tongSoLuong);
      });
    });
    const totalRevenue = Object.values(counter).reduce((sum, value) => sum + value, 0);
    if (totalRevenue <= 0) return [{ ten: 'Chưa có dữ liệu', tyLe: 100, mau: '#d1d5db' }];
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([ten, value], index) => ({
        ten,
        tyLe: Math.round((value / totalRevenue) * 100),
        mau: COLORS[index % COLORS.length],
      }));
  }, [realTodayDone]);
  const tongDanhMuc = danhMuc.filter((d) => d.ten !== 'Chưa có dữ liệu').length;
  const donutOptions = useMemo(
    () => buildDonutOptions(danhMuc.map((d) => d.ten), danhMuc.map((d) => d.mau), tongDanhMuc, 'Món'),
    [danhMuc, tongDanhMuc],
  );
  const donutSeries = danhMuc.map((d) => d.tyLe);
  const heatValues = useMemo(() => buildHeatValues(realActive), [realActive]);

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

      {/* ── Biểu đồ — data thật ── */}
      <div className={styles.chartRow2}>
        <div className={styles.barChartCard}>
          <div className={styles.chartHeader2}>
            <div>
              <span className={styles.chartTitle2}>{RANGE_CFG[range].title}</span>
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
          <div className={styles.chartTitle2}>Theo món</div>
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
          <CssHeatmap values={heatValues} />
        </div>
      </div>

      {/* ── Bảng chi tiết đơn hoàn thành hôm nay ── */}
      <div className={styles.bottomCard} style={{ marginTop: 0 }}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>Đơn hoàn thành gần nhất</span>
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
