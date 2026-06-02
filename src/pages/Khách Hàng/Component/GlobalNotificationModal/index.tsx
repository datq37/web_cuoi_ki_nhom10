import React from 'react';
import { Modal, Button } from 'antd';
import { useModel } from 'umi';
import { CheckOutlined, CloseOutlined, InfoOutlined } from '@ant-design/icons';
import './index.less';

const GlobalNotificationModal: React.FC = () => {
  const { isOpen, notification, closeNotification } = useModel('Khách Hàng.GlobalNotification.index');
  const { theme } = useModel('Khách Hàng.GlobalState.index');

  if (!notification) return null;

  const renderIcon = () => {
    switch (notification.type) {
      case 'error':
        return <div className="icon-circle error"><CloseOutlined /></div>;
      case 'info':
        return <div className="icon-circle info"><InfoOutlined /></div>;
      case 'success':
      default:
        return <div className="icon-circle success"><CheckOutlined /></div>;
    }
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={closeNotification}
      footer={null}
      closable={false}
      centered
      width={400}
      wrapClassName={`customer-global-notification-modal theme-${theme}`}
    >
      <div className="notification-content">
        <div className="close-btn" onClick={closeNotification}>
          <CloseOutlined />
        </div>
        <div className="decorative-bg">
          {renderIcon()}
        </div>
        <div className="text-content">
          <h2 className="title">{notification.title}</h2>
          {notification.description && (
            <p className="description">{notification.description}</p>
          )}
        </div>
        <div className="action-footer">
          <Button type="primary" size="large" className="btn-close-main" onClick={closeNotification}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalNotificationModal;
