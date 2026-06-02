import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  KeyOutlined,
  PhoneOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import ConfirmModal from '@/pages/Quản Trị/components/ConfirmModal';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import EmptyState from '@/pages/Quản Trị/components/EmptyState';
import {
  DANH_SACH_NHAN_VIEN,
  VAI_TRO_NV_CONFIG,
} from '@/services/Quản Trị/Nhân Viên Căng Tin';
import {
  EVaiTroNhanVien,
  INhanVien,
} from '@/services/Quản Trị/Nhân Viên Căng Tin/typing';
import styles from './index.less';

// Mở rộng INhanVien — không sửa typing gốc
type INhanVienEx = INhanVien & {
  soDienThoai?: string;
  ngayBatDau?:  string;
  mucLuong?:    number;
};

// Dữ liệu bổ sung cho nhân viên có sẵn
const NHAN_VIEN_EXTRA: Record<string, Partial<INhanVienEx>> = {
  nv1: { soDienThoai: '0901 234 567', ngayBatDau: '01/03/2022', mucLuong: 15000000 },
  nv2: { soDienThoai: '0912 345 678', ngayBatDau: '15/06/2021', mucLuong: 12000000 },
  nv3: { soDienThoai: '0923 456 789', ngayBatDau: '20/09/2022', mucLuong:  9000000 },
  nv4: { soDienThoai: '0934 567 890', ngayBatDau: '10/01/2023', mucLuong:  7500000 },
  nv5: { soDienThoai: '0945 678 901', ngayBatDau: '05/04/2023', mucLuong:  7000000 },
};

const DANH_SACH_NHAN_VIEN_EX: INhanVienEx[] = DANH_SACH_NHAN_VIEN.map((nv) => ({
  ...nv,
  ...(NHAN_VIEN_EXTRA[nv.id] ?? {}),
}));

const MAU_NEN_PALETTE = [
  '#f9a8d4', '#93c5fd', '#86efac', '#c4b5fd', '#fca5a5',
  '#fdba74', '#fde68a', '#6ee7b7', '#a5b4fc', '#f0abfc',
  '#7dd3fc', '#4ade80', '#fb923c', '#94a3b8', '#60a5fa',
];

function taoVietTat(hoTen: string): string {
  const words = hoTen.trim().split(/\s+/);
  if (words.length >= 2) {
    const n = words.length;
    return (words[n - 2][0] + words[n - 1][0]).toUpperCase();
  }
  return hoTen.slice(0, 2).toUpperCase();
}

function chonMauNen(danhSach: INhanVienEx[]): string {
  const daDung = new Set(danhSach.map((nv) => nv.mauNen));
  const chuaDung = MAU_NEN_PALETTE.filter((m) => !daDung.has(m));
  return chuaDung.length > 0
    ? chuaDung[0]
    : MAU_NEN_PALETTE[Math.floor(Math.random() * MAU_NEN_PALETTE.length)];
}

function thoiGianHienTai(): string {
  return dayjs().format('HH:mm DD/MM');
}

function formatLuong(luong?: number): string {
  if (!luong) return '—';
  return new Intl.NumberFormat('vi-VN').format(luong) + ' ₫';
}

// ── Modal thêm / sửa nhân viên ───────────────────────────────────
const NhanVienFormModal: React.FC<{
  open: boolean;
  initial: INhanVienEx | null;   // null = thêm mới, có giá trị = sửa
  danhSach: INhanVienEx[];
  onClose: () => void;
  onConfirm: (nv: Omit<INhanVienEx, 'id'>, id?: string) => void;
}> = ({ open, initial, danhSach, onClose, onConfirm }) => {
  const [form] = Form.useForm();
  const hoTenWatch = Form.useWatch('hoTen', form) as string | undefined;

  const isEdit  = !!initial;
  const vietTat = hoTenWatch?.trim() ? taoVietTat(hoTenWatch) : (initial?.vietTat ?? '?');
  const mauNen  = initial?.mauNen ?? chonMauNen(danhSach);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        hoTen:       initial.hoTen,
        email:       initial.email,
        soDienThoai: initial.soDienThoai,
        vaiTro:      initial.vaiTro,
        ngayBatDau:  initial.ngayBatDau ? dayjs(initial.ngayBatDau, 'DD/MM/YYYY') : undefined,
        mucLuong:    initial.mucLuong,
      });
    } else {
      form.resetFields();
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onConfirm(
        {
          hoTen:           values.hoTen.trim(),
          email:           values.email.trim(),
          soDienThoai:     values.soDienThoai?.trim() || undefined,
          ngayBatDau:      values.ngayBatDau ? values.ngayBatDau.format('DD/MM/YYYY') : undefined,
          mucLuong:        values.mucLuong || undefined,
          vaiTro:          values.vaiTro,
          vietTat:         taoVietTat(values.hoTen),
          mauNen:          mauNen,
          hoatDongGanNhat: thoiGianHienTai(),
        },
        initial?.id,
      );
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={open}
      title={isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm thành viên mới'}
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Lưu thay đổi' : 'Thêm thành viên'}
      cancelText="Huỷ"
      width={500}
      destroyOnClose
      className={styles.adminModal}
    >
      {/* Avatar preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 20 }}>
        <Avatar size={48} style={{ background: mauNen, color: '#1e3a5f', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {vietTat}
        </Avatar>
        <div>
          {isEdit && initial && (
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af', marginBottom: 3 }}>
              ID: {initial.id.toUpperCase()}
            </div>
          )}
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            {isEdit ? 'Chỉnh sửa thông tin nhân viên' : 'Ảnh đại diện được tạo tự động'}
          </div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="VD: an.nv@canteen.vn" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="soDienThoai">
            <Input placeholder="VD: 0901 234 567" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item
            label="Vai trò"
            name="vaiTro"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              {Object.entries(VAI_TRO_NV_CONFIG).map(([key, cfg]) => (
                <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày bắt đầu làm việc" name="ngayBatDau">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              style={{ width: '100%' }}
              disabledDate={(d) => d && d.isAfter(dayjs())}
            />
          </Form.Item>
        </div>

        <Form.Item label="Mức lương (₫/tháng)" name="mucLuong">
          <InputNumber
            min={0}
            step={500000}
            style={{ width: '100%' }}
            placeholder="VD: 8.000.000"
            formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(v) => Number((v ?? '').replace(/\./g, ''))}
            addonAfter="₫"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── Modal đổi quyền ──────────────────────────────────────────────
const DoiQuyenModal: React.FC<{
  nv: INhanVienEx | null;
  onClose: () => void;
  onConfirm: (id: string, vaiTro: EVaiTroNhanVien) => void;
}> = ({ nv, onClose, onConfirm }) => {
  const [selected, setSelected] = useState<EVaiTroNhanVien>(
    nv?.vaiTro ?? EVaiTroNhanVien.NHAN_VIEN_BEP,
  );

  useEffect(() => {
    if (nv) setSelected(nv.vaiTro);
  }, [nv]);

  const handleOk = () => {
    if (!nv) return;
    if (selected === nv.vaiTro) {
      message.info('Vai trò không thay đổi');
      onClose();
      return;
    }
    onConfirm(nv.id, selected);
  };

  return (
    <Modal
      visible={!!nv}
      title="Đổi quyền nhân viên"
      onCancel={onClose}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Huỷ"
      width={400}
      destroyOnClose
      className={styles.adminModal}
    >
      {nv && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size={44} style={{ background: nv.mauNen, color: '#1e3a5f', fontWeight: 700, flexShrink: 0 }}>
              {nv.vietTat}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{nv.hoTen}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{nv.email}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vai trò mới
            </div>
            <Select value={selected} onChange={setSelected} style={{ width: '100%' }} size="large">
              {Object.entries(VAI_TRO_NV_CONFIG).map(([key, cfg]) => (
                <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ── Modal chi tiết nhân viên ─────────────────────────────────────
const ChiTietNhanVienModal: React.FC<{
  nv: INhanVienEx | null;
  onClose: () => void;
  onDoiQuyen: (nv: INhanVienEx) => void;
  onSua: (nv: INhanVienEx) => void;
  onXoa: (nv: INhanVienEx) => void;
}> = ({ nv, onClose, onDoiQuyen, onSua, onXoa }) => {
  const cfg = nv ? VAI_TRO_NV_CONFIG[nv.vaiTro] : null;

  return (
    <Modal
      visible={!!nv}
      title={null}
      onCancel={onClose}
      width={460}
      destroyOnClose
      className={styles.detailModal}
      footer={[
        <Button
          key="xoa"
          danger
          icon={<DeleteOutlined />}
          onClick={() => { onClose(); if (nv) onXoa(nv); }}
          style={{ marginRight: 'auto' }}
        >
          Xoá
        </Button>,
        <Button
          key="sua"
          icon={<EditOutlined />}
          onClick={() => { onClose(); if (nv) onSua(nv); }}
        >
          Chỉnh sửa
        </Button>,
        <Button
          key="doi-quyen"
          type="primary"
          icon={<KeyOutlined />}
          onClick={() => { onClose(); if (nv) onDoiQuyen(nv); }}
        >
          Đổi quyền
        </Button>,
      ]}
    >
      {nv && cfg && (
        <>
          <div className={styles.detailHero}>
            <Avatar size={72} style={{ background: nv.mauNen, color: '#1e3a5f', fontWeight: 700, fontSize: 24 }}>
              {nv.vietTat}
            </Avatar>
            <div className={styles.detailHeroName}>{nv.hoTen}</div>
            <div className={styles.detailHeroEmail}>{nv.email}</div>
            <span className={styles.roleBadge} data-vaitro={nv.vaiTro} style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>

          <div className={styles.detailBody}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Mã nhân viên</div>
              <div className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: 12 }}>
                {nv.id.toUpperCase()}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Số điện thoại</div>
              <div className={styles.detailValue}>
                {nv.soDienThoai
                  ? <a href={`tel:${nv.soDienThoai}`} style={{ color: '#16a34a' }}>{nv.soDienThoai}</a>
                  : '—'}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Ngày bắt đầu</div>
              <div className={styles.detailValue}>{nv.ngayBatDau ?? '—'}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Mức lương</div>
              <div className={styles.detailValue} style={{ color: '#16a34a', fontWeight: 600 }}>
                {formatLuong(nv.mucLuong)}
              </div>
            </div>
            <div className={styles.detailRow} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.detailLabel}>Hoạt động gần nhất</div>
              <div className={styles.detailValue}>{nv.hoatDongGanNhat}</div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

// ── Card nhân viên ───────────────────────────────────────────────
const NhanVienCard: React.FC<{
  nv: INhanVienEx;
  onClick: (nv: INhanVienEx) => void;
}> = ({ nv, onClick }) => {
  const cfg = VAI_TRO_NV_CONFIG[nv.vaiTro];

  return (
    <div className={styles.card} onClick={() => onClick(nv)}>
      <div className={styles.cardHeader}>
        <Avatar size={52} className={styles.avatar} style={{ background: nv.mauNen, color: '#1e3a5f' }}>
          {nv.vietTat}
        </Avatar>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{nv.hoTen}</div>
          <div className={styles.cardId}>{nv.id.toUpperCase()}</div>
          <div className={styles.cardEmail}>{nv.email}</div>
          {nv.soDienThoai && (
            <div className={styles.cardPhone}>
              <PhoneOutlined style={{ fontSize: 11, marginRight: 4 }} />
              {nv.soDienThoai}
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardMeta}>
        <span className={styles.roleBadge} data-vaitro={nv.vaiTro} style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        {nv.ngayBatDau && (
          <span className={styles.lastActive}>Từ {nv.ngayBatDau}</span>
        )}
      </div>

      {nv.mucLuong && (
        <div className={styles.cardLuong}>
          {formatLuong(nv.mucLuong)}
          <span style={{ fontWeight: 400, fontSize: 11 }}>/tháng</span>
        </div>
      )}
    </div>
  );
};

// ── Trang chính ──────────────────────────────────────────────────
const NhanVienCangTin: React.FC = () => {
  const [danhSach,   setDanhSach]   = useState<INhanVienEx[]>(DANH_SACH_NHAN_VIEN_EX);
  const [chiTietNV,  setChiTietNV]  = useState<INhanVienEx | null>(null);
  const [doiQuyenNV, setDoiQuyenNV] = useState<INhanVienEx | null>(null);
  const [suaNV,      setSuaNV]      = useState<INhanVienEx | null>(null);
  const [formOpen,   setFormOpen]   = useState(false);
  const [tuKhoa,     setTuKhoa]     = useState('');
  const [locVaiTro,  setLocVaiTro]  = useState<EVaiTroNhanVien | ''>('');

  const danhSachLoc = useMemo(() => {
    let list = danhSach;
    if (locVaiTro) list = list.filter((nv) => nv.vaiTro === locVaiTro);
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      list = list.filter(
        (nv) =>
          nv.hoTen.toLowerCase().includes(kw) ||
          nv.email.toLowerCase().includes(kw) ||
          (nv.soDienThoai ?? '').includes(kw) ||
          nv.id.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [danhSach, tuKhoa, locVaiTro]);

  const handleConfirmDoiQuyen = (id: string, vaiTro: EVaiTroNhanVien) => {
    setDanhSach((prev) =>
      prev.map((nv) => nv.id === id ? { ...nv, vaiTro, hoatDongGanNhat: thoiGianHienTai() } : nv),
    );
    const ten = danhSach.find((nv) => nv.id === id)?.hoTen ?? '';
    message.success(`Đã đổi quyền ${ten} → ${VAI_TRO_NV_CONFIG[vaiTro].label}`);
    setDoiQuyenNV(null);
  };

  // Xử lý thêm mới hoặc cập nhật
  const handleFormConfirm = (data: Omit<INhanVienEx, 'id'>, id?: string) => {
    if (id) {
      // Sửa
      setDanhSach((prev) => prev.map((nv) => nv.id === id ? { ...nv, ...data } : nv));
      message.success(`Đã cập nhật thông tin ${data.hoTen}`);
      setSuaNV(null);
    } else {
      // Thêm mới
      const newNV: INhanVienEx = { ...data, id: `nv_${Date.now()}` };
      setDanhSach((prev) => [...prev, newNV]);
      message.success(`Đã thêm ${data.hoTen} (${VAI_TRO_NV_CONFIG[data.vaiTro].label})`);
    }
    setFormOpen(false);
  };

  const handleXoaNhanVien = (nv: INhanVienEx) => {
    ConfirmModal.delete({
      title: 'Xoá nhân viên?',
      content: `Xoá "${nv.hoTen}" khỏi danh sách?`,
      onOk: () => {
        setDanhSach((prev) => prev.filter((n) => n.id !== nv.id));
        message.success(`Đã xoá nhân viên "${nv.hoTen}"`);
      },
    });
  };

  const daBoBoc = tuKhoa.trim() !== '' || locVaiTro !== '';


  return (
    <>
      <Topbar title="Nhân viên căng tin" />

      <div className={styles.pageBody}>

        <PageToolbar
          searchPlaceholder="Tìm tên, email, SĐT, mã NV..."
          searchValue={tuKhoa}
          onSearch={setTuKhoa}
          filters={
            <>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    selectedKeys={[locVaiTro || 'tat_ca']}
                    onClick={({ key }) => setLocVaiTro(key === 'tat_ca' ? '' : (key as EVaiTroNhanVien))}
                  >
                    <Menu.Item key="tat_ca">Tất cả vai trò</Menu.Item>
                    <Menu.Divider />
                    {Object.entries(VAI_TRO_NV_CONFIG).map(([key, cfg]) => (
                      <Menu.Item key={key}>{cfg.label}</Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                  {locVaiTro ? VAI_TRO_NV_CONFIG[locVaiTro as EVaiTroNhanVien]?.label : 'Vai trò'}
                </Button>
              </Dropdown>
              <span className={styles.countBadge}>
                <TeamOutlined style={{ marginRight: 5 }} />
                {danhSachLoc.length} nhân viên
              </span>
            </>
          }
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.addBtn}
              onClick={() => { setSuaNV(null); setFormOpen(true); }}
            >
              Thêm thành viên
            </Button>
          }
        />

        {danhSachLoc.length === 0 ? (
          <EmptyState
            kind={daBoBoc ? 'search' : 'staff'}
            desc={daBoBoc ? 'Không tìm thấy nhân viên phù hợp.' : undefined}
            action={!daBoBoc ? { label: '+ Thêm thành viên đầu tiên', onClick: () => setFormOpen(true) } : undefined}
          />
        ) : (
          <div className={styles.grid}>
            {danhSachLoc.map((nv) => (
              <NhanVienCard
                key={nv.id}
                nv={nv}
                onClick={setChiTietNV}
              />
            ))}
          </div>
        )}
      </div>

      <NhanVienFormModal
        open={formOpen}
        initial={suaNV}
        danhSach={danhSach}
        onClose={() => { setFormOpen(false); setSuaNV(null); }}
        onConfirm={handleFormConfirm}
      />
      <ChiTietNhanVienModal
        nv={chiTietNV}
        onClose={() => setChiTietNV(null)}
        onDoiQuyen={(nv) => { setChiTietNV(null); setDoiQuyenNV(nv); }}
        onSua={(nv) => { setChiTietNV(null); setSuaNV(nv); setFormOpen(true); }}
        onXoa={(nv) => { setChiTietNV(null); handleXoaNhanVien(nv); }}
      />
      <DoiQuyenModal
        nv={doiQuyenNV}
        onClose={() => setDoiQuyenNV(null)}
        onConfirm={handleConfirmDoiQuyen}
      />
    </>
  );
};

export default NhanVienCangTin;
