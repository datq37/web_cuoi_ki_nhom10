import {
  KeyOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_NHAN_VIEN,
  VAI_TRO_NV_CONFIG,
} from '@/services/Quản Trị/Nhân Viên Căng Tin';
import { INhanVien } from '@/services/Quản Trị/Nhân Viên Căng Tin/typing';
import styles from './index.less';

const NhanVienCard: React.FC<{ nv: INhanVien }> = ({ nv }) => {
  const cfg = VAI_TRO_NV_CONFIG[nv.vaiTro];

  return (
    <div className={styles.card}>
      {/* Header: avatar + tên + email */}
      <div className={styles.cardHeader}>
        <Avatar
          size={52}
          className={styles.avatar}
          style={{
            background: nv.mauNen,
            color: '#1e3a5f',
          }}
        >
          {nv.vietTat}
        </Avatar>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{nv.hoTen}</div>
          <div className={styles.cardEmail}>{nv.email}</div>
        </div>
      </div>

      {/* Role + last active */}
      <div className={styles.cardMeta}>
        <span
          className={styles.roleBadge}
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.label}
        </span>
        <span className={styles.lastActive}>
          Hoạt động: {nv.hoatDongGanNhat}
        </span>
      </div>

      {/* Actions */}
      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>
          <KeyOutlined className={styles.actionIcon} />
          Đổi quyền
        </button>
        <button className={styles.actionBtn}>
          <MessageOutlined className={styles.actionIcon} />
          Nhắn tin
        </button>
      </div>
    </div>
  );
};

const AddMemberCard: React.FC = () => (
  <div className={styles.addCard}>
    <div className={styles.addIconWrap}>
      <PlusOutlined className={styles.addIcon} />
    </div>
    <div className={styles.addTitle}>Thêm thành viên</div>
    <div className={styles.addSub}>Mời quản trị viên / nhân viên căng tin</div>
  </div>
);

const NhanVienCangTin: React.FC = () => {
  return (
    <>
      <Topbar
        title="Nhân viên căng tin"
        subtitle="Đội ngũ quản lý, bếp và thu ngân"
      />

      <div className={styles.pageBody}>
        <div className={styles.grid}>
          {DANH_SACH_NHAN_VIEN.map((nv) => (
            <NhanVienCard key={nv.id} nv={nv} />
          ))}
          <AddMemberCard />
        </div>
      </div>
    </>
  );
};

export default NhanVienCangTin;
