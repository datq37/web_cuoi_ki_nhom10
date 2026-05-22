import {
  AppstoreOutlined,
  InboxOutlined,
  LeftOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import React from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

// Fork+knife SVG vì AntD không có icon utensils
const ForkKnifeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 3v4c0 1.1-.9 2-2 2h-1v12h-2V9h-1c-1.1 0-2-.9-2-2V3h2v3h1V3h2v3h1V3h2zM8 3H6C4.9 3 4 3.9 4 5v6c0 1.1.9 2 2 2h1v8h2V3z" />
  </svg>
);

const MENU_QUAN_LY = [
  { key: '/quan-tri/tong-quan',    icon: <AppstoreOutlined />,   label: 'Tổng quan' },
  { key: '/quan-tri/don-hang',     icon: <ShoppingOutlined />,   label: 'Đơn hàng', badge: 5 },
  { key: '/quan-tri/quan-ly-mon',  icon: <ForkKnifeIcon />,      label: 'Quản lý món' },
  { key: '/quan-tri/kho-nguyen-lieu', icon: <InboxOutlined />,   label: 'Kho nguyên liệu' },
  { key: '/quan-tri/khuyen-mai',   icon: <TagOutlined />,        label: 'Khuyến mãi' },
  { key: '/quan-tri/khach-hang',    icon: <UserOutlined />,       label: 'Khách hàng' },
  { key: '/quan-tri/nhan-vien',    icon: <UserSwitchOutlined />, label: 'Nhân viên căng tin' },
];

const MENU_KHAC = [
  { key: '/quan-tri/cai-dat', icon: <SettingOutlined />, label: 'Cài đặt' },
];

const Sidebar: React.FC = () => {
  const location  = useLocation();
  const currentPath = location.pathname;

  const handleNav = (path: string) => history.push(path);

  return (
    <aside className={styles.sidebar}>
      {/* Reload icon */}
      <div className={styles.reloadRow}>
        <button className={styles.reloadBtn} title="Tải lại">
          <ReloadOutlined />
        </button>
      </div>

      {/* Logo */}
      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 8z" fill="white" />
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.brandName}>Căng tin</span>
            <span className={styles.brandSub}>Admin · Toà nhà A</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <SearchOutlined className={styles.searchIcon} />
          <span className={styles.searchPlaceholder}>Tìm kiếm...</span>
          <span className={styles.searchShortcut}>⌘K</span>
        </div>
      </div>

      {/* Menu */}
      <nav className={styles.menuSection}>
        <span className={styles.groupLabel}>QUẢN LÝ</span>
        <ul className={styles.menuList}>
          {MENU_QUAN_LY.map((item) => (
            <li
              key={item.key}
              className={`${styles.menuItem} ${currentPath.startsWith(item.key) ? styles.active : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
              {item.badge && (
                <Badge count={item.badge} className={styles.badge} />
              )}
            </li>
          ))}
        </ul>

        <span className={styles.groupLabel}>KHÁC</span>
        <ul className={styles.menuList}>
          {MENU_KHAC.map((item) => (
            <li
              key={item.key}
              className={`${styles.menuItem} ${currentPath.startsWith(item.key) ? styles.active : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className={styles.userSection}>
        <div className={styles.userCard}>
          <Avatar className={styles.userAvatar} size={36}>MT</Avatar>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Nguyễn Minh Tâm</span>
            <span className={styles.userRole}>Quản trị viên</span>
          </div>
          <button className={styles.logoutBtn} title="Đăng xuất">
            <LogoutOutlined />
          </button>
        </div>

        <button className={styles.collapseBtn}>
          <LeftOutlined />
          <LeftOutlined />
          <span>Thu gọn</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
