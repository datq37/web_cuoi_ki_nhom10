import React, { useState } from 'react';
import {
    RightOutlined,
    BulbOutlined,
    BulbFilled,
    BellOutlined,
    MenuOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { ChevronDown } from 'lucide-react';
import { Popover, Badge } from 'antd';
import './index.less';
import { history, useModel } from 'umi';
import { defaultUser } from '@/services/Khách hàng/Component/Sidebar';
import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

const OrderSuccessIcon: React.FC = () => (
    <div className="notice-illustration notice-illustration-success">
        <svg viewBox="0 0 120 120" role="img" aria-label="Đơn hàng thành công">
            <circle cx="60" cy="60" r="48" className="plate" />
            <circle cx="28" cy="28" r="2.6" className="spark spark-green" />
            <circle cx="39" cy="21" r="2" className="spark spark-yellow" />
            <circle cx="90" cy="26" r="3" className="spark spark-orange" />
            <circle cx="96" cy="52" r="2.5" className="spark spark-green" />
            <path className="bun-top" d="M34 52c4-15 17-23 34-21 17 1 29 11 31 27H34z" />
            <path className="burger-line" d="M38 56h57" />
            <path className="cheese" d="M36 61h59l-9 10-11-8-9 9-11-9-8 8z" />
            <path className="patty" d="M35 72c4-5 14-7 30-6 17 0 28 2 33 7-3 7-15 10-33 9-18 0-28-3-30-10z" />
            <path className="lettuce" d="M34 83c7-7 13 3 20-2 8-5 15 5 23 0 8-4 14 4 23 0-4 11-16 15-34 15-19 0-29-4-32-13z" />
            <path className="bun-bottom" d="M39 91h53c-4 8-13 12-27 12-13 0-22-4-26-12z" />
            <circle cx="53" cy="40" r="2" className="sesame" />
            <circle cx="66" cy="38" r="2" className="sesame" />
            <circle cx="78" cy="45" r="2" className="sesame" />
        </svg>
        <span className="notice-check-badge">
            <CheckCircleOutlined />
        </span>
    </div>
);

const DeliveryIcon: React.FC = () => (
    <div className="notice-illustration notice-illustration-delivery">
        <svg viewBox="0 0 130 120" role="img" aria-label="Đang giao hàng">
            <path className="speed-line" d="M8 42h18M16 55h14M6 70h20" />
            <circle className="wheel" cx="42" cy="88" r="12" />
            <circle className="wheel" cx="92" cy="88" r="12" />
            <path className="bike-base" d="M37 84h27l14-25h19l11 25H91l-15-22-13 22" />
            <path className="bike-seat" d="M54 54h20" />
            <path className="bike-handle" d="M94 58c5-5 9-6 15-3" />
            <path className="rider-body" d="M58 42c8 4 13 11 12 21l-12 2-8-17z" />
            <circle className="rider-face" cx="56" cy="34" r="10" />
            <path className="helmet" d="M45 32c1-10 10-16 20-10 5 3 7 8 6 13-8-2-16-3-26-3z" />
            <path className="arm" d="M64 50l16 11" />
            <path className="leg" d="M60 64l-15 17M67 64l18 17" />
            <rect className="delivery-box" x="78" y="40" width="30" height="24" rx="3" />
            <path className="box-label" d="M87 51h12M91 56h8" />
            <path className="ground" d="M26 103h89" />
        </svg>
    </div>
);

const getNotificationIcon = (id: string) => {
    if (id === 'n3') {
        return <DeliveryIcon />;
    }
    return <OrderSuccessIcon />;
};

const Topbar: React.FC = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { theme, toggleTheme, breadcrumbs, isSidebarOpen, setIsSidebarOpen } = useModel('Khách Hàng.GlobalState.index');
    const { currentUser } = useModel('Khách Hàng.Tài Khoản.thanghang');
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useModel('Khách Hàng.Thông Báo.index');

    const user = currentUser || defaultUser;
    const avatarText = user.avatar && user.avatar.length <= 2 ? user.avatar : 'U';

    return (
        <header className="topbar">
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Mở menu"
            >
                <MenuOutlined style={{ fontSize: '18px' }} />
            </button>

            <div className="crumbs">
                {breadcrumbs.map((c: string, i: number) => (
                    <React.Fragment key={i}>
                        {i > 0 && <RightOutlined style={{ fontSize: '12px' }} />}
                        {i === breadcrumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
                    </React.Fragment>
                ))}
            </div>


            <div className="topbar-actions">
                <button className="icon-btn" onClick={toggleTheme} title={theme === ThemeType.DARK ? 'Chế độ sáng' : 'Chế độ tối'}>
                    {theme === ThemeType.DARK ? <BulbFilled style={{ fontSize: '16px' }} /> : <BulbOutlined style={{ fontSize: '16px' }} />}
                </button>

                <Popover
                    visible={isNotifOpen}
                    onVisibleChange={setIsNotifOpen}
                    trigger="click"
                    placement="bottomRight"
                    overlayClassName={theme === ThemeType.DARK ? 'notif-popover-dark' : ''}
                    overlayInnerStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}
                    content={
                        <div className="notifPopup">
                            <div className="notifHeader">
                                <div className="notifHeaderLeft">
                                    <span className="notifTitle">Thông báo</span>
                                    {unreadCount > 0 && <span className="notifUnreadBadge">{unreadCount} chưa đọc</span>}
                                </div>
                                <button className="markAllBtn" onClick={markAllAsRead}>Đánh dấu tất cả</button>
                            </div>
                            <div className="notifList">
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '30px 20px', textAlign: 'center', color: '#888' }}>Chưa có thông báo nào</div>
                                ) : (
                                    notifications.map((n: any) => (
                                        <div 
                                            key={n.id} 
                                            className={`notifItem ${!n.isRead ? 'notifUnread' : ''}`}
                                            onClick={() => markAsRead(n.id)}
                                        >
                                            <div className="notifIconBox">{getNotificationIcon(n.id)}</div>
                                            <div className="notifBody">
                                                <div className="notifItemTitle">{n.title}</div>
                                                <div className="notifDesc">{n.message}</div>
                                                <div className="notifTime">
                                                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                    {n.time}
                                                </div>
                                            </div>
                                            {!n.isRead && <span className="notifDot" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    }
                >
                    <Badge count={unreadCount} offset={[-2, 2]}>
                        <button className="icon-btn">
                            <BellOutlined style={{ fontSize: '16px' }} />
                        </button>
                    </Badge>
                </Popover>

                <div className="topbar-user-wrap">
                    <button
                        className={`topbar-user-pill ${isUserMenuOpen ? 'open' : ''}`}
                        title={user.name}
                        onClick={() => setIsUserMenuOpen(open => !open)}
                    >
                        <span className="topbar-user-avatar">
                            {user.avatar && user.avatar.length > 2 ? (
                                <img src={user.avatar} alt="Avatar" />
                            ) : (
                                avatarText
                            )}
                        </span>
                        <span className="topbar-user-meta">
                            <strong>{user.name}</strong>
                            <small>{user.dept}</small>
                        </span>
                        <ChevronDown size={16} />
                    </button>

                    {isUserMenuOpen && (
                        <div className="topbar-user-menu">
                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    history.push('/');
                                }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
