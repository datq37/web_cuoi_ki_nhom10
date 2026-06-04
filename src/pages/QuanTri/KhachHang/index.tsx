import {
  CheckOutlined,
  DeleteOutlined,
  FilterOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Menu,
  Modal,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState, useEffect } from 'react';
import Highlight from '@/components/Highlight';
import TableStaticData from '@/components/TableStaticData';
import Topbar from '@/pages/QuanTri/Topbar';
import PageToolbar from '@/pages/QuanTri/components/PageToolbar';
import EmptyState from '@/pages/QuanTri/components/EmptyState';
import { fmt } from '@/models/QuanTri/Tổng Quan';
import { mockData } from '@/services/QuanTri/Tổng Quan';
import {
  TRANG_THAI_KHACH_CONFIG,
  VAI_TRO_CONFIG,
} from '@/services/QuanTri/KhachHang';
import {
  ETrangThaiKhach,
  EVaiTro,
  IKhachHang,
} from '@/services/QuanTri/KhachHang/typing';
import { KEYS, store } from '@/utils/storage';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';
import type { KhachHangListResponse } from '@/services/api/types';
import styles from './index.less';

function formatChiTieu(val: number): string {
  return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
}

function laAnhDaiDien(value?: string): boolean {
  return !!value && (/^(data:image\/|https?:\/\/|\/uploads\/)/.test(value));
}

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
            <Avatar
              size={72}
              src={laAnhDaiDien(khach.avatar) ? khach.avatar : undefined}
              style={{ background: khach.mauNen, color: '#fff', fontWeight: 700, fontSize: 24 }}
            >
              {khach.vietTat}
            </Avatar>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', textAlign: 'center' }}>{khach.hoTen}</div>
            <div style={{ fontSize: 12.5, color: '#9ca3af' }}>{khach.email}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: '#f3f4f6', color: vaiTroCfg.color }}>{vaiTroCfg.label}</span>
              <Tag color={daDong ? 'default' : 'success'} style={{ margin: 0, borderRadius: 20 }}>
                {daDong ? 'Tạm khoá' : 'Hoạt động'}
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
  const [danhSach,     setDanhSach]     = useState<IKhachHang[]>([]);
  const [tuKhoa,       setTuKhoa]       = useState('');
  const [locVaiTro,    setLocVaiTro]    = useState<EVaiTro | ''>('');
  const [locTrangThai, setLocTrangThai] = useState<ETrangThaiKhach | ''>('');
  const [chiTietKhach, setChiTietKhach] = useState<IKhachHang | null>(null);

  const fetchKhachHang = async () => {
    try {
      // Backend pagination can be fetched with a large pageSize to get all for the table
      const res = await axios.get<KhachHangListResponse>(`${ip3}/khachhang?page=1&page_size=100`);
      if (res.data && res.data.items) {
        setDanhSach(res.data.items.map(SyncAdapters.mapCustomerToUI));
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
      message.error("Lỗi khi tải dữ liệu khách hàng");
    }
  };

  useEffect(() => {
    fetchKhachHang();
  }, []);

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
      onOk: async () => {
        try {
          await axios.delete(`${ip3}/khachhang/${id}`);
          setDanhSach((prev) => prev.filter((k) => k.id !== id));
          message.success(`Đã xoá "${khach.hoTen}"`);
        } catch (error) {
          console.error("Failed to delete customer:", error);
          message.error(`Không thể xoá "${khach.hoTen}". Có thể dữ liệu đang được sử dụng.`);
        }
      },
    });
  };

  const columns: ColumnsType<IKhachHang> = [
    {
      title: 'HỌ TÊN', key: 'hoTen', width: 240,
      render: (_, r) => (
        <div className={styles.colHoTen} onClick={() => setChiTietKhach(r)} style={{ cursor: 'pointer' }}>
          <Avatar
            size={36}
            src={laAnhDaiDien(r.avatar) ? r.avatar : undefined}
            className={styles.khachAvatar}
            style={{ background: r.mauNen }}
          >
            {r.vietTat}
          </Avatar>
          <div>
            <div className={styles.khachTen}><Highlight text={r.hoTen} search={tuKhoa} /></div>
            <div className={styles.khachEmail}><Highlight text={r.email} search={tuKhoa} /></div>
          </div>
        </div>
      ),
    },
    { title: 'PHÒNG BAN', dataIndex: 'phongBan', key: 'phongBan', width: 120, render: (v) => <span className={styles.phongBan}><Highlight text={v} search={tuKhoa} /></span> },
    {
      title: 'VAI TRÒ', dataIndex: 'vaiTro', key: 'vaiTro', width: 140,
      render: (v: EVaiTro) => {
        const cfg = VAI_TRO_CONFIG[v];
        return <span className={styles.vaiTroBadge} data-vaitro={v} style={{ color: cfg.color }}>{cfg.label}</span>;
      },
    },
    { title: 'SỐ ĐƠN', dataIndex: 'soDon',   key: 'soDon',   width: 90,  align: 'right', render: (v) => <span className={styles.soDon}>{v}</span> },
    { title: 'CHI TIÊU', dataIndex: 'chiTieu', key: 'chiTieu', width: 130, align: 'right', render: (v) => <span className={styles.chiTieu}>{formatChiTieu(v)}</span> },
    { title: 'THAM GIA', dataIndex: 'thamGia', key: 'thamGia', width: 110, render: (v) => <span className={styles.thamGia}>{v}</span> },
    {
      title: 'TRẠNG THÁI', dataIndex: 'trangThai', key: 'trangThai', width: 130,
      render: (v: ETrangThaiKhach) => {
        const cfg = TRANG_THAI_KHACH_CONFIG[v];
        return <span className={styles.trangThaiBadge} data-trangthai={v} style={{ color: cfg.color }}><CheckOutlined style={{ fontSize: 10, marginRight: 4 }} />{cfg.label}</span>;
      },
    },
  ];

  return (
    <>
      <Topbar title="KhachHang" />

      <div className={styles.pageBody}>
        {/* Tab trạng thái */}
        <div className={styles.tabsRow}>
          {([
            { key: '',                             label: 'Tất cả',       count: danhSach.length },
            { key: ETrangThaiKhach.HOAT_DONG,      label: 'Hoạt động', count: danhSach.filter(k => k.trangThai === ETrangThaiKhach.HOAT_DONG).length },
            { key: ETrangThaiKhach.TAM_KHOA,       label: 'Tạm khoá', count: danhSach.filter(k => k.trangThai === ETrangThaiKhach.TAM_KHOA).length },
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

        <div className={styles.tableSection}>
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
