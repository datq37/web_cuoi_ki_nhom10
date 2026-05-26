import {
  BellOutlined,
  BulbFilled,
  BulbOutlined,
  CalendarOutlined,
  DownOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { history } from 'umi';
import { INotif, NotifType, timeAgo, useNotif } from '@/context/NotifContext';
import { useTheme } from '@/hooks/useTheme';
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
  subtitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title = 'Tổng quan', subtitle }) => {
  const dateStr = moment().format('D [tháng] M, YYYY');
  const { isDark, toggleDark } = useTheme();
  const { notifs, markRead, markAll } = useNotif();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const userMenuOverlay = (
    <div className={styles.userDropdown}>
      {/* Header */}
      <div className={styles.dropdownHeader}>
        <Avatar className={styles.dropdownAvatar} size={36}>MT</Avatar>
        <div className={styles.dropdownInfo}>
          <div className={styles.dropdownName}>Nguyễn Minh Tâm</div>
          <div className={styles.dropdownEmail}>tam.nm@canteen.vn</div>
        </div>
      </div>

      <div className={styles.dropdownDivider} />

      {/* Items */}
      <div className={styles.dropdownItems}>
        <button className={styles.dropdownItem}>
          <UserOutlined className={styles.dropdownItemIcon} />
          Hồ sơ cá nhân
        </button>
        <button className={styles.dropdownItem}>
          <SettingOutlined className={styles.dropdownItemIcon} />
          Cài đặt
        </button>
        <button className={styles.dropdownItem}>
          <QuestionCircleOutlined className={styles.dropdownItemIcon} />
          Trợ giúp
        </button>
      </div>

      <div className={styles.dropdownDivider} />

      <div className={styles.dropdownItems}>
        <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`}>
          <LogoutOutlined className={styles.dropdownItemIcon} />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <header className={styles.topbar}>
      {/* ── Title ───────────────────────────────────────── */}
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle ? (
          <div className={styles.pageDate}>{subtitle}</div>
        ) : (
          <div className={styles.pageDate}>
            <CalendarOutlined className={styles.calIcon} />
            <span>Hôm nay, {dateStr}</span>
          </div>
        )}
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
      <div className={styles.right}>

        {/* Dark mode toggle */}
        <Button
          className={styles.iconBtn}
          icon={isDark ? <BulbOutlined /> : <BulbFilled />}
          onClick={toggleDark}
          title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        />

        {/* Notification bell */}
        <Popover
          open={notifOpen}
          onOpenChange={setNotifOpen}
          trigger="click"
          placement="bottomRight"
          arrow={false}
          overlayInnerStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}
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
            <Button className={styles.iconBtn} icon={<BellOutlined />} />
          </Badge>
        </Popover>

        {/* User pill */}
        <Dropdown
          overlay={userMenuOverlay}
          trigger={['click']}
          visible={userOpen}
          onVisibleChange={setUserOpen}
          placement="bottomRight"
        >
          <button className={styles.userPill}>
            <Avatar className={styles.userAvatar} size={30}>MT</Avatar>
            <DownOutlined className={`${styles.pillArrow} ${userOpen ? styles.pillArrowUp : ''}`} />
          </button>
        </Dropdown>

      </div>
    </header>
  );
};

export default Topbar;
