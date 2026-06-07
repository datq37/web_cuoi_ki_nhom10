import {
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { COT_CONFIG, fmt } from '@/models/QuanTri/Tổng Quan';
import type { DonTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/QuanTri/Tổng Quan/typing';
import styles from './index.less';

interface OrderTableProps {
  orders: DonTrucTiep[];
  onRowClick: (order: DonTrucTiep) => void;
  cancelledIds: Set<string>;
  searchValue?: string;
  onQuickConfirm?: (maDon: string) => void;
}

const HUY_CFG = { tieuDe: 'Đã huỷ', mau: '#6b7280', bgLight: '#f3f4f6' };

const normalizeStatus = (status: string): ETrangThaiTrucTiep | 'da_huy' => {
  if (status === 'pending_confirmation') return ETrangThaiTrucTiep.CHO_XAC_NHAN;
  if (status === 'processing') return ETrangThaiTrucTiep.DANG_CHE_BIEN;
  if (status === 'confirmed') return ETrangThaiTrucTiep.SAN_SANG;
  if (status === 'delivered') return ETrangThaiTrucTiep.HOAN_THANH;
  if (status === 'cancelled') return 'da_huy';
  return status as ETrangThaiTrucTiep;
};

/** Tính số phút chờ từ thoiGian "HH:mm" đến hiện tại */
function calcWaitMinutes(thoiGian: string): number {
  try {
    const [h, m] = thoiGian.split(':').map(Number);
    const now = new Date();
    const orderMin = h * 60 + m;
    const nowMin   = now.getHours() * 60 + now.getMinutes();
    return Math.max(0, nowMin - orderMin);
  } catch { return 0; }
}

const getStatusCfg = (trangThai: ETrangThaiTrucTiep, cancelled: boolean) => {
  if (cancelled) return HUY_CFG;
  const normalized = normalizeStatus(trangThai);
  if (normalized === 'da_huy') return HUY_CFG;
  return COT_CONFIG[normalized] || COT_CONFIG[ETrangThaiTrucTiep.CHO_XAC_NHAN];
};

const isUnpaidBankingOrder = (order: DonTrucTiep) =>
  order.thanhToan?.method === 'banking' && order.thanhToan?.status !== 'paid';

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onRowClick,
  cancelledIds,
  searchValue,
  onQuickConfirm,
}) => {
  const columns: ColumnsType<DonTrucTiep> = [
    {
      title: 'Mã đơn',
      dataIndex: 'maDon',
      key: 'maDon',
      width: 110,
      render: (text: string) => <span className={styles.maDonCell}>{text}</span>,
    },
    {
      title: 'Khách hàng',
      key: 'khachHang',
      render: (_: any, r: DonTrucTiep) => {
        const isCho = r.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN && !cancelledIds.has(r.maDon);
        const waitMin = isCho ? calcWaitMinutes(r.thoiGian) : 0;
        const isLate = waitMin >= 10;
        return (
          <div className={styles.khachCell}>
            <Avatar size={32} style={{ background: r.khachHang?.mauNen || '#3b82f6', color: r.khachHang?.mauChu || '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
              {r.khachHang?.vietTat || r.khachHang?.ten?.charAt(0)}
            </Avatar>
            <div>
              <span className={styles.tenKH}>{r.khachHang?.ten}</span>
              {isLate && (
                <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, marginTop: 2 }}>
                  ⏱ Chờ {waitMin} phút
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Món ăn',
      key: 'monAn',
      render: (_: any, r: DonTrucTiep) => {
        const str = r.monAn.map((m) => m.ten).join(', ');
        return (
          <span className={styles.monCell}>
            {str.length > 42 ? str.slice(0, 42) + '…' : str}
          </span>
        );
      },
    },
    {
      title: 'Tổng tiền',
      key: 'tongTien',
      width: 110,
      render: (_: any, r: DonTrucTiep) => (
        <span className={styles.tongTienCell}>{fmt(r.tongTien)}</span>
      ),
    },
    {
      title: 'Giờ đặt',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      width: 90,
      render: (t: string) => (
        <span className={styles.thoiGianCell}>
          <ClockCircleOutlined style={{ marginRight: 4, fontSize: 11 }} />
          {t}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      width: 145,
      render: (_: any, r: DonTrucTiep) => {
        const isCancelled = cancelledIds.has(r.maDon);
        const cfg = getStatusCfg(r.trangThai, isCancelled);
        const normalizedStatus = normalizeStatus(r.trangThai);
        const statusKey = isCancelled || normalizedStatus === 'da_huy' ? 'huy' : normalizedStatus;
        const label = !isCancelled && isUnpaidBankingOrder(r) ? 'Chờ CK' : cfg?.tieuDe || 'Không xác định';
        return (
          <span
            className={styles.statusTag}
            data-status={statusKey}
            style={{ color: cfg?.mau || '#000' }}
          >
            <span className={styles.statusDot} style={{ background: cfg?.mau || '#000' }} />
            {label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, r: DonTrucTiep) => {
        const isCho = r.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN && !cancelledIds.has(r.maDon);
        const isUnpaidBanking = isUnpaidBankingOrder(r);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
            {isCho && onQuickConfirm && !isUnpaidBanking && (
              <Tooltip title="Xác nhận - chuyển sang Đang chế biến">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckOutlined />}
                  style={{ borderRadius: 6, fontSize: 11, padding: '0 7px', height: 26 }}
                  onClick={() => onQuickConfirm(r.maDon)}
                />
              </Tooltip>
            )}
            <ArrowRightOutlined className={styles.chevron} />
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className={styles.orderTable}
      rowKey="maDon"
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} đơn`, showSizeChanger: false, size: 'small' }}
      onRow={(record) => ({ onClick: () => onRowClick(record), style: { cursor: 'pointer' } })}
      locale={{ emptyText: 'Không có đơn hàng nào' }}
    />
  );
};

export default OrderTable;
