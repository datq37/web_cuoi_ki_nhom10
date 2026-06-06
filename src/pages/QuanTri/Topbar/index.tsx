import {
  BellOutlined,
  BulbFilled,
  BulbOutlined,
  CalendarOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Modal, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { history } from 'umi';
import type { INotif, NotifType } from '@/context/NotifContext';
import { timeAgo, useNotif } from '@/context/NotifContext';
import { useTheme } from '@/hooks/useTheme';
import useAdminAuth from '@/hooks/useAdminAuth';
import styles from './index.less';

function getNotifRoute(type: NotifType): string {
  if (type.startsWith('order_')) return '/quan-tri/don-hang';
  if (type.startsWith('stock_')) return '/quan-tri/kho-nguyen-lieu';
  return '/quan-tri/tong-quan';
}

moment.locale('vi');

const NotifPopup: React.FC<{
  onMarkAll: () => void;
  onMarkRead: (id: string) => void;
  onNavigate: (type: NotifType) => void;
  list: INotif[];
}> = ({ onMarkAll, onMarkRead, onNavigate, list }) => {
  const unread = list.filter((n) => !n.read).length;
  return (
    <div className={styles.notifPopup}>
      <div className={styles.notifHeader}>
        <div className={styles.notifHeaderLeft}>
          <span className={styles.notifTitle}>Thông báo</span>
          {unread > 0 && <span className={styles.notifUnreadBadge}>{unread} chưa đọc</span>}
        </div>
        <button className={styles.markAllBtn} onClick={onMarkAll}>
          Đánh dấu tất cả
        </button>
      </div>

      <div className={styles.notifList}>
        {list.length === 0 ? (
          <div className={styles.notifEmpty}>Không có thông báo nào</div>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
              onClick={() => { onMarkRead(n.id); onNavigate(n.type); }}
            >
              <div className={styles.notifIconBox}>{n.icon}</div>
              <div className={styles.notifBody}>
                <div className={styles.notifItemTitle}>{n.title}</div>
                <div className={styles.notifDesc}>{n.desc}</div>
                <div className={styles.notifTime}>{timeAgo(n.createdAt)}</div>
              </div>
              {!n.read && <span className={styles.notifDot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface TopbarProps {
  title?: string;
}



const Topbar: React.FC<TopbarProps> = ({ title = 'Tổng quan' }) => {
  const dateStr = moment().format('D [tháng] M, YYYY');
  const { isDark, toggleDark } = useTheme();
  const { notifs, markRead, markAll } = useNotif();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Dùng custom hook useAdminAuth thay vì store.get trực tiếp
  const { user, logout: authLogout } = useAdminAuth();
  const vietTat = user.ten
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'AD';

  const handleLogout = () => {
    setUserOpen(false);
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc muốn đăng xuất khỏi trang quản trị?',
      okText: 'Đăng xuất',
      cancelText: 'Huỷ',
      okType: 'danger',
      centered: true,
      icon: <LogoutOutlined style={{ color: '#dc2626' }} />,
      okButtonProps: { style: { background: '#dc2626', borderColor: '#dc2626', borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => { authLogout(); },
    });
  };

  const handleNotifOpenChange = (open: boolean) => {
    setNotifOpen(open);
    if (open) markAll();
  };

  const userMenuOverlay = (
    <div className={styles.userDropdown}>
      <div className={styles.dropdownHeader}>
        {user.avatar ? (
          <Avatar src={user.avatar} className={styles.dropdownAvatar} size={38} />
        ) : (
          <Avatar className={styles.dropdownAvatar} size={38}>{vietTat}</Avatar>
        )}
        <div className={styles.dropdownInfo}>
          <div className={styles.dropdownName}>{user.ten}</div>
          <div className={styles.dropdownEmail}>{user.email}</div>
        </div>
      </div>

      <div className={styles.dropdownDivider} />
      <div className={styles.dropdownItems}>
        <button
          className={styles.dropdownItem}
          onClick={() => { setUserOpen(false); history.push('/quan-tri/cai-dat'); }}
        >
          <SettingOutlined className={styles.dropdownItemIcon} />
          Cài đặt & hồ sơ
        </button>
      </div>

      <div className={styles.dropdownDivider} />

      <div className={styles.dropdownItems}>
        <button
          className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
          onClick={handleLogout}
        >
          <LogoutOutlined className={styles.dropdownItemIcon} />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.pageDate}>
          <CalendarOutlined className={styles.calIcon} />
          <span>Hôm nay, {dateStr}</span>
        </div>
      </div>
      <div className={styles.right}>
        <Button
          className={styles.iconBtn}
          icon={isDark ? <BulbOutlined /> : <BulbFilled />}
          onClick={toggleDark}
          title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        />
        <Popover
          visible={notifOpen}
          onVisibleChange={handleNotifOpenChange}
          trigger="click"
          placement="bottomRight"
          overlayClassName={styles.notifOverlay}
          overlayInnerStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden', border: 'none', boxShadow: 'none' }}
          content={
            <NotifPopup
              onMarkAll={markAll}
              onMarkRead={markRead}
              onNavigate={(type) => { history.push(getNotifRoute(type)); setNotifOpen(false); }}
              list={notifs}
            />
          }
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <Button
              className={`${styles.iconBtn} ${unreadCount > 0 ? styles.bellActive : ''}`}
              icon={<BellOutlined />}
              title={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Thông báo'}
            />
          </Badge>
        </Popover>

        <Dropdown
          overlay={userMenuOverlay}
          trigger={['click']}
          visible={userOpen}
          onVisibleChange={setUserOpen}
          placement="bottomRight"
          overlayClassName={styles.userOverlay}
        >
          <button className={styles.userPill}>
            {user.avatar ? (
              <Avatar src={user.avatar} className={styles.userAvatar} size={30} />
            ) : (
              <Avatar className={styles.userAvatar} size={30}>{vietTat}</Avatar>
            )}
            <DownOutlined className={`${styles.pillArrow} ${userOpen ? styles.pillArrowUp : ''}`} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
