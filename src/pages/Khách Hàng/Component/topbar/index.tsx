import React from 'react';
import {
    RightOutlined,
    SearchOutlined,
    BulbOutlined,
    BulbFilled,
    BellOutlined,
    ShoppingCartOutlined,
    MenuOutlined
} from '@ant-design/icons';
import './index.less';
import { useModel } from 'umi';
import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

const Topbar: React.FC = () => {
    const { theme, toggleTheme, breadcrumbs, isSidebarOpen, setIsSidebarOpen } = useModel('Khách Hàng.global');
    const { cart, setCartOpen } = useModel('Khách Hàng.Thực đơn.index');
    const { role } = useModel('Khách Hàng.user');
    const { unreadCount, setIsNotificationOpen } = useModel('Khách Hàng.Notifications');

    const cartCount = role === 'employee' ? cart.length : undefined;

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
            </div>
        </header>
    );
};

export default Topbar;
