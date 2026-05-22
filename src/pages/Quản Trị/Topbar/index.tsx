import { BellOutlined, CalendarOutlined, SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React from 'react';
import styles from './index.less';

moment.locale('vi');

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ title = 'Tổng quan', subtitle }) => {
  const dateStr = moment().format('D [tháng] M, YYYY');

  return (
    <header className={styles.topbar}>
      {/* Tiêu đề trang */}
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

      {/* Actions bên phải */}
      <div className={styles.right}>
        <Input
          prefix={<SearchOutlined className={styles.searchIcon} />}
          placeholder="Tìm món, đơn hàng, người dùng..."
          className={styles.searchInput}
        />
        <Button className={styles.iconBtn} icon={<SlidersOutlined />} />
        <Badge count={2} offset={[-2, 2]}>
          <Button className={styles.iconBtn} icon={<BellOutlined />} />
        </Badge>
        <div className={styles.userWrap}>
          <Avatar className={styles.userAvatar} size={36}>MT</Avatar>
          <span className={styles.userNameShort}>MT</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
