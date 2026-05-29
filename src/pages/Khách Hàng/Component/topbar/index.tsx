import React from 'react';
import {
    RightOutlined,
    BulbOutlined,
    BulbFilled,
    BellOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { ChevronDown } from 'lucide-react';
import './index.less';
import { history, useModel } from 'umi';
import { defaultUser } from '@/services/Khách hàng/Component/Sidebar';
import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

const Topbar: React.FC = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const { theme, toggleTheme, breadcrumbs, isSidebarOpen, setIsSidebarOpen } = useModel('Khách Hàng.global');
    const { currentUser } = useModel('Khách Hàng.user');
    const { unreadCount, setIsNotificationOpen } = useModel('Khách Hàng.Notifications');

    const user = currentUser || defaultUser;
    const avatarText = user.avatar && user.avatar.length <= 2 ? user.avatar : 'U';

    return (
        <header className="topbar" style={{ position: 'relative' }}>
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

                <button className="icon-btn" onClick={() => setIsNotificationOpen(true)}>
                    <BellOutlined style={{ fontSize: '16px' }} />
                    {unreadCount > 0 && <span className="dot" />}
                </button>

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
