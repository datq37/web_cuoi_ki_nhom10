import {
  ExclamationCircleFilled,
  FilterOutlined,
  ImportOutlined,
  InboxOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  CAN_NHAP_THEM,
  DANH_SACH_NGUYEN_LIEU,
  STAT_KHO,
  TRANG_THAI_CONFIG,
} from '@/services/Quản Trị/Kho Nguyên Liệu';
import { INguyenLieu } from '@/services/Quản Trị/Kho Nguyên Liệu/typing';
import styles from './index.less';

function formatGia(gia: number): string {
  return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
}

function tinhPhanTram(tonKho: number, mucToiThieu: number): number {
  if (mucToiThieu === 0) return 100;
  const max = mucToiThieu * 2.5;
  return Math.min(100, Math.round((tonKho / max) * 100));
}

const STAT_CARDS = [
  {
    label: 'TỔNG NGUYÊN LIỆU',
    value: String(STAT_KHO.tongNguyenLieu),
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    Icon: InboxOutlined,
    sub: null,
  },
  {
    label: 'SẮP HẾT / HẾT',
    value: String(STAT_KHO.sapHetHet),
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    Icon: WarningFilled,
    sub: '1 đã hết so với tuần trước',
    subTrend: 'down',
  },
  {
    label: 'GIÁ TRỊ KHO',
    value: STAT_KHO.giaTri,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    Icon: ShoppingCartOutlined,
    sub: null,
  },
  {
    label: 'NHÀ CUNG CẤP',
    value: String(STAT_KHO.nhaCungCap),
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    Icon: ImportOutlined,
    sub: null,
  },
];

const KhoNguyenLieu: React.FC = () => {
  const [tuKhoa, setTuKhoa] = useState('');

  const danhSachLoc = useMemo(() => {
    if (!tuKhoa.trim()) return DANH_SACH_NGUYEN_LIEU;
    const kw = tuKhoa.toLowerCase();
    return DANH_SACH_NGUYEN_LIEU.filter(
      (n) =>
        n.ten.toLowerCase().includes(kw) ||
        n.nhaCungCap.toLowerCase().includes(kw),
    );
  }, [tuKhoa]);

  const columns: ColumnsType<INguyenLieu> = [
    {
      title: 'NGUYÊN LIỆU',
      dataIndex: 'ten',
      key: 'ten',
      width: 220,
      render: (_, record) => (
        <div className={styles.colNguyenLieu}>
          <div className={styles.nlIcon}>
            <InboxOutlined className={styles.nlIconSvg} />
          </div>
          <div>
            <div className={styles.nlTen}>{record.ten}</div>
            <div className={styles.nlDonVi}>Đơn vị: {record.donVi}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'NHÀ CUNG CẤP',
      dataIndex: 'nhaCungCap',
      key: 'nhaCungCap',
      width: 140,
      render: (val) => <span className={styles.nhaCungCap}>{val}</span>,
    },
    {
      title: 'TỒN KHO',
      dataIndex: 'tonKho',
      key: 'tonKho',
      width: 160,
      render: (_, record) => {
        const pct = tinhPhanTram(record.tonKho, record.mucToiThieu);
        const cfg = TRANG_THAI_CONFIG[record.trangThai];
        return (
          <div className={styles.colTonKho}>
            <span className={styles.tonKhoValue}>
              {record.tonKho} {record.donVi}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${pct}%`, background: cfg.barColor }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'MỨC TỐI THIỂU',
      dataIndex: 'mucToiThieu',
      key: 'mucToiThieu',
      width: 130,
      render: (val, record) => (
        <span className={styles.mucToiThieu}>
          {val} {record.donVi}
        </span>
      ),
    },
    {
      title: 'GIÁ NHẬP',
      dataIndex: 'giaNhap',
      key: 'giaNhap',
      width: 120,
      render: (val) => <span className={styles.giaNhap}>{formatGia(val)}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (val) => {
        const cfg = TRANG_THAI_CONFIG[val];
        return (
          <span
            className={styles.trangThaiBadge}
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: () => (
        <div className={styles.rowActions}>
          <button className={styles.btnNhap}>
            <PlusOutlined style={{ fontSize: 11 }} /> Nhập
          </button>
          <button className={styles.btnMore}>
            <MoreOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Kho nguyên liệu" />

        <div className={styles.pageBody}>
          {/* ── Stat cards ── */}
          <div className={styles.statGrid}>
            {STAT_CARDS.map((card) => (
              <div key={card.label} className={styles.statCard}>
                <div className={styles.statLeft}>
                  <div className={styles.statLabel}>{card.label}</div>
                  <div className={styles.statValue}>{card.value}</div>
                  {card.sub && (
                    <div className={`${styles.statSub} ${card.subTrend === 'down' ? styles.statSubDown : ''}`}>
                      {card.subTrend === 'down' && '↘ '}
                      {card.sub}
                    </div>
                  )}
                </div>
                <div
                  className={styles.statIconWrap}
                  style={{ background: card.iconBg }}
                >
                  <card.Icon style={{ fontSize: 20, color: card.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Warning banner ── */}
          <div className={styles.warnBanner}>
            <div className={styles.warnLeft}>
              <ExclamationCircleFilled className={styles.warnIcon} />
              <span>
                <strong>Cần nhập thêm nguyên liệu:</strong>{' '}
                {CAN_NHAP_THEM.join(', ')}
              </span>
            </div>
            <button className={styles.btnTaoDon}>
              <ShoppingCartOutlined style={{ marginRight: 6 }} />
              Tạo đơn nhập
            </button>
          </div>

          {/* ── Table section ── */}
          <div className={styles.tableSection}>
            <div className={styles.tableToolbar}>
              <Input
                prefix={<SearchOutlined className={styles.searchIcon} />}
                placeholder="Tìm nguyên liệu..."
                className={styles.searchInput}
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
              />
              <div className={styles.tableActions}>
                <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                  Lọc
                </Button>
                <Button icon={<ImportOutlined />} className={styles.btnOutline}>
                  Nhập kho
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addBtn}
                >
                  Thêm nguyên liệu
                </Button>
              </div>
            </div>

            <Table<INguyenLieu>
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

export default KhoNguyenLieu;
