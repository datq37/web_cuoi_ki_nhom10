import {
  AlertOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Progress } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { history } from 'umi';
import { fmt } from '@/models/QuanTri/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { useNotif } from '@/context/NotifContext';
import { KEYS, store } from '@/utils/storage';
import styles from './index.less';

function getChaoTheoGio(): string {
  const h = dayjs().hour();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 13) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

const TRANG_THAI_CFG: Record<string, { label: string; color: string; bg: string }> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]:  { label: 'Chờ xác nhận',  color: '#ea580c', bg: '#fff7ed' },
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: { label: 'Đang chế biến', color: '#2563eb', bg: '#eff6ff' },
  [ETrangThaiTrucTiep.SAN_SANG]:      { label: 'Sẵn sàng',      color: '#7c3aed', bg: '#f5f3ff' },
  [ETrangThaiTrucTiep.HOAN_THANH]:    { label: 'Hoàn thành',    color: '#16a34a', bg: '#f0fdf4' },
};

const SHORTCUTS = [
  { path: '/quan-tri/don-hang',        icon: ShoppingCartOutlined, label: 'Đơn hàng',    color: '#16a34a', bg: '#f0fdf4' },
  { path: '/quan-tri/kho-nguyen-lieu', icon: InboxOutlined,        label: 'Kho',         color: '#ea580c', bg: '#fff7ed' },
  { path: '/quan-tri/quan-ly-mon',     icon: AppstoreOutlined,     label: 'Quản lý món', color: '#2563eb', bg: '#eff6ff' },
  { path: '/quan-tri/khuyen-mai',      icon: TagOutlined,          label: 'Khuyến mãi',  color: '#7c3aed', bg: '#f5f3ff' },
  { path: '/quan-tri/khach-hang',      icon: UserOutlined,         label: 'KhachHang',  color: '#0891b2', bg: '#ecfeff' },
  { path: '/quan-tri/nhan-vien',       icon: TeamOutlined,         label: 'Nhân viên',   color: '#d97706', bg: '#fffbeb' },
];

const NOTIF_ICON: Record<string, string> = {
  order_pending:   '🛒',
  order_cooking:   '🍳',
  order_ready:     '📦',
  order_done:      '✅',
  order_cancelled: '❌',
  stock_refilled:  '📦',
};

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

interface TacNghiepProps {
  orders: any[];
  inventory: any[];
}

const TacNghiepView: React.FC<TacNghiepProps> = ({ orders, inventory }) => {
  const user = store.get<{ ten?: string }>(KEYS.user, { ten: 'Quản trị viên' });
  const ten  = user.ten ?? 'Quản trị viên';
  const { notifs } = useNotif();

  // ── Đơn hàng live ───────────────────────────────────────────────
  const cancelledIds = useMemo(() => {
    const s = new Set<string>();
    orders.forEach((o) => { if (getStatus(o) === 'da_huy') s.add(getOrderId(o)); });
    return s;
  }, [orders]);

  const activeOrders = orders.filter((o) => !cancelledIds.has(getOrderId(o)));
  const todayOrders  = activeOrders.filter((o) => getOrderDate(o)?.isSame(dayjs(), 'day'));
  const choXacNhan   = activeOrders.filter((o) => getStatus(o) === ETrangThaiTrucTiep.CHO_XAC_NHAN);
  const dangCheBien  = activeOrders.filter((o) => getStatus(o) === ETrangThaiTrucTiep.DANG_CHE_BIEN);
  const sanSang      = activeOrders.filter((o) => getStatus(o) === ETrangThaiTrucTiep.SAN_SANG);
  const hoanThanh    = todayOrders.filter((o) => getStatus(o) === ETrangThaiTrucTiep.HOAN_THANH);
  const cancelledToday = orders.filter((o) => getStatus(o) === 'da_huy' && getOrderDate(o)?.isSame(dayjs(), 'day')).length;
  const doanhThu     = hoanThanh.reduce((s, o) => s + getAmount(o), 0);

  // ── Quick KPIs ───────────────────────────────────────────────────
  const tyLeHoanThanh = todayOrders.length > 0
    ? Math.round((hoanThanh.length / todayOrders.length) * 100)
    : 0;

  const tongMonBan = useMemo(() =>
    hoanThanh.reduce((sum, o) => sum + getItems(o).reduce((s: any, m: any) => s + getQty(m), 0), 0),
  [hoanThanh]);

  // ── Top món bán chạy hôm nay ─────────────────────────────────────
  const topMon = useMemo(() => {
    const counter: Record<string, { ten: string; soLuong: number; tongTien: number }> = {};
    hoanThanh.forEach((o) => {
      const dsMon = getItems(o);
      const tongSoLuong = dsMon.reduce((s: any, x: any) => s + getQty(x), 0) || 1;
      dsMon.forEach((m: any) => {
        const tenMon = getItemName(m);
        if (!counter[tenMon]) counter[tenMon] = { ten: tenMon, soLuong: 0, tongTien: 0 };
        counter[tenMon].soLuong  += getQty(m);
        counter[tenMon].tongTien += getQty(m) * (getAmount(o) / tongSoLuong);
      });
    });
    return Object.values(counter)
      .sort((a, b) => b.soLuong - a.soLuong)
      .slice(0, 5);
  }, [hoanThanh]);

  // ── Đơn cần xử lý (mini-list) ────────────────────────────────────
  const recentOrders = useMemo(() =>
    [...choXacNhan, ...dangCheBien, ...sanSang].slice(0, 4),
  [choXacNhan, dangCheBien, sanSang]);

  // ── Cảnh báo kho ─────────────────────────────────────────────────
  const sapHet  = inventory.filter((n) => n.tonKho <= (n.mucToiThieu || 10) && n.tonKho > 0);
  const hetHang = inventory.filter((n) => n.tonKho === 0);

  // ── Activity feed (5 notif gần nhất) ─────────────────────────────
  const recentActivity = notifs.slice(0, 5);

  return (
    <div className={styles.tnWrap}>

      {/* ── Welcome card ─────────────────────────────────────────── */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeGreet}>{getChaoTheoGio()}, {ten} 👋</div>
          <div className={styles.welcomeDate}>
            {dayjs().format('dddd, D [tháng] M [năm] YYYY')} · {activeOrders.length} đơn đang hoạt động
          </div>
        </div>
        <div className={styles.welcomeRevenue}>
          <div className={styles.welcomeRevenueLabel}>Doanh thu hôm nay</div>
          <div className={styles.welcomeRevenueValue}>{fmt(doanhThu)}</div>
        </div>
      </div>

      {/* ── Quick KPIs ───────────────────────────────────────────── */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiItem}>
          <div className={styles.kpiLabel}>Tỷ lệ hoàn thành</div>
          <div className={styles.kpiValue}>{tyLeHoanThanh}%</div>
          <Progress
            percent={tyLeHoanThanh}
            showInfo={false}
            size="small"
            strokeColor="#16a34a"
            trailColor="#dcfce7"
            style={{ marginTop: 6 }}
          />
        </div>
        <div className={styles.kpiDivider} />
        <div className={styles.kpiItem}>
          <div className={styles.kpiLabel}>Đơn hoàn thành</div>
          <div className={styles.kpiValue} style={{ color: '#16a34a' }}>{hoanThanh.length}</div>
          <div className={styles.kpiSub}>trên {todayOrders.length} đơn hôm nay</div>
        </div>
        <div className={styles.kpiDivider} />
        <div className={styles.kpiItem}>
          <div className={styles.kpiLabel}>Đã huỷ hôm nay</div>
          <div className={styles.kpiValue} style={{ color: cancelledToday > 0 ? '#dc2626' : '#9ca3af' }}>
            {cancelledToday}
          </div>
          <div className={styles.kpiSub}>đơn</div>
        </div>
        <div className={styles.kpiDivider} />
        <div className={styles.kpiItem}>
          <div className={styles.kpiLabel}>Suất ăn đã bán</div>
          <div className={styles.kpiValue}>{tongMonBan}</div>
          <div className={styles.kpiSub}>suất</div>
        </div>
      </div>

      {/* ── Đơn hàng live + mini-list ────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <ShoppingCartOutlined style={{ marginRight: 8, color: '#16a34a' }} />
            Trạng thái đơn hàng
          </div>
          <Button type="link" className={styles.sectionLink}
            onClick={() => history.push('/quan-tri/don-hang')}>
            Xem tất cả <ArrowRightOutlined />
          </Button>
        </div>

        <div className={styles.orderStatGrid}>
          <div className={`${styles.orderStatItem} ${choXacNhan.length > 0 ? styles.orderStatAlert : ''}`}>
            <ClockCircleOutlined className={styles.orderStatIcon} />
            <div className={styles.orderStatNum}>{choXacNhan.length}</div>
            <div className={styles.orderStatLabel}>Chờ xác nhận</div>
          </div>
          <div className={styles.orderStatItem}>
            <FireOutlined className={styles.orderStatIcon} />
            <div className={styles.orderStatNum}>{dangCheBien.length}</div>
            <div className={styles.orderStatLabel}>Đang chế biến</div>
          </div>
          <div className={styles.orderStatItem}>
            <CheckCircleOutlined className={styles.orderStatIcon} style={{ color: '#16a34a' }} />
            <div className={styles.orderStatNum}>{sanSang.length}</div>
            <div className={styles.orderStatLabel}>Sẵn sàng giao</div>
          </div>
          <div className={styles.orderStatItem}>
            <div className={styles.orderStatNum} style={{ color: '#16a34a' }}>{hoanThanh.length}</div>
            <div className={styles.orderStatLabel}>Hoàn thành</div>
          </div>
        </div>

        {recentOrders.length > 0 && (
          <div className={styles.recentList}>
            <div className={styles.recentTitle}>Đơn cần xử lý</div>
            {recentOrders.map((o) => {
              const cfg = TRANG_THAI_CFG[o.trangthai || o.trangThai];
              const khTen = o.khachhang?.tenkhachhang || o.khachHang?.ten || 'Khách vãng lai';
              const ma = o.maDon || o._id;
              const dsMon = o.monan || o.monAn || [];
              const tTien = o.tongtien || o.tongTien;
              return (
                <div key={ma} className={styles.recentRow}
                  onClick={() => history.push('/quan-tri/don-hang')}>
                  <Avatar size={32}
                    style={{ background: o.khachHang?.mauNen || '#3b82f6', color: o.khachHang?.mauChu || '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                    {khTen.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase()}
                  </Avatar>
                  <div className={styles.recentInfo}>
                    <div className={styles.recentName}>{khTen}</div>
                    <div className={styles.recentMon}>{dsMon.map((m: any) => m.ten || m.tenmon).join(', ')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                    <span className={styles.recentBadge} style={{ background: cfg?.bg, color: cfg?.color }}>
                      {cfg?.label}
                    </span>
                    <span className={styles.recentGia}>{fmt(tTien)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {choXacNhan.length > 0 && (
          <div className={styles.urgentBanner}>
            <ExclamationCircleOutlined style={{ color: '#ea580c', marginRight: 8 }} />
            <span><strong>{choXacNhan.length} đơn</strong> đang chờ xác nhận</span>
            <Button type="primary" className={styles.urgentBtn}
              onClick={() => history.push('/quan-tri/don-hang')}>
              Xử lý ngay
            </Button>
          </div>
        )}
      </div>

      {/* ── 2 cột: Top món + Activity ────────────────────────────── */}
      <div className={styles.twoCol}>

        {/* Top món bán chạy */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              🍽 Top món hôm nay
            </div>
          </div>
          {topMon.length === 0 ? (
            <div className={styles.khoOk} style={{ fontSize: 13 }}>Chưa có đơn hoàn thành hôm nay</div>
          ) : (
            <div className={styles.topMonList}>
              {topMon.map((m, idx) => (
                <div key={m.ten} className={styles.topMonRow}>
                  <span className={`${styles.topMonRank} ${idx === 0 ? styles.rankGold : idx === 1 ? styles.rankSilver : idx === 2 ? styles.rankBronze : ''}`}>
                    {idx + 1}
                  </span>
                  <span className={styles.topMonTen}>{m.ten}</span>
                  <div className={styles.topMonRight}>
                    <span className={styles.topMonSo}>×{m.soLuong}</span>
                    <div className={styles.topMonBar}>
                      <div
                        className={styles.topMonFill}
                        style={{ width: `${Math.round((m.soLuong / (topMon[0]?.soLuong || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>⚡ Hoạt động gần nhất</div>
          </div>
          {recentActivity.length === 0 ? (
            <div className={styles.khoOk} style={{ fontSize: 13 }}>Chưa có hoạt động nào</div>
          ) : (
            <div className={styles.activityList}>
              {recentActivity.map((n) => (
                <div key={n.id} className={styles.activityRow}>
                  <div className={styles.activityIcon}>{n.icon || NOTIF_ICON[n.type] || '🔔'}</div>
                  <div className={styles.activityBody}>
                    <div className={styles.activityTitle}>{n.title}</div>
                    <div className={styles.activityDesc}>{n.desc}</div>
                  </div>
                  <div className={styles.activityTime}>
                    {dayjs(n.createdAt).format('HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Cảnh báo kho ──────────────────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <InboxOutlined style={{ marginRight: 8, color: '#ea580c' }} />
            Cảnh báo nguyên liệu
          </div>
          <Button type="link" className={styles.sectionLink}
            onClick={() => history.push('/quan-tri/kho-nguyen-lieu')}>
            Vào kho <ArrowRightOutlined />
          </Button>
        </div>
        {sapHet.length === 0 && hetHang.length === 0 ? (
          <div className={styles.khoOk}>
            <CheckCircleOutlined style={{ fontSize: 20, color: '#16a34a', marginRight: 8 }} />
            Kho nguyên liệu đang ổn định
          </div>
        ) : (
          <div className={styles.khoWarnList}>
            {hetHang.map((n) => (
              <div key={n.id} className={`${styles.khoWarnItem} ${styles.khoWarnDanger}`}>
                <AlertOutlined style={{ color: '#dc2626' }} />
                <span className={styles.khoWarnTen}>{n.ten}</span>
                <span className={styles.khoWarnTag}>Hết hàng</span>
              </div>
            ))}
            {sapHet.map((n) => (
              <div key={n.id} className={`${styles.khoWarnItem} ${styles.khoWarnWarning}`}>
                <ExclamationCircleOutlined style={{ color: '#d97706' }} />
                <span className={styles.khoWarnTen}>{n.ten}</span>
                <span className={styles.khoWarnTag} style={{ background: '#fef3c7', color: '#92400e' }}>
                  Sắp hết · {n.tonKho} {n.donVi}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Shortcuts ─────────────────────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionTitle} style={{ marginBottom: 14 }}>⚡ Truy cập nhanh</div>
        <div className={styles.shortcutGrid}>
          {SHORTCUTS.map(({ path, icon: Icon, label, color, bg }) => (
            <button key={path} className={styles.shortcutBtn} onClick={() => history.push(path)}>
              <div className={styles.shortcutIconWrap} style={{ background: bg }}>
                <Icon style={{ fontSize: 20, color }} />
              </div>
              <span className={styles.shortcutLabel}>{label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TacNghiepView;
