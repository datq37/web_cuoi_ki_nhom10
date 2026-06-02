import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import styles from './index.less';

interface PageToolbarProps {
  /** Ô tìm kiếm — bỏ qua nếu undefined */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (v: string) => void;
  /** Các filter/bộ lọc nằm cụm trái sau search */
  filters?: React.ReactNode;
  /** Nút action nằm cụm phải (view toggle, nút phụ, nút primary) */
  actions?: React.ReactNode;
}

const PageToolbar: React.FC<PageToolbarProps> = ({
  searchPlaceholder = 'Tìm kiếm...',
  searchValue,
  onSearch,
  filters,
  actions,
}) => (
  <div className={styles.toolbar}>
    {onSearch !== undefined && (
      <Input
        prefix={<SearchOutlined className={styles.searchIcon} />}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className={styles.search}
        allowClear
      />
    )}
    {filters}
    {actions && <div className={styles.right}>{actions}</div>}
  </div>
);

export default PageToolbar;
