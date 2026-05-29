import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FireOutlined,
  GiftOutlined,
  RightOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Progress, Rate } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'umi';
import ReactApexChart from 'react-apexcharts';
import {
  buildAreaOptions,
  buildDonutOptions,
  fmt,
  getTrangThaiDon,
  tinhTongDoanhThu,
} from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import type { DonGanDay, StatCard } from '@/services/Quản Trị/Tổng Quan/typing';
import styles from './index.less';

const StatIconTN: React.FC<{ type: string; color: string; bg: string }> = ({ type, color, bg }) => {
  const icons: Record<string, React.ReactNode> = {
    revenue: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H10.5a1.5 1.5 0 000 3H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    order: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2" />
        <path d="M9 12h6M9 16h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    processing: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    customer: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  return <div className={styles.tnStatIcon} style={{ background: bg }}>{icons[type]}</div>;
};

const TacNghiepView: React.FC = () => {
  const { statCards, infoCard, doanhThu7Ngay, trangThaiDon, tongDonHomNay, donGanDay, topMon } =
    mockData.tacNghiep;
  const tongDoanhThu = tinhTongDoanhThu(doanhThu7Ngay);
  const areaOptions  = useMemo(() => buildAreaOptions(doanhThu7Ngay.map((d) => d.ngay)), []);
  const areaSeries   = useMemo(() => [{ name: 'Doanh thu', data: doanhThu7Ngay.map((d) => d.doanhThu) }], []);
  const donutOpts    = useMemo(() => buildDonutOptions(trangThaiDon.map((t) => t.label), trangThaiDon.map((t) => t.color), tongDonHomNay), []);
  const donutSeries  = trangThaiDon.map((t) => t.value);
  const rankColors   = ['#f59e0b', '#9ca3af', '#cd7f32'];

  const donCols = [
    { title: 'MÃ ĐƠN',     render: (r: DonGanDay) => <span className={styles.tnMaDon}>{r.maDon}</span>,                                                                                                  width: 90 },
    { title: 'KHÁCH HÀNG', render: (r: DonGanDay) => <div><div className={styles.tnKH}>{r.khachHang}</div><div className={styles.tnPhong}>{r.phong}</div></div>,                                          width: 160 },
    { title: 'MÓN',        render: (r: DonGanDay) => <span className={styles.tnMon}>{r.mon}</span> },
    { title: 'TỔNG TIỀN',  render: (r: DonGanDay) => <span className={styles.tnTien}>{fmt(r.tongTien)}</span>,                                                                                            width: 105 },
    {
      title: 'TRẠNG THÁI',
      render: (r: DonGanDay) => {
        const cfg = getTrangThaiDon(r.trangThai);
        return (
          <span className={styles.tnStatusBadge} data-status={r.trangThai} style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        );
      },
      width: 135,
    },
    { title: 'GIỜ', render: (r: DonGanDay) => <span className={styles.tnGio}>{r.thoiGian}</span>, width: 60 },
  ];

  return (
    <div className={styles.tnWrap}>
      {/* ── Stat cards ── */}
      <div className={styles.tnStatGrid}>
        {statCards.map((c: StatCard) => (
          <div key={c.id} className={styles.tnStatCard}>
            <div className={styles.tnStatTop}>
              <span className={styles.tnStatLabel}>{c.label}</span>
              <StatIconTN type={c.icon} color={c.iconColor} bg={c.iconBg} />
            </div>
            <div className={styles.tnStatValue}>{c.valueDisplay}</div>
            <div className={`${styles.tnStatChange} ${c.trend === 'up' ? styles.tnUp : styles.tnDown}`}>
              {c.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{c.changeText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Info cards ── */}
      <div className={styles.tnInfoGrid}>
        {/* Tỉ lệ hoàn thành */}
        <div className={styles.tnInfoCard}>
          <div className={styles.tnInfoTitle}>Tỉ lệ hoàn thành đơn</div>
          <div className={styles.tnCompletion}>
            <Progress
              type="circle"
              percent={infoCard.tiLeHoanThanh}
              width={68}
              strokeColor="#16a34a"
              trailColor="#dcfce7"
              strokeWidth={8}
              format={(p) => <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{p}%</span>}
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 13 }}>Hoàn thành tốt!</div>
              <div style={{ color: '#16a34a', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                <ArrowUpOutlined style={{ fontSize: 10 }} /> 6% so với tuần trước
              </div>
            </div>
          </div>
        </div>

        {/* Món bán chạy */}
        <div className={styles.tnInfoCard}>
          <div className={styles.tnInfoTitle}>Món bán chạy nhất</div>
          <div className={styles.tnBestDish}>
            <img
              src={infoCard.monBanChayNhat.hinhAnh}
              alt={infoCard.monBanChayNhat.ten}
              className={styles.tnDishImg}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/52'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.tnDishName}>{infoCard.monBanChayNhat.ten}</div>
              <div className={styles.tnDishSold}>Đã bán {infoCard.monBanChayNhat.soSuat} suất</div>
            </div>
            <div className={styles.tnTopBadge}>
              <FireOutlined style={{ color: '#ef4444', marginRight: 2 }} />Top 1
            </div>
          </div>
        </div>

        {/* Khuyến mãi */}
        <div className={styles.tnInfoCard}>
          <div className={styles.tnInfoTitle}>Khuyến mãi đang chạy</div>
          <div className={styles.tnPromo}>
            <div className={styles.tnPromoIcon}>
              <GiftOutlined style={{ fontSize: 22, color: '#16a34a' }} />
            </div>
            <div>
              <div className={styles.tnPromoName}>{infoCard.khuyenMai.ten}</div>
              <div className={styles.tnPromoLeft}>{infoCard.khuyenMai.conLai}</div>
              <Link className={styles.tnPromoLink} to="/quan-tri/khuyen-mai">Xem chi tiết</Link>
            </div>
          </div>
        </div>

        {/* Hài lòng */}
        <div className={styles.tnInfoCard}>
          <div className={styles.tnInfoTitle}>Mức hài lòng khách hàng</div>
          <div className={styles.tnSatisfy}>
            <div className={styles.tnSatisfyIcon}>
              <SmileOutlined style={{ fontSize: 24, color: '#eab308' }} />
            </div>
            <div>
              <div className={styles.tnSatisfyScore}>{infoCard.diemHaiLong.diem}/5</div>
              <div className={styles.tnSatisfyDesc}>Dựa trên {infoCard.diemHaiLong.soDanhGia} đánh giá</div>
              <Rate disabled defaultValue={infoCard.diemHaiLong.diem} style={{ fontSize: 13, color: '#f59e0b' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Biểu đồ ── */}
      <div className={styles.tnChartRow}>
        <div className={styles.tnChartCard}>
          <div className={styles.tnChartHead}>
            <div>
              <div className={styles.tnChartTitle}>Doanh thu 7 ngày qua</div>
              <div className={styles.tnChartSub}>
                Tổng: <strong>{new Intl.NumberFormat('vi-VN').format(tongDoanhThu)}đ</strong>
              </div>
            </div>
          </div>
          <ReactApexChart options={areaOptions} series={areaSeries} type="area" height={210} />
        </div>
        <div className={styles.tnChartCard}>
          <div className={styles.tnChartTitle} style={{ marginBottom: 10 }}>Trạng thái đơn hôm nay</div>
          <div className={styles.tnDonutWrap}>
            <ReactApexChart options={donutOpts} series={donutSeries} type="donut" height={190} />
            <div className={styles.tnDonutLeg}>
              {trangThaiDon.map((t) => (
                <div key={t.key} className={styles.tnLegRow}>
                  <span className={styles.tnLegDot} style={{ background: t.color }} />
                  <span className={styles.tnLegLabel}>{t.label}</span>
                  <span className={styles.tnLegVal}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/quan-tri/don-hang" className={styles.tnViewAll}>
            Xem chi tiết đơn hàng <RightOutlined style={{ fontSize: 10 }} />
          </Link>
        </div>
      </div>

      {/* ── Bảng đơn + Top món ── */}
      <div className={styles.tnDataRow}>
        <div className={styles.tnTableCard}>
          <div className={styles.tnTableHead}>
            <span className={styles.tnTableTitle}>Đơn gần đây</span>
            <Link to="/quan-tri/don-hang" className={styles.tnViewAll}>Xem tất cả</Link>
          </div>
          <table className={styles.tnTable}>
            <thead>
              <tr>{donCols.map((c) => <th key={c.title} style={{ width: c.width }}>{c.title}</th>)}</tr>
            </thead>
            <tbody>
              {donGanDay.map((r) => (
                <tr key={r.maDon}>{donCols.map((c) => <td key={c.title}>{c.render(r)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tnTopCard}>
          <div className={styles.tnTableHead}>
            <span className={styles.tnTableTitle}>Top món bán chạy</span>
            <Link to="/quan-tri/quan-ly-mon" className={styles.tnViewAll}>Xem tất cả</Link>
          </div>
          <div className={styles.tnTopList}>
            {topMon.map((m) => (
              <div key={m.rank} className={styles.tnTopRow}>
                <span className={styles.tnTopRank} style={{ color: rankColors[m.rank - 1] ?? '#9ca3af' }}>
                  {m.rank}
                </span>
                <img
                  src={m.hinhAnh}
                  alt={m.ten}
                  className={styles.tnTopImg}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/44'; }}
                />
                <span className={styles.tnTopName}>{m.ten}</span>
                <span className={styles.tnTopSuat} style={{ color: '#16a34a' }}>{m.daBan} suất</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacNghiepView;
