import { KeyOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_NHAN_VIEN,
  VAI_TRO_NV_CONFIG,
} from '@/services/Quản Trị/Nhân Viên Căng Tin';
import {
  EVaiTroNhanVien,
  INhanVien,
} from '@/services/Quản Trị/Nhân Viên Căng Tin/typing';
import styles from './index.less';

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

function chonMauNen(danhSach: INhanVien[]): string {
  const daDung = new Set(danhSach.map((nv) => nv.mauNen));
  const chuaDung = MAU_NEN_PALETTE.filter((m) => !daDung.has(m));
  return chuaDung.length > 0
    ? chuaDung[0]
    : MAU_NEN_PALETTE[Math.floor(Math.random() * MAU_NEN_PALETTE.length)];
}

const ThemThanhVienModal: React.FC<{
  open: boolean;
  danhSach: INhanVien[];
  onClose: () => void;
  onConfirm: (nv: Omit<INhanVien, 'id'>) => void;
}> = ({ open, danhSach, onClose, onConfirm }) => {
  const [form] = Form.useForm();
  const hoTenWatch = Form.useWatch('hoTen', form) as string | undefined;

  const vietTat = hoTenWatch?.trim() ? taoVietTat(hoTenWatch) : '?';
  const mauNen  = chonMauNen(danhSach);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onConfirm({
        hoTen:            values.hoTen.trim(),
        email:            values.email.trim(),
        vaiTro:           values.vaiTro,
        vietTat:          taoVietTat(values.hoTen),
        mauNen:           chonMauNen(danhSach),
        hoatDongGanNhat:  'Vừa thêm',
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={open}
      title="Thêm thành viên mới"
      onCancel={onClose}
      onOk={handleOk}
      okText="Thêm thành viên"
      cancelText="Huỷ"
      width={440}
      destroyOnClose
      className={styles.adminModal}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 20 }}>
        <Avatar size={48} style={{ background: mauNen, color: '#1e3a5f', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
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
          <Input placeholder="VD: an.nv@canteen.vn" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="vaiTro"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò" size="large">
            {Object.entries(VAI_TRO_NV_CONFIG).map(([key, cfg]) => (
              <Select.Option key={key} value={key}>
                {cfg.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DoiQuyenModal: React.FC<{
  nv: INhanVien | null;
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
            <Select
              value={selected}
              onChange={setSelected}
              style={{ width: '100%' }}
              size="large"
            >
              {Object.entries(VAI_TRO_NV_CONFIG).map(([key, cfg]) => (
                <Select.Option key={key} value={key}>
                  {cfg.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </Modal>
  );
};

const ChiTietNhanVienModal: React.FC<{
  nv: INhanVien | null;
  onClose: () => void;
  onDoiQuyen: (nv: INhanVien) => void;
}> = ({ nv, onClose, onDoiQuyen }) => {
  const cfg = nv ? VAI_TRO_NV_CONFIG[nv.vaiTro] : null;

  return (
    <Modal
      visible={!!nv}
      title={null}
      onCancel={onClose}
      width={420}
      destroyOnClose
      className={styles.detailModal}
      footer={[
        <Button key="close" onClick={onClose}>Đóng</Button>,
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
            <Avatar
              size={72}
              style={{ background: nv.mauNen, color: '#1e3a5f', fontWeight: 700, fontSize: 24 }}
            >
              {nv.vietTat}
            </Avatar>
            <div className={styles.detailHeroName}>{nv.hoTen}</div>
            <div className={styles.detailHeroEmail}>{nv.email}</div>
            <span
              className={styles.roleBadge}
              data-vaitro={nv.vaiTro}
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>

          <div className={styles.detailBody}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Vai trò</div>
              <div className={styles.detailValue}>{cfg.label}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Viết tắt</div>
              <div className={styles.detailValue}>{nv.vietTat}</div>
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

const NhanVienCard: React.FC<{
  nv: INhanVien;
  onClick: (nv: INhanVien) => void;
  onDoiQuyen: (nv: INhanVien) => void;
}> = ({ nv, onClick, onDoiQuyen }) => {
  const cfg = VAI_TRO_NV_CONFIG[nv.vaiTro];

  return (
    <div className={styles.card} onClick={() => onClick(nv)}>
      <div className={styles.cardHeader}>
        <Avatar
          size={52}
          className={styles.avatar}
          style={{ background: nv.mauNen, color: '#1e3a5f' }}
        >
          {nv.vietTat}
        </Avatar>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{nv.hoTen}</div>
          <div className={styles.cardEmail}>{nv.email}</div>
        </div>
      </div>

      <div className={styles.cardMeta}>
        <span
          className={styles.roleBadge}
          data-vaitro={nv.vaiTro}
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
        <span className={styles.lastActive}>Hoạt động: {nv.hoatDongGanNhat}</span>
      </div>

      <div className={styles.cardActions}>
        <button
          className={styles.actionBtn}
          onClick={(e) => { e.stopPropagation(); onDoiQuyen(nv); }}
        >
          <KeyOutlined className={styles.actionIcon} />
          Đổi quyền
        </button>
      </div>
    </div>
  );
};

const AddMemberCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className={styles.addCard} onClick={onClick}>
    <div className={styles.addIconWrap}>
      <PlusOutlined className={styles.addIcon} />
    </div>
    <div className={styles.addTitle}>Thêm thành viên</div>
    <div className={styles.addSub}>Mời quản trị viên / nhân viên căng tin</div>
  </div>
);

const NhanVienCangTin: React.FC = () => {
  const [danhSach,   setDanhSach]   = useState<INhanVien[]>(DANH_SACH_NHAN_VIEN);
  const [chiTietNV,  setChiTietNV]  = useState<INhanVien | null>(null);
  const [doiQuyenNV, setDoiQuyenNV] = useState<INhanVien | null>(null);
  const [themOpen,   setThemOpen]   = useState(false);

  const handleConfirmDoiQuyen = (id: string, vaiTro: EVaiTroNhanVien) => {
    setDanhSach((prev) => prev.map((nv) => (nv.id === id ? { ...nv, vaiTro } : nv)));
    const ten = danhSach.find((nv) => nv.id === id)?.hoTen ?? '';
    message.success(`Đã đổi quyền ${ten} → ${VAI_TRO_NV_CONFIG[vaiTro].label}`);
    setDoiQuyenNV(null);
  };

  const handleThemThanhVien = (data: Omit<INhanVien, 'id'>) => {
    const newNV: INhanVien = { ...data, id: `nv_${Date.now()}` };
    setDanhSach((prev) => [...prev, newNV]);
    message.success(`Đã thêm ${data.hoTen} (${VAI_TRO_NV_CONFIG[data.vaiTro].label})`);
    setThemOpen(false);
  };

  return (
    <>
      <Topbar
        title="Nhân viên căng tin"
        subtitle="Đội ngũ quản lý, bếp và thu ngân"
      />

      <div className={styles.pageBody}>
        <div className={styles.grid}>
          {danhSach.map((nv) => (
            <NhanVienCard key={nv.id} nv={nv} onClick={setChiTietNV} onDoiQuyen={setDoiQuyenNV} />
          ))}
          <AddMemberCard onClick={() => setThemOpen(true)} />
        </div>
      </div>

      <ThemThanhVienModal
        open={themOpen}
        danhSach={danhSach}
        onClose={() => setThemOpen(false)}
        onConfirm={handleThemThanhVien}
      />
      <ChiTietNhanVienModal
        nv={chiTietNV}
        onClose={() => setChiTietNV(null)}
        onDoiQuyen={(nv) => { setChiTietNV(null); setDoiQuyenNV(nv); }}
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
