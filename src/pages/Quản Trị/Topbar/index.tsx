// src/pages/Quản Trị/Topbar/index.tsx
import {
  BellOutlined,
  BulbFilled,
  BulbOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import styles from './index.less';

moment.locale('vi');

interface INotif {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const NOTIF_LIST: INotif[] = [
  { id: '1', icon: '🛒', title: 'Đơn hàng mới #DH042', desc: 'Nguyễn Văn Hùng đặt 3 món', time: '2 phút trước', read: false },
  { id: '2', icon: '⚠️', title: 'Kho sắp hết — Thịt bò', desc: 'Còn lại 1.2kg, dưới mức tối thiểu', time: '15 phút trước', read: false },
  { id: '3', icon: '✅', title: 'Đơn #DH038 đã hoàn thành', desc: 'Lê Thị Hà đã nhận', time: '1 giờ trước', read: true },
];

const NotifPopupContent: React.FC<{ onMarkAll: () => void; list: INotif[] }> = ({ onMarkAll, list }) => (
  <div className={styles.notifPopup}>
    <div className={styles.notifHeader}>
      <span className={styles.notifTitle}>Thông báo</span>
      <button className={styles.markAllBtn} onClick={onMarkAll}>
        Đánh dấu tất cả đã đọc
      </button>
    </div>
    <div className={styles.notifList}>
      {list.map((n) => (
        <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
          <span className={styles.notifIcon}>{n.icon}</span>
          <div className={styles.notifBody}>
            <div className={styles.notifItemTitle}>{n.title}</div>
            <div className={styles.notifDesc}>{n.desc} · {n.time}</div>
          </div>
          {!n.read && <span className={styles.notifDot} />}
        </div>
      ))}
    </div>
    <div className={styles.notifFooter}>Xem tất cả thông báo →</div>
  </div>
);

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title = 'Tổng quan', subtitle }) => {
  const dateStr = moment().format('D [tháng] M, YYYY');
  const { isDark, toggleDark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<INotif[]>(NOTIF_LIST);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const handleMarkAll = () => setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className={styles.topbar}>
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
          overlayInnerStyle={{ padding: 0, borderRadius: 12 }}
          content={<NotifPopupContent onMarkAll={handleMarkAll} list={notifList} />}
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <Button className={styles.iconBtn} icon={<BellOutlined />} />
          </Badge>
        </Popover>

        {/* User avatar */}
        <div className={styles.userWrap}>
          <Avatar className={styles.userAvatar} size={36}>MT</Avatar>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
