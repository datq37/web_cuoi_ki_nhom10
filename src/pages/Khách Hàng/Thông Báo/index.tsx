import React from 'react';
import { Drawer } from 'antd';
import { CloseOutlined, BellOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import './index.less';

const ThongBao: React.FC = () => {
    const { 
        notifications, 
        unreadCount, 
        isNotificationOpen, 
        setIsNotificationOpen, 
        markAsRead, 
        markAllAsRead 
    } = useModel('Khách Hàng.Notifications');
    
    const { theme } = useModel('Khách Hàng.global');

    return (
        <Drawer
            placement="right"
            closable={false}
            onClose={() => setIsNotificationOpen(false)}
            visible={isNotificationOpen}
            className={`notification-drawer`}
            width={450}
            bodyStyle={{ padding: 0 }}
            getContainer={() => document.querySelector('.main-page-container') as HTMLElement || document.body}
        >
            <div className="custom-drawer-header">
                <div className="title-left">
                    <span>Thông báo</span>
                </div>
                <div className="title-right-group">
                    {unreadCount > 0 && (
                        <span 
                            className="read-all-btn" 
                            onClick={markAllAsRead}
                        >
                            Đọc tất cả ({unreadCount})
                        </span>
                    )}
                    <CloseOutlined 
                        className="close-btn" 
                        onClick={() => setIsNotificationOpen(false)} 
                    />
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
                            {item.image ? (
                                <img src={item.image} alt="notification" className="noti-image" />
                            ) : (
                                <div className="noti-image" style={{ display: 'grid', placeItems: 'center', background: '#e6f7ff', color: '#1890ff', fontSize: 24 }}>
                                    <BellOutlined />
                                </div>
                            )}
                            <div className="noti-content">
                                <div className="noti-title">{item.title}</div>
                                <div className="noti-message">{item.message}</div>
                                <div className="noti-time">{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </Drawer>
    );
};

export default ThongBao;
