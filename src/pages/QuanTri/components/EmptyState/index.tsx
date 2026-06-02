import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

type EmptyKind = 'orders' | 'menu' | 'users' | 'inventory' | 'search' | 'staff' | 'customers';

interface EmptyStateProps {
  kind?: EmptyKind;
  title?: string;
  desc?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ILLUSTRATIONS: Record<EmptyKind, React.ReactNode> = {
  orders: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="15" width="80" height="60" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <rect x="32" y="28" width="40" height="5" rx="2.5" fill="#86efac"/>
      <rect x="32" y="40" width="56" height="5" rx="2.5" fill="#bbf7d0"/>
      <rect x="32" y="52" width="30" height="5" rx="2.5" fill="#bbf7d0"/>
      <circle cx="90" cy="62" r="14" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
      <path d="M84 62l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="45" r="28" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <path d="M52 38c0-4 4-7 8-7s8 3 8 7" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
      <path d="M48 45h24M52 52h16" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="60" cy="45" r="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5"/>
      <path d="M42 20l-6-6M78 20l6-6M42 70l-6 6M78 70l6 6" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="32" r="14" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
      <path d="M60 26v12M54 32h12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M34 72c0-14.4 11.6-26 26-26h0c14.4 0 26 11.6 26 26" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="38" cy="40" r="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <circle cx="82" cy="40" r="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
    </svg>
  ),
  staff: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="60" height="50" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <circle cx="60" cy="38" r="10" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
      <path d="M44 62c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M72 28l6-6M72 28h-6M72 28v-6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="30" width="70" height="45" rx="6" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <path d="M25 42h70" stroke="#bbf7d0" strokeWidth="1.5"/>
      <path d="M55 18l5-5 5 5" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M60 13v17" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="35" y="50" width="18" height="8" rx="3" fill="#dcfce7"/>
      <rect x="35" y="62" width="30" height="6" rx="3" fill="#dcfce7"/>
      <rect x="67" y="50" width="18" height="18" rx="3" fill="#bbf7d0"/>
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="46" cy="38" r="12" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
      <circle cx="74" cy="38" r="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <path d="M28 70c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M56 70c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="42" r="22" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
      <path d="M68 58l16 16" stroke="#bbf7d0" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 42h16M52 34v16" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="52" cy="42" r="8" fill="#dcfce7"/>
    </svg>
  ),
};

const DEFAULT_CONTENT: Record<EmptyKind, { title: string; desc: string }> = {
  orders:    { title: 'Chưa có đơn hàng nào',      desc: 'Đơn hàng sẽ xuất hiện ở đây khi khách đặt.' },
  menu:      { title: 'Chưa có món nào',            desc: 'Thêm món ăn đầu tiên vào thực đơn.' },
  users:     { title: 'Chưa có người dùng',         desc: 'Danh sách người dùng sẽ hiển thị ở đây.' },
  staff:     { title: 'Chưa có nhân viên nào',      desc: 'Thêm nhân viên đầu tiên vào hệ thống.' },
  inventory: { title: 'Kho nguyên liệu trống',      desc: 'Thêm nguyên liệu để bắt đầu quản lý kho.' },
  customers: { title: 'Chưa có khách hàng nào',     desc: 'KhachHang sẽ xuất hiện sau khi đặt đơn.' },
  search:    { title: 'Không tìm thấy kết quả',     desc: 'Thử thay đổi từ khoá hoặc bộ lọc.' },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  kind = 'search',
  title,
  desc,
  action,
}) => {
  const defaults = DEFAULT_CONTENT[kind];
  return (
    <div className={styles.wrap}>
      <div className={styles.illus}>{ILLUSTRATIONS[kind]}</div>
      <div className={styles.title}>{title ?? defaults.title}</div>
      <div className={styles.desc}>{desc ?? defaults.desc}</div>
      {action && (
        <Button type="primary" className={styles.action} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
