import { ArrowDownOutlined, ArrowUpOutlined, RightOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  buildBarLineOptions,
  buildDonutOptions,
  fmt,
  fmtShort,
} from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import type { HoatDongItem } from '@/services/Quản Trị/Tổng Quan/typing';
import styles from './index.less';

// ── Icon banner ─────────────────────────────────────────────
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

// ── Icon hoạt động ──────────────────────────────────────────
const HoatDongIcon: React.FC<{ item: HoatDongItem }> = ({ item }) => {
  const icons: Record<string, React.ReactNode> = {
    order: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    menu: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    warehouse: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    delivery: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h6m-3-3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    promo: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M20 12V22H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return (
    <div className={styles.hdIconWrap} style={{ background: item.bgIcon, color: item.mauIcon }}>
      {icons[item.type]}
    </div>
  );
};

// ── PhanTichView ────────────────────────────────────────────
const PhanTichView: React.FC = () => {
  const { banners, doanhThuTuan, danhMuc, tongDanhMuc, topMon, donTheoTrangThai, hieuSuat, hoatDong } =
    mockData.phanTich;

  const barOptions = useMemo(
    () => buildBarLineOptions(doanhThuTuan.map((d) => d.tuan)),
    [doanhThuTuan],
  );
  const barSeries = useMemo(
    () => [
      { name: 'Tuần này', type: 'bar',  data: doanhThuTuan.map((d) => d.tuanNay) },
      { name: 'Trung bình', type: 'line', data: doanhThuTuan.map((d) => d.trungBinh) },
    ],
    [doanhThuTuan],
  );
  const donutOptions = useMemo(
    () => buildDonutOptions(danhMuc.map((d) => d.ten), danhMuc.map((d) => d.mau), tongDanhMuc),
    [danhMuc, tongDanhMuc],
  );
  const donutSeries = danhMuc.map((d) => d.tyLe);

  return (
    <div className={styles.phanTichWrap}>
      <div className={styles.statBanner}>
        {banners.map((b, i) => (
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
      <div className={styles.chartRow2}>
        <div className={styles.barChartCard}>
          <div className={styles.chartHeader2}>
            <span className={styles.chartTitle2}>Doanh thu 12 tuần</span>
            <div className={styles.chartLegend}>
              <span className={styles.legendBox} style={{ background: '#16a34a' }} />
              <span>Tuần này</span>
              <span className={styles.legendDash} />
              <span>Trung bình</span>
            </div>
          </div>
          <ReactApexChart options={barOptions} series={barSeries} type="bar" height={240} />
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
      <div className={styles.bottomRow}>
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Top món bán chạy</span>
            <a href="#" className={styles.viewAll}>Xem tất cả</a>
          </div>
          <table className={styles.topMonTable}>
            <thead>
              <tr>
                <th>MÓN ĂN</th>
                <th>ĐÃ BÁN</th>
                <th>DOANH THU</th>
              </tr>
            </thead>
            <tbody>
              {topMon.map((m) => (
                <tr key={m.rank}>
                  <td>
                    <div className={styles.topMonCell}>
                      <img
                        src={m.hinhAnh}
                        alt={m.ten}
                        className={styles.topMonImg}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/36'; }}
                      />
                      <span>{m.rank}. {m.ten}</span>
                    </div>
                  </td>
                  <td className={styles.tdCenter}>{m.daBan} {m.donVi}</td>
                  <td className={styles.tdRight}>{fmtShort(m.doanhThu)}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Đơn hàng theo trạng thái</span>
            <a href="#" className={styles.viewAll}>Xem chi tiết</a>
          </div>
          <div className={styles.trangThaiList}>
            {donTheoTrangThai.map((t) => (
              <div key={t.key} className={styles.trangThaiRow}>
                <div className={styles.trangThaiLeft}>
                  <span className={styles.trangThaiDot} style={{ background: t.mau }} />
                  <span className={styles.trangThaiTen}>{t.ten}</span>
                </div>
                <span className={styles.trangThaiSo}>{t.soDon} đơn</span>
                <div className={styles.progressWrap2}>
                  <div className={styles.progressBar} style={{ width: `${t.tyLe}%`, background: t.mau }} />
                </div>
                <span className={styles.trangThaiPct}>{t.tyLe}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottomCard}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Hiệu suất phục vụ</span>
            <button className={styles.periodSelect}>Hôm nay ▾</button>
          </div>
          <div className={styles.hieuSuatList}>
            {hieuSuat.map((h, i) => (
              <div key={i} className={styles.hieuSuatItem}>
                <div className={styles.hieuSuatLabel}>{h.label}</div>
                <div className={styles.hieuSuatRow}>
                  <span className={styles.hieuSuatValue}>
                    {h.value}<span className={styles.hieuSuatUnit}>{h.unit}</span>
                  </span>
                  <div className={`${styles.hieuSuatChange} ${h.trend === 'up' ? styles.up : styles.down2}`}>
                    {h.trend === 'up'
                      ? <ArrowUpOutlined style={{ fontSize: 10 }} />
                      : <ArrowDownOutlined style={{ fontSize: 10 }} />}
                    {h.change} <span className={styles.changeDetail}>{h.changeDetail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.hoatDongCard}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>Hoạt động gần đây</span>
          <a href="#" className={styles.viewAll}>Xem tất cả</a>
        </div>
        <div className={styles.hoatDongScroll}>
          {hoatDong.map((h) => (
            <div key={h.id} className={styles.hoatDongItem}>
              <HoatDongIcon item={h} />
              <div className={styles.hdInfo}>
                <div className={styles.hdTitle}>{h.tieuDe}</div>
                <div className={styles.hdMota}>{h.moTa}</div>
                <div className={styles.hdTime}>{h.thoiGian}</div>
              </div>
              <RightOutlined className={styles.hdArrow} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhanTichView;
