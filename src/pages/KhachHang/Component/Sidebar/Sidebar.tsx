import React from 'react';
import {
  Bell,
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
import { formatNumberViVN } from '@/utils/format';
import { useModel, history } from 'umi';

const Sidebar: React.FC = () => {
  const { page, setPage, isSidebarOpen, setIsSidebarOpen } = useModel('KhachHang.GlobalState.index');
  const { currentUser } = useModel('KhachHang.Tài Khoản.thanghang');
  const { cart, setCartOpen } = useModel('KhachHang.ThucDon.index');
  const { unreadCount, setIsNotificationOpen } = useModel('KhachHang.Thông Báo.index');

  const user = currentUser || defaultUser;
  const cartQty = cart.reduce((sum: number, item: any) => sum + item.qty, 0);

  const closeSidebar = () => setIsSidebarOpen(false);

  // tính điểm và hạng
  // import động
  // các mức rank
  const RANKS = [
    { name: 'Đồng', min: 0, mult: 1, color: '#cd7f32' },
    { name: 'Bạc', min: 1000000, mult: 1.2, color: '#c0c0c0' },
    { name: 'Vàng', min: 3000000, mult: 1.5, color: '#ffd700' },
    { name: 'Kim Cương', min: 10000000, mult: 2, color: '#b9f2ff' }
  ];

  const currentSpent = user.totalSpent || 0;
  const currentPoints = Math.floor(Number(user.points) || 0);
  let nextRank = RANKS[RANKS.length - 1]; // Giả định là max rank
  let currentRank = RANKS[0];
  let isMaxRank = true;

  for (let i = 0; i < RANKS.length; i++) {
    if (currentSpent < RANKS[i].min) {
      nextRank = RANKS[i];
      currentRank = RANKS[i - 1] || RANKS[0];
      isMaxRank = false;
      break;
    }
  }

  // tính progress
  // hiển thị điểm lên hạng
  // quy đổi điểm
  const spentNeeded = nextRank.min - currentSpent;
  const progressPercent = isMaxRank ? 100 : ((currentSpent - currentRank.min) / (nextRank.min - currentRank.min)) * 100;
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
      label: 'ThucDon',
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
            <div className="reward-icon" style={{ background: currentRank.color, color: '#fff' }}>
              <Award size={28} />
            </div>
            <p>Điểm thưởng ({currentRank.name})</p>
            <h3>{formatNumberViVN(currentPoints)} điểm</h3>
            {isMaxRank ? (
              <span>Bạn đang ở hạng cao nhất!</span>
            ) : (
              <span>Cần thêm <strong>{formatNumberViVN(spentNeeded)}đ</strong> chi tiêu để lên hạng {nextRank.name}</span>
            )}
            <div className="reward-progress">
              <div style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%`, background: nextRank.color }} />
            </div>
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

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <nav className="nav-section">
      {title && <div className="nav-label">{title}</div>}
      <div className="nav-list">{children}</div>
    </nav>
  );
}

interface SidebarItemProps {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeTone?: 'green' | 'red';
  onClick: () => void;
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
