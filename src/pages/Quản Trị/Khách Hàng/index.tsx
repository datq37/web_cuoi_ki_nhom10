import {
  CheckCircleFilled,
  CheckOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  SlidersOutlined,
  TeamOutlined,
  TrophyOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import { formatCurrency } from '@/utils/format';
import {
  DANH_SACH_KHACH,
  STAT_KHACH,
  TRANG_THAI_KHACH_CONFIG,
  VAI_TRO_CONFIG,
} from '@/services/Quản Trị/Khách Hàng';
import { IKhachHang } from '@/services/Quản Trị/Khách Hàng/typing';
import styles from './index.less';

const STAT_CARDS = [
  {
    label: 'TỔNG KHÁCH HÀNG',
    value: String(STAT_KHACH.tongKhach),
    icon: TeamOutlined,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    sub: null,
    subTrend: undefined,
  },
  {
    label: 'ĐANG HOẠT ĐỘNG',
    value: String(STAT_KHACH.hoatDong),
    icon: CheckCircleFilled,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    sub: null,
    subTrend: undefined,
  },
  {
    label: 'CHI TIÊU TRUNG BÌNH',
    value: STAT_KHACH.chiTieuTB,
    icon: WalletOutlined,
    iconBg: '#fed7aa',
    iconColor: '#ea580c',
    sub: 'mỗi khách / tháng',
    subTrend: undefined,
  },
  {
    label: 'TOP TUẦN NÀY',
    value: STAT_KHACH.topTuan.ten.split(' ').pop()!,
    icon: TrophyOutlined,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    sub: `↗ ${STAT_KHACH.topTuan.soDon} đơn so với tuần trước`,
    subTrend: 'up',
  },
];

const KhachHang: React.FC = () => {
  const [tuKhoa, setTuKhoa] = useState('');

  const danhSachLoc = useMemo(() => {
    if (!tuKhoa.trim()) return DANH_SACH_KHACH;
    const kw = tuKhoa.toLowerCase();
    return DANH_SACH_KHACH.filter(
      (k) =>
        k.hoTen.toLowerCase().includes(kw) ||
        k.email.toLowerCase().includes(kw) ||
        k.phongBan.toLowerCase().includes(kw),
    );
  }, [tuKhoa]);

  const columns: ColumnsType<IKhachHang> = [
    {
      title: 'HỌ TÊN',
      key: 'hoTen',
      width: 240,
      render: (_, record) => (
        <div className={styles.colHoTen}>
          <Avatar size={36} className={styles.khachAvatar} style={{ background: record.mauNen }}>
            {record.vietTat}
          </Avatar>
          <div>
            <div className={styles.khachTen}>{record.hoTen}</div>
            <div className={styles.khachEmail}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'PHÒNG BAN',
      dataIndex: 'phongBan',
      key: 'phongBan',
      width: 120,
      render: (val) => <span className={styles.phongBan}>{val}</span>,
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      width: 140,
      render: (val) => {
        const cfg = VAI_TRO_CONFIG[val];
        return (
          <span className={styles.vaiTroBadge} style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'SỐ ĐƠN',
      dataIndex: 'soDon',
      key: 'soDon',
      width: 90,
      align: 'right',
      render: (val) => <span className={styles.soDon}>{val}</span>,
    },
    {
      title: 'CHI TIÊU',
      dataIndex: 'chiTieu',
      key: 'chiTieu',
      width: 130,
      align: 'right',
      render: (val) => <span className={styles.chiTieu}>{formatCurrency(val)}</span>,
    },
    {
      title: 'THAM GIA',
      dataIndex: 'thamGia',
      key: 'thamGia',
      width: 110,
      render: (val) => <span className={styles.thamGia}>{val}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (val) => {
        const cfg = TRANG_THAI_KHACH_CONFIG[val];
        return (
          <span className={styles.trangThaiBadge} style={{ color: cfg.color, background: cfg.bg }}>
            <CheckOutlined style={{ fontSize: 10, marginRight: 4 }} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: () => (
        <button className={styles.moreBtn}>
          <MoreOutlined />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Khách hàng" subtitle="Nhân viên công ty đặt món tại căng tin" />

        <div className={styles.pageBody}>
          <div className={styles.statGrid}>
            {STAT_CARDS.map((card) => (
              <div key={card.label} className={styles.statCard}>
                <div className={styles.statLeft}>
                  <div className={styles.statLabel}>{card.label}</div>
                  <div className={styles.statValue}>{card.value}</div>
                  {card.sub && (
                    <div className={`${styles.statSub} ${card.subTrend === 'up' ? styles.subUp : ''}`}>
                      {card.sub}
                    </div>
                  )}
                </div>
                <div className={styles.statIconWrap} style={{ background: card.iconBg }}>
                  <card.icon style={{ fontSize: 20, color: card.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableToolbar}>
              <Input
                prefix={<SearchOutlined className={styles.searchIcon} />}
                placeholder="Tìm theo tên, email, phòng ban..."
                className={styles.searchInput}
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
              />
              <div className={styles.toolbarRight}>
                <Button icon={<SlidersOutlined />} className={styles.btnFilter}>Bộ lọc</Button>
                <Button type="primary" icon={<PlusOutlined />} className={styles.btnAdd}>
                  Thêm người dùng
                </Button>
              </div>
            </div>

            <Table<IKhachHang>
              columns={columns}
              dataSource={danhSachLoc}
              rowKey="id"
              pagination={false}
              className={styles.table}
              rowClassName={styles.tableRow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhachHang;
