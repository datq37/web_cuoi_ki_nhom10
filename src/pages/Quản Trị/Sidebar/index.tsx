import {
  AppstoreOutlined,
  BarChartOutlined,
  InboxOutlined,
  LeftOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Input } from 'antd';
import React from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

const MENU_QUAN_LY = [
  { key: '/quan-tri/tong-quan', icon: <AppstoreOutlined />, label: 'Tổng quan' },
  { key: '/quan-tri/don-hang', icon: <ShoppingCartOutlined />, label: 'Đơn hàng', badge: 5 },
  { key: '/quan-tri/quan-ly-mon', icon: <UnorderedListOutlined />, label: 'Quản lý món' },
  { key: '/quan-tri/kho-nguyen-lieu', icon: <InboxOutlined />, label: 'Kho nguyên liệu' },
  { key: '/quan-tri/khuyen-mai', icon: <TagOutlined />, label: 'Khuyến mãi' },
  { key: '/quan-tri/nguoi-dung', icon: <TeamOutlined />, label: 'Người dùng' },
  { key: '/quan-tri/bao-cao', icon: <BarChartOutlined />, label: 'Báo cáo' },
];

const MENU_KHAC = [
  { key: '/quan-tri/cai-dat', icon: <SettingOutlined />, label: 'Cài đặt' },
  { key: '/quan-tri/ho-tro', icon: <QuestionCircleOutlined />, label: 'Trung tâm hỗ trợ', hasArrow: true },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNav = (path: string) => history.push(path);

  return (
    <aside className={styles.sidebar}>
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
            <span className={styles.brandSub}>Admin · Tòa nhà A</span>
          </div>
        </div>
        <button className={styles.collapseBtn} aria-label="Thu gọn menu">
          <LeftOutlined />
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchSection}>
        <Input
          prefix={<SearchOutlined className={styles.searchIcon} />}
          placeholder="Tìm kiếm menu..."
          suffix={<span className={styles.searchShortcut}>⌘K</span>}
          className={styles.searchInput}
          readOnly
        />
      </div>

      {/* Menu chính */}
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
              {item.badge && <Badge count={item.badge} className={styles.badge} />}
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
              {item.hasArrow && <RightOutlined className={styles.menuArrow} />}
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
          <RightOutlined className={styles.userArrow} />
        </div>
        <button className={styles.logoutBtn}>
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
