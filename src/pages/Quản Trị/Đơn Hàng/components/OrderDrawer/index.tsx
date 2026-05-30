import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  MoreOutlined,
  PhoneOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer } from 'antd';
import React, { useRef } from 'react';
import { COT_CONFIG, GHI_CHU_CONFIG, fmt } from '@/models/Quản Trị/Tổng Quan';
import type { DonTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import styles from './index.less';

interface OrderDrawerProps {
  order: DonTrucTiep | null;
  cancelledIds: Set<string>;
  onClose: () => void;
  onMoveStatus: (maDon: string, newStatus: ETrangThaiTrucTiep | 'da_huy') => void;
  onCancel: (maDon: string) => void;
  onPrint: (order: DonTrucTiep) => void;
}

const STEP_MAP: Record<ETrangThaiTrucTiep, number> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]: 0,
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: 1,
  [ETrangThaiTrucTiep.SAN_SANG]: 2,
  [ETrangThaiTrucTiep.HOAN_THANH]: 3,
};

const STEPS = ['Đặt hàng', 'Chế biến', 'Sẵn sàng', 'Hoàn thành'];

const NEXT_ACTION: Partial<
  Record<ETrangThaiTrucTiep, { label: string; next: ETrangThaiTrucTiep }>
> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]: {
    label: 'Xác nhận & chế biến',
    next: ETrangThaiTrucTiep.DANG_CHE_BIEN,
  },
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: {
    label: 'Hoàn tất chế biến',
    next: ETrangThaiTrucTiep.SAN_SANG,
  },
  [ETrangThaiTrucTiep.SAN_SANG]: {
    label: 'Đã giao xong',
    next: ETrangThaiTrucTiep.HOAN_THANH,
  },
};

const HUY_CFG = { tieuDe: 'Đã huỷ', mau: '#6b7280', bgLight: '#f3f4f6' };

interface ContentProps {
  order: DonTrucTiep;
  cancelledIds: Set<string>;
  onClose: () => void;
  onMoveStatus: (maDon: string, newStatus: ETrangThaiTrucTiep | 'da_huy') => void;
  onCancel: (maDon: string) => void;
  onPrint: (order: DonTrucTiep) => void;
}

const DrawerContent: React.FC<ContentProps> = ({
  order,
  cancelledIds,
  onClose,
  onMoveStatus,
  onCancel,
  onPrint,
}) => {
  const isCancelled = cancelledIds.has(order.maDon);
  const cfg = isCancelled ? HUY_CFG : (COT_CONFIG[order.trangThai as ETrangThaiTrucTiep] || COT_CONFIG['cho_xac_nhan']);
  const currentStep = STEP_MAP[order.trangThai as ETrangThaiTrucTiep] || 0;
  const phiPhucVu = Math.round((order.tongTien || 0) * 0.05);
  const tongCong = (order.tongTien || 0) + phiPhucVu;

  return (
    <>
      <div className={styles.statusRow}>
        <span
          className={styles.statusBadge}
          data-status={isCancelled ? 'huy' : order.trangThai}
          style={{ color: cfg.mau }}
        >
          <span className={styles.statusDot} style={{ background: cfg.mau }} />
          {cfg.tieuDe}
        </span>
        <span className={styles.thoiGianDon}>
          <ClockCircleOutlined style={{ marginRight: 4, fontSize: 12 }} />
          {order.thoiGian || 'Vừa xong'}
        </span>
      </div>
      {!isCancelled && (
        <div className={styles.stepsWrap}>
          {STEPS.map((label, idx) => (
            <div key={idx} className={styles.stepItem}>
              <div
                className={`${styles.stepDot} ${
                  idx < currentStep
                    ? styles.stepDone
                    : idx === currentStep
                    ? styles.stepActive
                    : styles.stepPending
                }`}
              >
                {idx < currentStep ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9 10 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className={styles.stepNum}>{idx + 1}</span>
                )}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  idx === currentStep ? styles.stepLabelActive : ''
                }`}
              >
                {label}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={`${styles.stepLine} ${
                    idx < currentStep ? styles.stepLineDone : ''
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.divider} />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Khách hàng</div>
        <div className={styles.customerCard}>
          <Avatar
            size={44}
            style={{
              background: order.khachHang?.mauNen || '#e5e7eb',
              color: order.khachHang?.mauChu || '#374151',
              fontWeight: 700,
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {order.khachHang?.vietTat || 'KH'}
          </Avatar>
          <div className={styles.customerInfo}>
            <div className={styles.customerName}>{order.khachHang?.ten || 'Khách hàng'}</div>
            <div className={styles.customerSub}>Khách hàng căng tin</div>
          </div>
          <div className={styles.customerBtns}>
            <button className={styles.contactBtn} title="Nhắn tin">
              <MessageOutlined />
            </button>
            <button className={styles.contactBtn} title="Gọi điện">
              <PhoneOutlined />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.divider} />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Món ăn
          <span className={styles.sectionCount}>{(order.monAn || []).length} món</span>
        </div>
        <div className={styles.itemList}>
          {(order.monAn || []).map((m, i) => (
            <div key={i} className={styles.itemRow}>
              <div
                className={styles.itemAvatar}
                style={{ background: order.khachHang?.mauNen || '#e5e7eb' }}
              >
                🍽️
              </div>
              <span className={styles.itemName}>{m.ten}</span>
              <span className={styles.itemQty}>×{m.soLuong}</span>
            </div>
          ))}
        </div>
      </div>
      {order.ghiChu && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Ghi chú</div>
            <div className={styles.noteBox}>
              <MessageOutlined className={styles.noteIcon} />
              <span className={styles.noteText}>{order.ghiChu}</span>
              {order.loaiGhiChu && (() => {
                const gc = GHI_CHU_CONFIG[order.loaiGhiChu!];
                return (
                  <span className={styles.gcTag} data-ghichu={order.loaiGhiChu!} style={{ color: gc.mau }}>
                    {gc.label}
                  </span>
                );
              })()}
            </div>
          </div>
        </>
      )}

      <div className={styles.divider} />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Chi tiết thanh toán</div>
        <div className={styles.priceList}>
          <div className={styles.priceRow}>
            <span>Tạm tính</span>
            <span>{fmt(order.tongTien)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Phí phục vụ (5%)</span>
            <span>{fmt(phiPhucVu)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Giảm giá</span>
            <span className={styles.discount}>— 0đ</span>
          </div>
        </div>
        <div className={styles.priceDivider} />
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Tổng cộng</span>
          <span className={styles.totalValue}>{fmt(tongCong)}</span>
        </div>
        <div className={styles.paymentRow}>
          <span className={styles.payIcon}>💳</span>
          <span className={styles.payLabel}>Thanh toán khi nhận hàng</span>
        </div>
      </div>

    </>
  );
};

const OrderDrawer: React.FC<OrderDrawerProps> = ({
  order,
  cancelledIds,
  onClose,
  onMoveStatus,
  onCancel,
  onPrint,
}) => {
  // Keep last order to render during close animation
  const lastOrderRef = useRef<DonTrucTiep | null>(null);
  if (order) lastOrderRef.current = order;
  const displayOrder = lastOrderRef.current;

  const isCancelled = displayOrder ? cancelledIds.has(displayOrder.maDon) : false;
  const isDone = displayOrder?.trangThai === ETrangThaiTrucTiep.HOAN_THANH;
  const nextAction = displayOrder && !isCancelled
    ? NEXT_ACTION[displayOrder.trangThai]
    : null;

  return (
    <Drawer
      visible={!!order}
      onClose={onClose}
      placement="right"
      width={520}
      closable={false}
      className={styles.orderDrawer}
      title={
        <div className={styles.drawerHeader}>
          <button className={styles.backBtn} onClick={onClose}>
            <ArrowLeftOutlined />
          </button>
          <div className={styles.headerMid}>
            <span className={styles.headerLabel}>Đơn hàng</span>
            <span className={styles.headerMaDon}>{displayOrder?.maDon}</span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              title="In phiếu"
              onClick={() => displayOrder && onPrint(displayOrder)}
            >
              <PrinterOutlined />
            </button>
            <button className={styles.iconBtn} title="Thêm">
              <MoreOutlined />
            </button>
          </div>
        </div>
      }
      footer={
        <div className={styles.drawerFooter}>
          {!isCancelled && !isDone && displayOrder && (
            <Button danger ghost onClick={() => onCancel(displayOrder.maDon)}>
              Huỷ đơn
            </Button>
          )}
          <div className={styles.footerRight}>
            {isCancelled || isDone ? (
              <Button type="primary" onClick={onClose}>
                Đóng
              </Button>
            ) : nextAction && displayOrder ? (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onMoveStatus(displayOrder.maDon, nextAction.next)}
              >
                {nextAction.label}
              </Button>
            ) : null}
          </div>
        </div>
      }
      bodyStyle={{ padding: 0, overflowY: 'auto' }}
      headerStyle={{ padding: 0, borderBottom: '1px solid #f0f0f0' }}
      footerStyle={{ padding: '12px 20px' }}
    >
      <div className={styles.drawerBody}>
        {displayOrder && (
          <DrawerContent
            order={displayOrder}
            cancelledIds={cancelledIds}
            onClose={onClose}
            onMoveStatus={onMoveStatus}
            onCancel={onCancel}
            onPrint={onPrint}
          />
        )}
      </div>
    </Drawer>
  );
};

export default OrderDrawer;
