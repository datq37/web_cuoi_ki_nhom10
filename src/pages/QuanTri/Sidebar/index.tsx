import {
  DashboardOutlined,
  CommentOutlined,
  HomeOutlined,
  InboxOutlined,
  RightOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import React, { useMemo } from 'react';
import { history, useLocation } from 'umi';
import { useNotif } from '@/context/NotifContext';
import { useCanteenInfo } from '@/hooks/useCanteenInfo';
import styles from './index.less';

const ForkKnifeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 3v4c0 1.1-.9 2-2 2h-1v12h-2V9h-1c-1.1 0-2-.9-2-2V3h2v3h1V3h2v3h1V3h2zM8 3H6C4.9 3 4 3.9 4 5v6c0 1.1.9 2 2 2h1v8h2V3z" />
  </svg>
);

const MENU_QUAN_LY = [
  { key: '/quan-tri/tong-quan',      icon: <DashboardOutlined />,    label: 'Tổng quan' },
  { key: '/quan-tri/don-hang',       icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
  { key: '/quan-tri/quan-ly-mon',    icon: <ForkKnifeIcon />,        label: 'Quản lý món' },
  { key: '/quan-tri/kho-nguyen-lieu',icon: <InboxOutlined />,        label: 'Kho nguyên liệu' },
  { key: '/quan-tri/khuyen-mai',     icon: <TagOutlined />,          label: 'Khuyến mãi' },
  { key: '/quan-tri/khach-hang',     icon: <UserOutlined />,         label: 'KhachHang' },
  { key: '/quan-tri/danh-gia',       icon: <CommentOutlined />,      label: 'Đánh giá' },
  { key: '/quan-tri/nhan-vien',      icon: <TeamOutlined />,         label: 'Nhân viên căng tin' },
  { key: '/quan-tri/co-so-vat-chat', icon: <HomeOutlined />,          label: 'Cơ sở vật chất' },
];

const MENU_KHAC = [
  { key: '/quan-tri/cai-dat', icon: <SettingOutlined />, label: 'Cài đặt' },
];

const Sidebar: React.FC<{ expanded: boolean; setExpanded: (val: boolean) => void }> = ({ expanded, setExpanded }) => {
  const location    = useLocation();
  const currentPath = location.pathname;
  const { notifs }  = useNotif();
  const canteen     = useCanteenInfo();

  const badgeMap = useMemo<Record<string, number>>(() => ({
    '/quan-tri/don-hang': notifs.filter((n) => n.type === 'order_pending' && !n.read).length,
  }), [notifs]);

  const collapsed = !expanded;

  const handleNav = (path: string) => history.push(path);

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >

      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <img src={canteen.logo} alt={canteen.ten} className={styles.logoIcon} />
          {!collapsed && (
            <div className={styles.logoText}>
              <span className={styles.brandName}>{canteen.ten}</span>
              <span className={styles.brandSub}>Doanh nghiệp</span>
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
              {(badgeMap[item.key] ?? 0) > 0 && !collapsed && (
                <Badge count={badgeMap[item.key]} className={styles.badge} />
              )}
              {(badgeMap[item.key] ?? 0) > 0 && collapsed && (
                <span className={styles.badgeCollapsed}>
                  {badgeMap[item.key] > 9 ? '9+' : badgeMap[item.key]}
                </span>
              )}
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

    </aside>
  );
};

export default Sidebar;
