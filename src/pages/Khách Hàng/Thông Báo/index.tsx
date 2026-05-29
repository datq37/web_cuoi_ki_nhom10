import React from 'react';
import { Drawer } from 'antd';
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import './index.less';

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

const ThongBao: React.FC = () => {
    const { 
        notifications, 
        unreadCount, 
        isNotificationOpen, 
        setIsNotificationOpen, 
        markAsRead, 
        markAllAsRead 
    } = useModel('Khách Hàng.Thông Báo.index');
    
    const { theme } = useModel('Khách Hàng.global');

    return (
        <Drawer
            placement="right"
            closable={false}
            onClose={() => setIsNotificationOpen(false)}
            visible={isNotificationOpen}
            className={`notification-drawer theme-${theme}`}
            width={520}
            bodyStyle={{ padding: 0 }}
            getContainer={() => document.querySelector('.main-page-container') as HTMLElement || document.body}
        >
            <div className="custom-drawer-header">
                <div className="title-left">
                    <span>Thông báo</span>
                </div>
                <div className="title-right-group">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="read-all-btn" 
                            onClick={markAllAsRead}
                        >
                            <CheckCircleOutlined />
                            Đọc tất cả ({unreadCount})
                        </button>
                    )}
                    <button
                        type="button"
                        className="close-btn"
                        onClick={() => setIsNotificationOpen(false)}
                        aria-label="Đóng thông báo"
                    >
                        <CloseOutlined />
                    </button>
                </div>
            </div>

            <div className="drawer-content-scroll">
            {notifications.length === 0 ? (
                <div className="empty-notification">
                    <BellOutlined />
                    <p>Chưa có thông báo nào</p>
                </div>
            ) : (
                <div className="notification-list">
                    {notifications.map(item => (
                        <div 
                            key={item.id} 
                            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                            onClick={() => markAsRead(item.id)}
                        >
                            {getNotificationIcon(item.id)}
                            <div className="noti-content">
                                <div className="noti-title">{item.title}</div>
                                <div className="noti-message">{item.message}</div>
                                <div className="noti-time">
                                    <ClockCircleOutlined />
                                    {item.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                <div className="notification-decor" aria-hidden="true">
                    <span className="decor-hill decor-hill-one" />
                    <span className="decor-hill decor-hill-two" />
                    <span className="decor-dots" />
                    <span className="decor-leaf leaf-one" />
                    <span className="decor-leaf leaf-two" />
                    <span className="decor-leaf leaf-three" />
                </div>
            </div>
        </Drawer>
    );
};

export default ThongBao;
