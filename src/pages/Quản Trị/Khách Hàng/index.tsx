import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  MoreOutlined,
  TeamOutlined,
  TrophyOutlined,
  UnlockOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import TableStaticData from '@/components/TableStaticData';
import Topbar from '@/pages/Quản Trị/Topbar';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import EmptyState from '@/pages/Quản Trị/components/EmptyState';
import { fmt } from '@/models/Quản Trị/Tổng Quan';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import {
  DANH_SACH_KHACH,
  TRANG_THAI_KHACH_CONFIG,
  VAI_TRO_CONFIG,
} from '@/services/Quản Trị/Khách Hàng';
import {
  ETrangThaiKhach,
  EVaiTro,
  IKhachHang,
} from '@/services/Quản Trị/Khách Hàng/typing';
import { KEYS, store } from '@/utils/storage';
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

// ── Drawer bộ lọc ────────────────────────────────────────────────
const LocKhachDrawer: React.FC<{
  open: boolean;
  locVaiTro: EVaiTro | '';
  locTrangThai: ETrangThaiKhach | '';
  onClose: () => void;
  onApply: (vaiTro: EVaiTro | '', trangThai: ETrangThaiKhach | '') => void;
}> = ({ open, locVaiTro, locTrangThai, onClose, onApply }) => {
  const [vaiTro,    setVaiTro]    = useState<EVaiTro | ''>(locVaiTro);
  const [trangThai, setTrangThai] = useState<ETrangThaiKhach | ''>(locTrangThai);

  useEffect(() => {
    setVaiTro(locVaiTro);
    setTrangThai(locTrangThai);
  }, [locVaiTro, locTrangThai, open]);

  return (
    <Drawer
      title="Bộ lọc khách hàng"
      placement="right"
      width={320}
      visible={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => { setVaiTro(''); setTrangThai(''); onApply('', ''); onClose(); }}>Đặt lại</Button>
          <Button type="primary" className={styles.btnApply} onClick={() => { onApply(vaiTro, trangThai); onClose(); }}>
            Áp dụng
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vai trò</div>
          <Select value={vaiTro || undefined} onChange={(v) => setVaiTro((v as EVaiTro) ?? '')} style={{ width: '100%' }} placeholder="Tất cả vai trò" allowClear onClear={() => setVaiTro('')} size="large">
            {Object.entries(VAI_TRO_CONFIG).map(([k, c]) => <Select.Option key={k} value={k}>{c.label}</Select.Option>)}
          </Select>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trạng thái</div>
          <Select value={trangThai || undefined} onChange={(v) => setTrangThai((v as ETrangThaiKhach) ?? '')} style={{ width: '100%' }} placeholder="Tất cả trạng thái" allowClear onClear={() => setTrangThai('')} size="large">
            {Object.entries(TRANG_THAI_KHACH_CONFIG).map(([k, c]) => <Select.Option key={k} value={k}>{c.label}</Select.Option>)}
          </Select>
        </div>
      </div>
    </Drawer>
  );
};

// ── Modal thêm người dùng ────────────────────────────────────────
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
        hoTen: values.hoTen.trim(), email: values.email.trim(),
        phongBan: values.phongBan.trim(), vaiTro: values.vaiTro,
        trangThai: values.trangThai,
        vietTat: taoVietTat(values.hoTen), mauNen: chonMauNen(danhSach),
        soDon: 0, chiTieu: 0, thamGia: ngayHomNay(),
      });
      form.resetFields();
    });
  };

  return (
    <Modal visible={open} title="Thêm người dùng mới" onCancel={onClose} onOk={handleOk}
      okText="Thêm người dùng" cancelText="Huỷ" width={460} destroyOnClose className={styles.adminModal}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 20 }}>
        <Avatar size={48} style={{ background: mauNen, color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{vietTat}</Avatar>
        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
          Ảnh đại diện được tạo tự động<br /><span style={{ fontSize: 12 }}>Viết tắt từ hai chữ cuối của tên</span>
        </div>
      </div>
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item label="Họ và tên" name="hoTen" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }, { min: 3, message: 'Tối thiểu 3 ký tự' }]}>
          <Input placeholder="VD: Nguyễn Văn An" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
          <Input placeholder="VD: an.nv@ct.vn" />
        </Form.Item>
        <Form.Item label="Phòng ban" name="phongBan" rules={[{ required: true, message: 'Vui lòng nhập phòng ban' }]}>
          <Input placeholder="VD: IT, Marketing, HR..." />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item label="Vai trò" name="vaiTro" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
            <Select placeholder="Chọn vai trò">
              {Object.entries(VAI_TRO_CONFIG).map(([k, c]) => <Select.Option key={k} value={k}>{c.label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangThai" initialValue={ETrangThaiKhach.HOAT_DONG}>
            <Select>
              {Object.entries(TRANG_THAI_KHACH_CONFIG).map(([k, c]) => <Select.Option key={k} value={k}>{c.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

// ── Drawer chi tiết khách hàng ───────────────────────────────────
const ChiTietKhachDrawer: React.FC<{
  khach: IKhachHang | null;
  onClose: () => void;
  onKhoa: (id: string) => void;
  onXoa: (id: string) => void;
}> = ({ khach, onClose, onKhoa, onXoa }) => {
  const orders = useMemo(() =>
    store.get<typeof mockData.trucTiep.donHang>(KEYS.orders, mockData.trucTiep.donHang),
  [khach]);

  const lichSuDon = useMemo(() => {
    if (!khach) return [];
    const kw = khach.hoTen.toLowerCase();
    return orders.filter((o) => o.khachHang.ten.toLowerCase().includes(kw));
  }, [khach, orders]);

  const cfg        = khach ? TRANG_THAI_KHACH_CONFIG[khach.trangThai] : null;
  const vaiTroCfg  = khach ? VAI_TRO_CONFIG[khach.vaiTro] : null;
  const daDong     = khach?.trangThai === ETrangThaiKhach.TAM_KHOA;

  const donColumns: ColumnsType<any> = [
    { title: 'Mã đơn',    dataIndex: 'maDon',    key: 'maDon',    width: 100, render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{v}</span> },
    { title: 'Giờ',       dataIndex: 'thoiGian', key: 'thoiGian', width: 70,  render: (v: string) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span> },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (v: number) => <span style={{ fontWeight: 700, color: '#16a34a' }}>{fmt(v)}</span> },
  ];

  return (
    <Modal
      visible={!!khach}
      title={null}
      width={580}
      centered
      onCancel={onClose}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      className={styles.adminModal}
      footer={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            danger={!daDong}
            icon={daDong ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => { if (khach) { onKhoa(khach.id); onClose(); } }}
          >
            {daDong ? 'Mở khoá' : 'Khoá tài khoản'}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            style={{ marginLeft: 'auto' }}
            onClick={() => { if (khach) { onXoa(khach.id); onClose(); } }}
          >
            Xoá
          </Button>
        </div>
      }
    >
      {khach && cfg && vaiTroCfg && (
        <>
          {/* Hero */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px 20px', background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafc 100%)', borderBottom: '1px solid #f1f5f9', gap: 10 }}>
            <Avatar size={72} style={{ background: khach.mauNen, color: '#fff', fontWeight: 700, fontSize: 24 }}>{khach.vietTat}</Avatar>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', textAlign: 'center' }}>{khach.hoTen}</div>
            <div style={{ fontSize: 12.5, color: '#9ca3af' }}>{khach.email}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: '#f3f4f6', color: vaiTroCfg.color }}>{vaiTroCfg.label}</span>
              <Tag color={daDong ? 'default' : 'success'} style={{ margin: 0, borderRadius: 20 }}>
                {daDong ? '🔒 Tạm khoá' : '✅ Hoạt động'}
              </Tag>
            </div>
          </div>

          {/* Thống kê */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, borderBottom: '1px solid #f1f5f9', background: '#f1f5f9' }}>
            {[
              { label: 'Tổng đơn', value: khach.soDon },
              { label: 'Chi tiêu', value: formatChiTieu(khach.chiTieu) },
              { label: 'Tham gia', value: khach.thamGia },
            ].map((item) => (
              <div key={item.label} style={{ background: '#fff', padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Thông tin */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Thông tin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Phòng ban</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{khach.phongBan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Mã khách</span>
                <span style={{ fontWeight: 500, color: '#111827', fontFamily: 'monospace', fontSize: 12 }}>{khach.id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Lịch sử đơn */}
          <div style={{ padding: '16px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Lịch sử đơn ({lichSuDon.length})
            </div>
            {lichSuDon.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '16px 0' }}>Chưa có đơn nào</div>
            ) : (
              <Table
                dataSource={lichSuDon}
                columns={donColumns}
                rowKey="maDon"
                size="small"
                pagination={lichSuDon.length > 5 ? { pageSize: 5, simple: true } : false}
                style={{ fontSize: 12 }}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

// ── Trang chính ──────────────────────────────────────────────────
const KhachHang: React.FC = () => {
  const [danhSach,     setDanhSach]     = useState<IKhachHang[]>(DANH_SACH_KHACH);
  const [tuKhoa,       setTuKhoa]       = useState('');
  const [locVaiTro,    setLocVaiTro]    = useState<EVaiTro | ''>('');
  const [locTrangThai, setLocTrangThai] = useState<ETrangThaiKhach | ''>('');
  const [chiTietKhach, setChiTietKhach] = useState<IKhachHang | null>(null);

  // ── Stat cards từ data thật ──────────────────────────────────
  const stats = useMemo(() => {
    const tongKhach = danhSach.length;
    const hoatDong  = danhSach.filter((k) => k.trangThai === ETrangThaiKhach.HOAT_DONG).length;
    const tongCT    = danhSach.reduce((s, k) => s + k.chiTieu, 0);
    const chiTieuTB = tongKhach > 0 ? formatChiTieu(Math.round(tongCT / tongKhach)) : '0đ';
    const top = [...danhSach].sort((a, b) => b.soDon - a.soDon)[0];
    return { tongKhach, hoatDong, chiTieuTB, top };
  }, [danhSach]);

  const statCards = [
    { label: 'TỔNG KHÁCH HÀNG', value: String(stats.tongKhach), icon: TeamOutlined,       iconBg: '#dcfce7', iconColor: '#16a34a', sub: null },
    { label: 'ĐANG HOẠT ĐỘNG',  value: String(stats.hoatDong),  icon: CheckCircleFilled,   iconBg: '#dcfce7', iconColor: '#16a34a', sub: null },
    { label: 'CHI TIÊU TB',     value: stats.chiTieuTB,          icon: WalletOutlined,      iconBg: '#fed7aa', iconColor: '#ea580c', sub: 'mỗi khách' },
    {
      label: 'ĐẶT NHIỀU NHẤT',
      value: stats.top?.hoTen.split(' ').pop() ?? '—',
      icon: TrophyOutlined,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      sub: stats.top ? `${stats.top.soDon} đơn` : null,
    },
  ];

  const danhSachLoc = useMemo(() => {
    const kw = tuKhoa.toLowerCase();
    return danhSach.filter((k) => {
      const matchKw = !tuKhoa.trim() || k.hoTen.toLowerCase().includes(kw) || k.email.toLowerCase().includes(kw) || k.phongBan.toLowerCase().includes(kw);
      return matchKw && (!locVaiTro || k.vaiTro === locVaiTro) && (!locTrangThai || k.trangThai === locTrangThai);
    });
  }, [danhSach, tuKhoa, locVaiTro, locTrangThai]);


  const handleKhoa = (id: string) => {
    const khach = danhSach.find((k) => k.id === id);
    if (!khach) return;
    const isDong = khach.trangThai === ETrangThaiKhach.TAM_KHOA;
    const nextStatus = isDong ? ETrangThaiKhach.HOAT_DONG : ETrangThaiKhach.TAM_KHOA;
    Modal.confirm({
      title: isDong ? 'Mở khoá tài khoản?' : 'Khoá tài khoản?',
      content: `${isDong ? 'Mở khoá' : 'Khoá'} tài khoản "${khach.hoTen}"?`,
      okText: isDong ? 'Mở khoá' : 'Khoá',
      okType: isDong ? 'primary' : 'danger',
      cancelText: 'Huỷ',
      centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => {
        setDanhSach((prev) => prev.map((k) => k.id === id ? { ...k, trangThai: nextStatus } : k));
        message.success(isDong ? `Đã mở khoá "${khach.hoTen}"` : `Đã khoá "${khach.hoTen}"`);
      },
    });
  };

  const handleXoa = (id: string) => {
    const khach = danhSach.find((k) => k.id === id);
    if (!khach) return;
    Modal.confirm({
      title: 'Xoá khách hàng?',
      content: `Xoá "${khach.hoTen}" khỏi hệ thống? Hành động không thể hoàn tác.`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => {
        setDanhSach((prev) => prev.filter((k) => k.id !== id));
        message.success(`Đã xoá "${khach.hoTen}"`);
      },
    });
  };

  const columns: ColumnsType<IKhachHang> = [
    {
      title: 'HỌ TÊN', key: 'hoTen', width: 240,
      render: (_, r) => (
        <div className={styles.colHoTen} onClick={() => setChiTietKhach(r)} style={{ cursor: 'pointer' }}>
          <Avatar size={36} className={styles.khachAvatar} style={{ background: r.mauNen }}>{r.vietTat}</Avatar>
          <div>
            <div className={styles.khachTen}>{r.hoTen}</div>
            <div className={styles.khachEmail}>{r.email}</div>
          </div>
        </div>
      ),
    },
    { title: 'PHÒNG BAN', dataIndex: 'phongBan', key: 'phongBan', width: 120, render: (v) => <span className={styles.phongBan}>{v}</span> },
    {
      title: 'VAI TRÒ', dataIndex: 'vaiTro', key: 'vaiTro', width: 140,
      render: (v) => {
        const cfg = VAI_TRO_CONFIG[v];
        return <span className={styles.vaiTroBadge} data-vaitro={v} style={{ color: cfg.color }}>{cfg.label}</span>;
      },
    },
    { title: 'SỐ ĐƠN', dataIndex: 'soDon',   key: 'soDon',   width: 90,  align: 'right', render: (v) => <span className={styles.soDon}>{v}</span> },
    { title: 'CHI TIÊU', dataIndex: 'chiTieu', key: 'chiTieu', width: 130, align: 'right', render: (v) => <span className={styles.chiTieu}>{formatChiTieu(v)}</span> },
    { title: 'THAM GIA', dataIndex: 'thamGia', key: 'thamGia', width: 110, render: (v) => <span className={styles.thamGia}>{v}</span> },
    {
      title: 'TRẠNG THÁI', dataIndex: 'trangThai', key: 'trangThai', width: 130,
      render: (v) => {
        const cfg = TRANG_THAI_KHACH_CONFIG[v];
        return <span className={styles.trangThaiBadge} data-trangthai={v} style={{ color: cfg.color }}><CheckOutlined style={{ fontSize: 10, marginRight: 4 }} />{cfg.label}</span>;
      },
    },
    {
      title: '', key: 'actions', width: 48,
      render: (_, r) => {
        const daDong = r.trangThai === ETrangThaiKhach.TAM_KHOA;
        const menu = (
          <Menu onClick={(e) => e.domEvent.stopPropagation()}>
            <Menu.Item key="detail" icon={<EyeOutlined />} onClick={() => setChiTietKhach(r)}>Xem chi tiết</Menu.Item>
            <Menu.Item
              key="khoa"
              icon={daDong ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleKhoa(r.id)}
            >
              {daDong ? 'Mở khoá' : 'Khoá tài khoản'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="xoa" icon={<DeleteOutlined />} danger onClick={() => handleXoa(r.id)}>Xoá</Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <button className={styles.moreBtn} onClick={(e) => e.stopPropagation()}>
              <MoreOutlined />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Topbar title="Khách hàng" subtitle="Nhân viên công ty đặt món tại căng tin" />

      <div className={styles.pageBody}>
        {/* Stat cards từ data thật */}
        <div className={styles.statGrid}>
          {statCards.map((card) => (
            <div key={card.label} className={styles.statCard}>
              <div className={styles.statLeft}>
                <div className={styles.statLabel}>{card.label}</div>
                <div className={styles.statValue}>{card.value}</div>
                {card.sub && <div className={styles.statSub}>{card.sub}</div>}
              </div>
              <div className={styles.statIconWrap} style={{ background: card.iconBg }}>
                <card.icon style={{ fontSize: 20, color: card.iconColor }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tab trạng thái */}
        <div className={styles.tabsRow}>
          {([
            { key: '',                             label: 'Tất cả',       count: danhSach.length },
            { key: ETrangThaiKhach.HOAT_DONG,      label: '✅ Hoạt động', count: danhSach.filter(k => k.trangThai === ETrangThaiKhach.HOAT_DONG).length },
            { key: ETrangThaiKhach.TAM_KHOA,       label: '🔒 Tạm khoá', count: danhSach.filter(k => k.trangThai === ETrangThaiKhach.TAM_KHOA).length },
          ] as const).map((t) => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${locTrangThai === t.key ? styles.tabActive : ''}`}
              onClick={() => setLocTrangThai(t.key as ETrangThaiKhach | '')}
            >
              {t.label}
              {t.count > 0 && (
                <span className={styles.tabCount}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.tableSection}>
          <PageToolbar
            searchPlaceholder="Tìm theo tên, email, phòng ban..."
            searchValue={tuKhoa}
            onSearch={setTuKhoa}
            filters={
              <>
                <Badge count={locVaiTro ? 1 : 0} size="small" offset={[-4, 4]}>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu
                        selectedKeys={[locVaiTro || 'tat_ca']}
                        onClick={({ key }) => setLocVaiTro(key === 'tat_ca' ? '' : (key as EVaiTro))}
                      >
                        <Menu.Item key="tat_ca">Tất cả vai trò</Menu.Item>
                        <Menu.Divider />
                        {Object.entries(VAI_TRO_CONFIG).map(([k, c]) => (
                          <Menu.Item key={k}>{c.label}</Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                      {locVaiTro ? VAI_TRO_CONFIG[locVaiTro]?.label : 'Vai trò'}
                    </Button>
                  </Dropdown>
                </Badge>
              </>
            }
          />

          {danhSachLoc.length === 0 ? (
            <EmptyState
              kind="customers"
              desc={tuKhoa || locVaiTro ? 'Không tìm thấy khách hàng phù hợp.' : undefined}
            />
          ) : (
            <TableStaticData<IKhachHang>
              dataSource={danhSachLoc}
              columns={columns}
              rowKey="id"
              searchValue={tuKhoa}
              searchFields={['hoTen', 'email', 'phongBan']}
              pageSize={10}
              className={styles.table}
              rowClassName={styles.tableRow}
              onRow={(r) => ({ onClick: () => setChiTietKhach(r), style: { cursor: 'pointer' } })}
            />
          )}
        </div>
      </div>

      <ChiTietKhachDrawer
        khach={chiTietKhach}
        onClose={() => setChiTietKhach(null)}
        onKhoa={handleKhoa}
        onXoa={handleXoa}
      />
    </>
  );
};

export default KhachHang;
