import {
  AlertOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  InboxOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { history } from 'umi';
import { fmt } from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { DANH_SACH_NGUYEN_LIEU } from '@/services/Quản Trị/Kho Nguyên Liệu';
import { ETrangThaiNguyenLieu } from '@/services/Quản Trị/Kho Nguyên Liệu/typing';
import { KEYS, store } from '@/utils/storage';
import styles from './index.less';

function getChaoTheoGio(): string {
  const h = dayjs().hour();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 13) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

const TacNghiepView: React.FC = () => {
  const user = store.get<{ ten?: string }>(KEYS.user, { ten: 'Quản trị viên' });
  const ten  = user.ten ?? 'Quản trị viên';

  // ── Đơn hàng live từ localStorage ───────────────────────────────
  const orders = useMemo(() =>
    store.get<typeof mockData.trucTiep.donHang>(KEYS.orders, mockData.trucTiep.donHang),
  []);

  const cancelledIds = useMemo(() => {
    const s = new Set<string>();
    orders.forEach((o) => { if ((o.trangThai as any) === 'da_huy') s.add(o.maDon); });
    return s;
  }, [orders]);

  const activeOrders = orders.filter((o) => !cancelledIds.has(o.maDon));
  const choXacNhan   = activeOrders.filter((o) => o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN);
  const dangCheBien  = activeOrders.filter((o) => o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN);
  const sanSang      = activeOrders.filter((o) => o.trangThai === ETrangThaiTrucTiep.SAN_SANG);
  const hoanThanh    = activeOrders.filter((o) => o.trangThai === ETrangThaiTrucTiep.HOAN_THANH);
  const doanhThu     = hoanThanh.reduce((s, o) => s + o.tongTien, 0);

  // ── Cảnh báo kho ─────────────────────────────────────────────────
  const sapHet  = DANH_SACH_NGUYEN_LIEU.filter((n) => n.trangThai === ETrangThaiNguyenLieu.SAP_HET);
  const hetHang = DANH_SACH_NGUYEN_LIEU.filter((n) => n.trangThai === ETrangThaiNguyenLieu.HET_HANG);

  return (
    <div className={styles.tnWrap}>

      {/* ── Welcome card ─────────────────────────────────────────── */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeGreet}>{getChaoTheoGio()}, {ten.split(' ').pop()} 👋</div>
          <div className={styles.welcomeDate}>
            {dayjs().format('dddd, D [tháng] M [năm] YYYY')} · Hôm nay có {activeOrders.length} đơn đang hoạt động
          </div>
        </div>
        <div className={styles.welcomeRevenue}>
          <div className={styles.welcomeRevenueLabel}>Doanh thu hôm nay</div>
          <div className={styles.welcomeRevenueValue}>{fmt(doanhThu)}</div>
        </div>
      </div>

      {/* ── Khu 1: Đơn hàng live ─────────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <ShoppingCartOutlined style={{ marginRight: 8, color: '#16a34a' }} />
            Trạng thái đơn hàng
          </div>
          <Button
            size="small"
            type="link"
            className={styles.sectionLink}
            onClick={() => history.push('/quan-tri/don-hang')}
          >
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
            <div className={styles.orderStatLabel}>Hoàn thành hôm nay</div>
          </div>
        </div>

        {choXacNhan.length > 0 && (
          <div className={styles.urgentBanner}>
            <ExclamationCircleOutlined style={{ color: '#ea580c', marginRight: 8 }} />
            <span>
              <strong>{choXacNhan.length} đơn</strong> đang chờ xác nhận —{' '}
              {choXacNhan.slice(0, 3).map((o) => o.maDon).join(', ')}
              {choXacNhan.length > 3 && ` và ${choXacNhan.length - 3} đơn nữa`}
            </span>
            <Button
              size="small"
              type="primary"
              className={styles.urgentBtn}
              onClick={() => history.push('/quan-tri/don-hang')}
            >
              Xử lý ngay
            </Button>
          </div>
        )}
      </div>

      {/* ── Khu 2: Cảnh báo kho ──────────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <InboxOutlined style={{ marginRight: 8, color: '#ea580c' }} />
            Cảnh báo nguyên liệu
          </div>
          <Button
            size="small"
            type="link"
            className={styles.sectionLink}
            onClick={() => history.push('/quan-tri/kho-nguyen-lieu')}
          >
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

      {/* ── Khu 3: Shortcuts ─────────────────────────────────────── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionTitle} style={{ marginBottom: 14 }}>
          ⚡ Thao tác nhanh
        </div>
        <div className={styles.shortcutGrid}>
          <button className={styles.shortcutBtn} onClick={() => history.push('/quan-tri/don-hang')}>
            <ShoppingCartOutlined className={styles.shortcutIcon} />
            <span>Xem đơn hàng</span>
          </button>
          <button className={styles.shortcutBtn} onClick={() => history.push('/quan-tri/kho-nguyen-lieu')}>
            <InboxOutlined className={styles.shortcutIcon} />
            <span>Nhập kho</span>
          </button>
          <button className={styles.shortcutBtn} onClick={() => history.push('/quan-tri/quan-ly-mon')}>
            <AppstoreOutlined className={styles.shortcutIcon} />
            <span>Quản lý món</span>
          </button>
          <button className={styles.shortcutBtn} onClick={() => history.push('/quan-tri/nhan-vien')}>
            <TeamOutlined className={styles.shortcutIcon} />
            <span>Nhân viên</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default TacNghiepView;
