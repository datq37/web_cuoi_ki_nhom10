import {
  ArrowRightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { COT_CONFIG, fmt } from '@/models/Quản Trị/Tổng Quan';
import type { DonTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import styles from './index.less';

interface OrderTableProps {
  orders: DonTrucTiep[];
  selectedRows: string[];
  setSelectedRows: (keys: string[]) => void;
  onRowClick: (order: DonTrucTiep) => void;
  cancelledIds: Set<string>;
}

const HUY_CFG = { tieuDe: 'Đã huỷ', mau: '#6b7280', bgLight: '#f3f4f6' };

const getStatusCfg = (trangThai: ETrangThaiTrucTiep, cancelled: boolean) =>
  cancelled ? HUY_CFG : COT_CONFIG[trangThai];

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedRows,
  setSelectedRows,
  onRowClick,
  cancelledIds,
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
      render: (_: any, r: DonTrucTiep) => (
        <div className={styles.khachCell}>
          <Avatar
            size={32}
            style={{
              background: r.khachHang.mauNen,
              color: r.khachHang.mauChu,
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {r.khachHang.vietTat}
          </Avatar>
          <span className={styles.tenKH}>{r.khachHang.ten}</span>
        </div>
      ),
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
        const statusKey = isCancelled ? 'huy' : r.trangThai;
        return (
          <span
            className={styles.statusTag}
            data-status={statusKey}
            style={{ color: cfg.mau }}
          >
            <span className={styles.statusDot} style={{ background: cfg.mau }} />
            {cfg.tieuDe}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'arrow',
      width: 36,
      render: () => <ArrowRightOutlined className={styles.chevron} />,
    },
  ];

  return (
    <Table
      className={styles.orderTable}
      rowKey="maDon"
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: (keys) => setSelectedRows(keys as string[]),
      }}
      columns={columns}
      dataSource={orders}
      pagination={{
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} đơn`,
        showSizeChanger: false,
        size: 'small',
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
      locale={{ emptyText: 'Không có đơn hàng nào' }}
    />
  );
};

export default OrderTable;
