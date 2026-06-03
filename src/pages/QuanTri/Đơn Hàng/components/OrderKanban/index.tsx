import { CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { COT_CONFIG, GHI_CHU_CONFIG, fmt } from '@/models/QuanTri/Tổng Quan';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import styles from './index.less';

interface OrderKanbanProps {
  orders: DonTrucTiep[];
  cancelledIds: Set<string>;
  onCardClick: (order: DonTrucTiep) => void;
  onMoveStatus: (maDon: string, newStatus: ETrangThaiTrucTiep | 'da_huy') => void;
}

const NEXT_STATUS: Partial<Record<ETrangThaiTrucTiep, ETrangThaiTrucTiep>> = {
  [ETrangThaiTrucTiep.CHO_XAC_NHAN]: ETrangThaiTrucTiep.DANG_CHE_BIEN,
  [ETrangThaiTrucTiep.DANG_CHE_BIEN]: ETrangThaiTrucTiep.SAN_SANG,
  [ETrangThaiTrucTiep.SAN_SANG]: ETrangThaiTrucTiep.HOAN_THANH,
};

const COLS: ETrangThaiTrucTiep[] = [
  ETrangThaiTrucTiep.CHO_XAC_NHAN,
  ETrangThaiTrucTiep.DANG_CHE_BIEN,
  ETrangThaiTrucTiep.SAN_SANG,
  ETrangThaiTrucTiep.HOAN_THANH,
];

const OrderKanban: React.FC<OrderKanbanProps> = ({
  orders,
  cancelledIds,
  onCardClick,
  onMoveStatus,
}) => {
  const activeOrders = orders.filter((o) => !cancelledIds.has(o.maDon));

  return (
    <div className={styles.kanbanWrap}>
      {COLS.map((col) => {
        const cfg = COT_CONFIG[col];
        const colOrders = activeOrders.filter((o) => o.trangThai === col);

        return (
          <div key={col} className={styles.kanbanCol}>
            <div className={styles.colHeader}>
              <span className={styles.colDot} style={{ background: cfg?.mau || '#000' }} />
              <span className={styles.colTitle}>{cfg?.tieuDe || 'Không rõ'}</span>
              <span
                className={styles.colBadge}
                data-col={col}
                style={{ color: cfg?.mau || '#000' }}
              >
                {colOrders.length}
              </span>
            </div>
            <div className={styles.colBody}>
              {colOrders.map((don) => {
                const nextStatus = NEXT_STATUS[don.trangThai];

                return (
                  <div
                    key={don.maDon}
                    className={styles.donCard}
                    onClick={() => onCardClick(don)}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.maDon}>{don.maDon}</span>
                      <span className={styles.thoiGian}>{don.thoiGian}</span>
                    </div>

                    <div className={styles.khachRow}>
                      <div
                        className={styles.avatar}
                        style={{
                          background: don.khachHang?.mauNen || '#3b82f6',
                          color: don.khachHang?.mauChu || '#ffffff',
                        }}
                      >
                        {don.khachHang?.vietTat || don.khachHang?.ten?.charAt(0)}
                      </div>
                      <span className={styles.tenKH}>{don.khachHang?.ten}</span>
                    </div>

                    <div className={styles.monList}>
                      {don.monAn.slice(0, 2).map((m, i) => (
                        <div key={i} className={styles.monRow}>
                          <span>• {m.ten}</span>
                          <span className={styles.soLuong}>×{m.soLuong}</span>
                        </div>
                      ))}
                      {don.monAn.length > 2 && (
                        <div className={styles.conLai}>
                          +{don.monAn.length - 2} món khác
                        </div>
                      )}
                    </div>

                    {don.loaiGhiChu && (() => {
                      const gc = GHI_CHU_CONFIG[don.loaiGhiChu!];
                      return (
                        <div
                          className={styles.ghiChuTag}
                          data-ghichu={don.loaiGhiChu!}
                          style={{ color: gc?.mau || '#000' }}
                        >
                          {gc?.label || don.loaiGhiChu}
                        </div>
                      );
                    })()}

                    <div className={styles.cardFooter}>
                      <span className={styles.tongTien}>{fmt(don.tongTien)}</span>
                      {col === ETrangThaiTrucTiep.HOAN_THANH ? (
                        <CheckCircleOutlined
                          style={{ color: '#16a34a', fontSize: 18 }}
                        />
                      ) : nextStatus ? (
                        <button
                          className={styles.actionBtn}
                          style={{ background: cfg?.actionColor || '#16a34a' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveStatus(don.maDon, nextStatus);
                          }}
                        >
                          {cfg?.actionLabel || 'Xử lý'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {colOrders.length === 0 && (
                <div className={styles.emptyCol}>
                  <span className={styles.emptyText}>Không có đơn</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderKanban;
