import {
  DashboardOutlined,
  HomeOutlined,
  InboxOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

const ForkKnifeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 3v4c0 1.1-.9 2-2 2h-1v12h-2V9h-1c-1.1 0-2-.9-2-2V3h2v3h1V3h2v3h1V3h2zM8 3H6C4.9 3 4 3.9 4 5v6c0 1.1.9 2 2 2h1v8h2V3z" />
  </svg>
);

const MENU_QUAN_LY = [
  { key: '/quan-tri/tong-quan',      icon: <DashboardOutlined />,    label: 'Tổng quan' },
  { key: '/quan-tri/don-hang',       icon: <ShoppingCartOutlined />, label: 'Đơn hàng', badge: 5 },
  { key: '/quan-tri/quan-ly-mon',    icon: <ForkKnifeIcon />,        label: 'Quản lý món' },
  { key: '/quan-tri/kho-nguyen-lieu',icon: <InboxOutlined />,        label: 'Kho nguyên liệu' },
  { key: '/quan-tri/khuyen-mai',     icon: <TagOutlined />,          label: 'Khuyến mãi' },
  { key: '/quan-tri/khach-hang',     icon: <UserOutlined />,         label: 'Khách hàng' },
  { key: '/quan-tri/nhan-vien',      icon: <TeamOutlined />,         label: 'Nhân viên căng tin' },
  { key: '/quan-tri/co-so-vat-chat', icon: <HomeOutlined />,          label: 'Cơ sở vật chất' },
];

const MENU_KHAC = [
  { key: '/quan-tri/cai-dat', icon: <SettingOutlined />, label: 'Cài đặt' },
];

const COLLAPSED_W = '64px';
const EXPANDED_W  = '260px';

const Sidebar: React.FC = () => {
  const location    = useLocation();
  const currentPath = location.pathname;

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebar-collapsed') === 'true'; } catch { return false; }
  });

  const handleNav = (path: string) => history.push(path);

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('sidebar-collapsed', String(next)); } catch {}
    document.querySelectorAll<HTMLElement>('[class*="mainContent"]').forEach((el) => {
      el.style.marginLeft = next ? COLLAPSED_W : EXPANDED_W;
    });
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 8z" fill="white" />
            </svg>
          </div>
          {!collapsed && (
            <div className={styles.logoText}>
              <span className={styles.brandName}>Căng tin</span>
              <span className={styles.brandSub}>Admin · Toà nhà A</span>
            </div>
          )}
        </div>
      </div>

      <nav className={styles.menuSection}>
        {!collapsed && <span className={styles.groupLabel}>QUẢN LÝ</span>}
        <ul className={styles.menuList}>
          {MENU_QUAN_LY.map((item) => (
            <li
              key={item.key}
              className={`${styles.menuItem} ${currentPath.startsWith(item.key) ? styles.active : ''}`}
              onClick={() => handleNav(item.key)}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
              {item.badge && !collapsed && <Badge count={item.badge} className={styles.badge} />}
              {item.badge && collapsed && <span className={styles.badgeDot} />}
            </li>
          ))}
        </ul>

        {!collapsed && <span className={styles.groupLabel}>KHÁC</span>}
        <ul className={styles.menuList}>
          {MENU_KHAC.map((item) => (
            <li
              key={item.key}
              className={`${styles.menuItem} ${currentPath.startsWith(item.key) ? styles.active : ''}`}
              onClick={() => handleNav(item.key)}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.collapseSection}>
        <button className={styles.collapseBtn} onClick={handleCollapse}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
          {!collapsed && <span>Thu gọn</span>}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
