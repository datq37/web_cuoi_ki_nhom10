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
import { Avatar, Button, Drawer, Form, Input, Modal, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_KHACH,
  STAT_KHACH,
  TRANG_THAI_KHACH_CONFIG,
  VAI_TRO_CONFIG,
} from '@/services/Quản Trị/Khách Hàng';
import { ETrangThaiKhach, EVaiTro, IKhachHang } from '@/services/Quản Trị/Khách Hàng/typing';
import styles from './index.less';

function formatChiTieu(val: number): string {
  return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
}

const MAU_NEN_PALETTE = [
  '#3b82f6', '#f97316', '#0891b2', '#65a30d', '#c026d3',
  '#16a34a', '#e11d48', '#d97706', '#64748b', '#4f46e5',
  '#f9a8d4', '#93c5fd', '#86efac', '#c4b5fd', '#fca5a5',
];

function taoVietTat(hoTen: string): string {
  const words = hoTen.trim().split(/\s+/);
  if (words.length >= 2) {
    const n = words.length;
    return (words[n - 2][0] + words[n - 1][0]).toUpperCase();
  }
  return hoTen.slice(0, 2).toUpperCase();
}

function chonMauNen(danhSach: IKhachHang[]): string {
  const daDung = new Set(danhSach.map((k) => k.mauNen));
  const chuaDung = MAU_NEN_PALETTE.filter((m) => !daDung.has(m));
  return chuaDung.length > 0
    ? chuaDung[0]
    : MAU_NEN_PALETTE[Math.floor(Math.random() * MAU_NEN_PALETTE.length)];
}

function ngayHomNay(): string {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

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

/* ── Drawer bộ lọc ── */
const LocKhachDrawer: React.FC<{
  open: boolean;
  locVaiTro: EVaiTro | '';
  locTrangThai: ETrangThaiKhach | '';
  onClose: () => void;
  onApply: (vaiTro: EVaiTro | '', trangThai: ETrangThaiKhach | '') => void;
}> = ({ open, locVaiTro, locTrangThai, onClose, onApply }) => {
  const [vaiTro, setVaiTro] = useState<EVaiTro | ''>(locVaiTro);
  const [trangThai, setTrangThai] = useState<ETrangThaiKhach | ''>(locTrangThai);

  useEffect(() => {
    setVaiTro(locVaiTro);
    setTrangThai(locTrangThai);
  }, [locVaiTro, locTrangThai, open]);

  const handleApply = () => {
    onApply(vaiTro, trangThai);
    onClose();
  };

  const handleReset = () => {
    setVaiTro('');
    setTrangThai('');
    onApply('', '');
    onClose();
  };

  return (
    <Drawer
      title="Bộ lọc khách hàng"
      placement="right"
      width={320}
      visible={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={handleReset}>Đặt lại</Button>
          <Button
            type="primary"
            className={styles.btnApply}
            onClick={handleApply}
          >
            Áp dụng
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Vai trò
          </div>
          <Select
            value={vaiTro || undefined}
            onChange={(v) => setVaiTro((v as EVaiTro) ?? '')}
            style={{ width: '100%' }}
            placeholder="Tất cả vai trò"
            allowClear
            onClear={() => setVaiTro('')}
            size="large"
          >
            {Object.entries(VAI_TRO_CONFIG).map(([key, cfg]) => (
              <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Trạng thái
          </div>
          <Select
            value={trangThai || undefined}
            onChange={(v) => setTrangThai((v as ETrangThaiKhach) ?? '')}
            style={{ width: '100%' }}
            placeholder="Tất cả trạng thái"
            allowClear
            onClear={() => setTrangThai('')}
            size="large"
          >
            {Object.entries(TRANG_THAI_KHACH_CONFIG).map(([key, cfg]) => (
              <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </Drawer>
  );
};

/* ── Modal thêm người dùng ── */
const ThemNguoiDungModal: React.FC<{
  open: boolean;
  danhSach: IKhachHang[];
  onClose: () => void;
  onConfirm: (kh: Omit<IKhachHang, 'id'>) => void;
}> = ({ open, danhSach, onClose, onConfirm }) => {
  const [form] = Form.useForm();
  const hoTenWatch = Form.useWatch('hoTen', form) as string | undefined;
  const vietTat = hoTenWatch?.trim() ? taoVietTat(hoTenWatch) : '?';
  const mauNen  = chonMauNen(danhSach);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onConfirm({
        hoTen:     values.hoTen.trim(),
        email:     values.email.trim(),
        phongBan:  values.phongBan.trim(),
        vaiTro:    values.vaiTro,
        trangThai: values.trangThai,
        vietTat:   taoVietTat(values.hoTen),
        mauNen:    chonMauNen(danhSach),
        soDon:     0,
        chiTieu:   0,
        thamGia:   ngayHomNay(),
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={open}
      title="Thêm người dùng mới"
      onCancel={onClose}
      onOk={handleOk}
      okText="Thêm người dùng"
      cancelText="Huỷ"
      width={460}
      destroyOnClose
      className={styles.adminModal}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 20 }}>
        <Avatar size={48} style={{ background: mauNen, color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {vietTat}
        </Avatar>
        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
          Ảnh đại diện được tạo tự động<br />
          <span style={{ fontSize: 12 }}>Viết tắt từ hai chữ cuối của tên</span>
        </div>
      </div>

      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Họ và tên"
          name="hoTen"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên' },
            { min: 3, message: 'Tối thiểu 3 ký tự' },
          ]}
        >
          <Input placeholder="VD: Nguyễn Văn An" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="VD: an.nv@ct.vn" />
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="phongBan"
          rules={[{ required: true, message: 'Vui lòng nhập phòng ban' }]}
        >
          <Input placeholder="VD: IT, Marketing, HR..." />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="vaiTro"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò" size="large">
            {Object.entries(VAI_TRO_CONFIG).map(([key, cfg]) => (
              <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
          initialValue={ETrangThaiKhach.HOAT_DONG}
        >
          <Select size="large">
            {Object.entries(TRANG_THAI_KHACH_CONFIG).map(([key, cfg]) => (
              <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

/* ── Trang chính ── */
const KhachHang: React.FC = () => {
  const [danhSach,    setDanhSach]    = useState<IKhachHang[]>(DANH_SACH_KHACH);
  const [tuKhoa,      setTuKhoa]      = useState('');
  const [locVaiTro,   setLocVaiTro]   = useState<EVaiTro | ''>('');
  const [locTrangThai, setLocTrangThai] = useState<ETrangThaiKhach | ''>('');
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [themOpen,    setThemOpen]    = useState(false);

  const soBoLoc = (locVaiTro ? 1 : 0) + (locTrangThai ? 1 : 0);

  const danhSachLoc = useMemo(() => {
    const kw = tuKhoa.toLowerCase();
    return danhSach.filter((k) => {
      const matchKw = !tuKhoa.trim() ||
        k.hoTen.toLowerCase().includes(kw) ||
        k.email.toLowerCase().includes(kw) ||
        k.phongBan.toLowerCase().includes(kw);
      const matchVaiTro   = !locVaiTro   || k.vaiTro    === locVaiTro;
      const matchTrangThai = !locTrangThai || k.trangThai === locTrangThai;
      return matchKw && matchVaiTro && matchTrangThai;
    });
  }, [danhSach, tuKhoa, locVaiTro, locTrangThai]);

  const handleThemNguoiDung = (data: Omit<IKhachHang, 'id'>) => {
    const newKH: IKhachHang = { ...data, id: `kh_${Date.now()}` };
    setDanhSach((prev) => [...prev, newKH]);
    message.success(`Đã thêm ${data.hoTen} (${VAI_TRO_CONFIG[data.vaiTro].label})`);
    setThemOpen(false);
  };

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
          <span className={styles.vaiTroBadge} data-vaitro={val} style={{ color: cfg.color }}>
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
      render: (val) => <span className={styles.chiTieu}>{formatChiTieu(val)}</span>,
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
          <span className={styles.trangThaiBadge} data-trangthai={val} style={{ color: cfg.color }}>
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
    <>
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
              <Button
                icon={<SlidersOutlined />}
                className={styles.btnFilter}
                onClick={() => setFilterOpen(true)}
              >
                Bộ lọc{soBoLoc > 0 && ` (${soBoLoc})`}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.btnAdd}
                onClick={() => setThemOpen(true)}
              >
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
            locale={{ emptyText: 'Không tìm thấy khách hàng nào' }}
          />
        </div>
      </div>

      <LocKhachDrawer
        open={filterOpen}
        locVaiTro={locVaiTro}
        locTrangThai={locTrangThai}
        onClose={() => setFilterOpen(false)}
        onApply={(vt, tt) => { setLocVaiTro(vt); setLocTrangThai(tt); }}
      />
      <ThemNguoiDungModal
        open={themOpen}
        danhSach={danhSach}
        onClose={() => setThemOpen(false)}
        onConfirm={handleThemNguoiDung}
      />
    </>
  );
};

export default KhachHang;
