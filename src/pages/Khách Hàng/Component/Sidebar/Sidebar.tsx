import React from 'react';
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  ShoppingCart,
  User,
  Utensils,
} from 'lucide-react';
import './Sidebar.less';
import { defaultUser } from '@/services/Khách hàng/Sidebar';
import { useModel, history } from 'umi';

const Sidebar: React.FC = () => {
  const { page, setPage, isSidebarOpen, setIsSidebarOpen } = useModel('Khách Hàng.global');
  const { currentUser } = useModel('Khách Hàng.user');
  const { cart, setCartOpen } = useModel('Khách Hàng.Thực đơn.index');
  const { unreadCount, setIsNotificationOpen } = useModel('Khách Hàng.Notifications');

  const user = currentUser || defaultUser;
  const cartQty = cart.reduce((sum: number, item: any) => sum + item.qty, 0);

  const closeSidebar = () => setIsSidebarOpen(false);

  const orderItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: <Home size={17} />,
      active: page === 'home',
      onClick: () => setPage('home'),
    },
    {
      id: 'menu',
      label: 'Thực đơn',
      icon: <Utensils size={17} />,
      active: page === 'menu',
      onClick: () => setPage('menu'),
    },
    {
      id: 'cart',
      label: 'Giỏ hàng',
      icon: <ShoppingCart size={17} />,
      badge: cartQty > 0 ? cartQty : undefined,
      badgeTone: 'green' as const,
      onClick: () => setCartOpen(true),
    },
    {
      id: 'history',
      label: 'Đơn hàng',
      icon: <ClipboardList size={17} />,
      active: page === 'history',
      onClick: () => setPage('history'),
    },
  ];

  const otherItems = [
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: <Bell size={17} />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeTone: 'red' as const,
      onClick: () => setIsNotificationOpen(true),
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings size={17} />,
      active: page === 'settings',
      onClick: () => setPage('settings'),
    },
    {
      id: 'help',
      label: 'Trợ giúp',
      icon: <HelpCircle size={17} />,
      onClick: () => history.push('/lien-he'),
    },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <img src="/logo.webp" alt="Logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">Căng tin</div>
              <div className="brand-sub">Doanh nghiệp</div>
            </div>
          </div>

          <button className="role-card" onClick={closeSidebar}>
            <div className="role-left">
              <div className="role-avatar">
                <User size={19} />
              </div>
              <div>
                <p>Người dùng</p>
                <span>Nhân viên</span>
              </div>
            </div>
            <ChevronDown size={17} />
          </button>

          <SidebarSection >
            {orderItems.map((item) => (
              <SidebarItem
                key={item.id}
                active={item.active}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                badgeTone={item.badgeTone}
                onClick={() => {
                  item.onClick();
                  closeSidebar();
                }}
              />
            ))}
          </SidebarSection>

          <div className="sidebar-divider" />

          <SidebarSection title="Khác">
            {otherItems.map((item) => (
              <SidebarItem
                key={item.id}
                active={item.active}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                badgeTone={item.badgeTone}
                onClick={() => {
                  item.onClick();
                  closeSidebar();
                }}
              />
            ))}
          </SidebarSection>
        </div>

        <div className="sidebar-bottom">
          <div className="reward-card">
            <div className="reward-icon">
              <Gift size={28} />
            </div>
            <p>Điểm thưởng</p>
            <h3>1.250 điểm</h3>
            <span>Bạn còn <strong>250 điểm</strong> sẽ lên hạng Bạc</span>
            <div className="reward-progress">
              <div />
            </div>
          </div>

          <div className="user-pill">
            <div className="avatar">
              {user.avatar && user.avatar.length > 2 ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                user.avatar || 'U'
              )}
            </div>
            <div className="meta">
              <span className="name">{user.name}</span>
              <span className="role">{user.dept}</span>
            </div>
            <button className="logout-btn" onClick={() => history.push('/')} aria-label="Đăng xuất">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => (
  <nav className="nav-section">
    {title && <div className="nav-label">{title}</div>}
    <div className="nav-list">{children}</div>
  </nav>
);

interface SidebarItemProps {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeTone?: 'green' | 'red';
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  active,
  icon,
  label,
  badge,
  badgeTone = 'green',
  onClick,
}) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="nav-item-main">
      <span className="nav-icon">{icon}</span>
      <span className="nav-text">{label}</span>
    </span>
    {badge !== undefined && (
      <span className={`badge badge-${badgeTone}`}>{badge}</span>
    )}
  </button>
);

export default Sidebar;
