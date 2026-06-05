import React, { useState } from 'react';
import {
  ChevronDown,
  ClipboardList,
  Award,
  Home,
  Settings,
  ShoppingCart,
  User,
  Utensils,
} from 'lucide-react';
import './Sidebar.less';
import { defaultUser } from '@/services/KhachHang/Component/Sidebar';
import { SidebarSectionProps, SidebarItemProps } from '@/services/KhachHang/Component/Sidebar/typing';
import RankCard from '../Hạng khách hàng';
import { formatNumberViVN } from '@/utils/format';
import { useModel } from 'umi';

const Sidebar: React.FC = () => {
  const { page, setPage, isSidebarOpen, setIsSidebarOpen } = useModel('KhachHang.GlobalState.index');
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const { currentUser } = useModel('KhachHang.Tài Khoản.thanghang');
  const { cart, setCartOpen } = useModel('KhachHang.ThucDon.index');

  const user = currentUser || defaultUser;
  const cartQty = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
  const isExpanded = isSidebarOpen || isHoverOpen;

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
      label: 'Thực Đơn',
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
      active: page === 'history' || page === 'qr-payment',
      onClick: () => setPage('history'),
    },
  ];

  const otherItems = [
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings size={17} />,
      active: page === 'settings',
      onClick: () => setPage('settings'),
    },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside
        className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsHoverOpen(true)}
        onMouseLeave={() => setIsHoverOpen(false)}
      >
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
          <RankCard />

        </div>
      </aside>
    </>
  );
};

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <nav className="nav-section">
      {title && <div className="nav-label">{title}</div>}
      <div className="nav-list">{children}</div>
    </nav>
  );
}

function SidebarItem({
  active,
  icon,
  label,
  badge,
  badgeTone = 'green',
  onClick,
}: SidebarItemProps) {
  return (
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
}

export default Sidebar;
