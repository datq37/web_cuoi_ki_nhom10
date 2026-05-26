import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  message,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_KHU_VUC,
  LOAI_BAN_LABEL,
  PRESET_COLORS,
  SUC_CHUA_LOAI,
  TRANG_THAI_BAN_CONFIG,
} from '@/services/Quản Trị/Cơ Sở Vật Chất';
import { ELoaiBan, ETrangThaiBan, IBan, IKhuVuc } from '@/services/Quản Trị/Cơ Sở Vật Chất/typing';
import styles from './index.less';

// ── BanChip ─────────────────────────────────────────────────────
interface BanChipProps {
  ban: IBan;
  onClick: () => void;
}

const BAN_CHIP_STYLE: Record<ETrangThaiBan, { bg: string; color: string; border: string }> = {
  [ETrangThaiBan.SAN_SANG]:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  [ETrangThaiBan.DANG_DUNG]: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  [ETrangThaiBan.BAO_TRI]:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const BanChip: React.FC<BanChipProps> = ({ ban, onClick }) => {
  const s = BAN_CHIP_STYLE[ban.trangThai];
  return (
    <div
      className={styles.tableChip}
      style={{ background: s.bg, borderColor: s.border }}
      onClick={onClick}
      title={`${ban.so} · ${LOAI_BAN_LABEL[ban.loai]}${ban.ghiChu ? ` · ${ban.ghiChu}` : ''}`}
    >
      <span className={styles.chipSo} style={{ color: s.color }}>{ban.so}</span>
      <span className={styles.chipLoai} style={{ color: s.color }}>{SUC_CHUA_LOAI[ban.loai]}c</span>
    </div>
  );
};

// ── KhuVucCard ──────────────────────────────────────────────────
interface KhuVucCardProps {
  khu: IKhuVuc;
  onEditKhu: () => void;
  onDeleteKhu: () => void;
  onAddBan: () => void;
  onClickBan: (ban: IBan) => void;
}

const KhuVucCard: React.FC<KhuVucCardProps> = ({
  khu, onEditKhu, onDeleteKhu, onAddBan, onClickBan,
}) => {
  const sanSang  = khu.danhSachBan.filter((b) => b.trangThai === ETrangThaiBan.SAN_SANG).length;
  const dangDung = khu.danhSachBan.filter((b) => b.trangThai === ETrangThaiBan.DANG_DUNG).length;
  const baoTri   = khu.danhSachBan.filter((b) => b.trangThai === ETrangThaiBan.BAO_TRI).length;
  const tongSuc  = khu.danhSachBan.reduce((s, b) => s + b.sucChua, 0);

  return (
    <div className={styles.areaCard}>
      <div className={styles.areaCardTop} style={{ background: khu.mau }} />

      <div className={styles.areaCardBody}>
        {/* Header */}
        <div className={styles.areaCardHeader}>
          <div className={styles.areaCardTitleWrap}>
            <div className={styles.areaCardName}>{khu.ten}</div>
            <div className={styles.areaCardMoTa}>{khu.moTa}</div>
          </div>
          <div className={styles.areaCardActions}>
            <button className={styles.iconBtn} onClick={onEditKhu} title="Chỉnh sửa khu vực">
              <EditOutlined />
            </button>
            <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={onDeleteKhu} title="Xoá khu vực">
              <DeleteOutlined />
            </button>
          </div>
        </div>

        {/* Capacity summary */}
        <div className={styles.capRow}>
          <div className={styles.capItem}>
            <span className={styles.capDot} style={{ background: '#16a34a' }} />
            <span className={styles.capNum}>{sanSang}</span> sẵn
          </div>
          <div className={styles.capItem}>
            <span className={styles.capDot} style={{ background: '#ea580c' }} />
            <span className={styles.capNum}>{dangDung}</span> dùng
          </div>
          {baoTri > 0 && (
            <div className={styles.capItem}>
              <span className={styles.capDot} style={{ background: '#dc2626' }} />
              <span className={styles.capNum}>{baoTri}</span> BT
            </div>
          )}
          <div className={styles.capItem} style={{ marginLeft: 'auto' }}>
            <TeamOutlined style={{ fontSize: 11 }} />
            <span className={styles.capNum}>{tongSuc}</span> chỗ
          </div>
        </div>

        {/* Table chips */}
        <div className={styles.tableGrid}>
          {khu.danhSachBan.map((ban) => (
            <BanChip key={ban.id} ban={ban} onClick={() => onClickBan(ban)} />
          ))}
          <button className={styles.addTableBtn} onClick={onAddBan} title="Thêm bàn">
            <PlusOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── BanModal (thêm / chỉnh sửa bàn) ─────────────────────────────
interface BanModalProps {
  open: boolean;
  initial: IBan | null;
  onCancel: () => void;
  onSubmit: (data: Omit<IBan, 'id'>) => void;
  onDelete?: () => void;
}

const BanModal: React.FC<BanModalProps> = ({ open, initial, onCancel, onSubmit, onDelete }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
      form.setFieldsValue({ loai: ELoaiBan.BON, trangThai: ETrangThaiBan.SAN_SANG });
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        sucChua: SUC_CHUA_LOAI[values.loai as ELoaiBan],
      });
    });
  };

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa bàn ${initial.so}` : 'Thêm bàn mới'}
      width={460}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu' : 'Thêm bàn'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.modal}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {initial && onDelete ? (
            <Button danger onClick={onDelete} icon={<DeleteOutlined />}>Xoá bàn</Button>
          ) : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={onCancel}>Huỷ</Button>
            <Button type="primary" onClick={handleOk}>{initial ? 'Lưu' : 'Thêm bàn'}</Button>
          </div>
        </div>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="so"
            label="Số bàn"
            rules={[
              { required: true, message: 'Nhập số bàn' },
              { max: 6, message: 'Tối đa 6 ký tự' },
            ]}
          >
            <Input placeholder="VD: A09" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item name="loai" label="Loại bàn" rules={[{ required: true }]}>
            <Select>
              {Object.entries(LOAI_BAN_LABEL).map(([val, lbl]) => (
                <Select.Option key={val} value={val}>{lbl}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
          <Select>
            {Object.entries(TRANG_THAI_BAN_CONFIG).map(([val, cfg]) => (
              <Select.Option key={val} value={val}>
                <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input placeholder="VD: Chân bàn bị lỏng..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── KhuVucModal (thêm / chỉnh sửa khu vực) ───────────────────────
interface KhuVucModalProps {
  open: boolean;
  initial: IKhuVuc | null;
  onCancel: () => void;
  onSubmit: (data: Pick<IKhuVuc, 'ten' | 'moTa' | 'mau'>) => void;
}

const KhuVucModal: React.FC<KhuVucModalProps> = ({ open, initial, onCancel, onSubmit }) => {
  const [form]    = Form.useForm();
  const [mau, setMau] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({ ten: initial.ten, moTa: initial.moTa });
      setMau(initial.mau);
    } else {
      form.resetFields();
      setMau(PRESET_COLORS[0]);
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, mau });
    });
  };

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Thêm khu vực mới'}
      width={480}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu' : 'Thêm khu vực'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.modal}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="ten"
          label="Tên khu vực"
          rules={[
            { required: true, message: 'Nhập tên khu vực' },
            { max: 60, message: 'Tối đa 60 ký tự' },
          ]}
        >
          <Input placeholder="VD: Khu D – Tầng 2" />
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[{ max: 120, message: 'Tối đa 120 ký tự' }]}
        >
          <Input.TextArea rows={2} showCount maxLength={120} placeholder="Mô tả ngắn về khu vực..." />
        </Form.Item>

        <Form.Item label="Màu nhận diện">
          <div className={styles.colorPicker}>
            {PRESET_COLORS.map((c) => (
              <div
                key={c}
                className={`${styles.colorSwatch} ${mau === c ? styles.colorSwatchActive : ''}`}
                style={{ background: c }}
                onClick={() => setMau(c)}
              />
            ))}
          </div>
          {/* Preview band */}
          <div style={{
            marginTop: 10, height: 6, borderRadius: 99,
            background: mau, transition: 'background 0.2s',
          }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── CoSoVatChat (main page) ───────────────────────────────────────
const CoSoVatChat: React.FC = () => {
  const [khuVucs, setKhuVucs] = useState<IKhuVuc[]>(DANH_SACH_KHU_VUC);

  // Modal state
  const [khuModal,  setKhuModal]  = useState(false);
  const [editingKhu, setEditingKhu] = useState<IKhuVuc | null>(null);

  const [banModal,  setBanModal]  = useState(false);
  const [editingBan, setEditingBan] = useState<IBan | null>(null);
  const [targetKhuId, setTargetKhuId] = useState<string | null>(null);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const allBan = khuVucs.flatMap((k) => k.danhSachBan);
    return {
      tongKhu:   khuVucs.length,
      tongBan:   allBan.length,
      sanSang:   allBan.filter((b) => b.trangThai === ETrangThaiBan.SAN_SANG).length,
      baoTri:    allBan.filter((b) => b.trangThai === ETrangThaiBan.BAO_TRI).length,
      tongSucChua: allBan.reduce((s, b) => s + b.sucChua, 0),
    };
  }, [khuVucs]);

  const STAT_CARDS = [
    {
      label: 'KHU VỰC',
      value: stats.tongKhu,
      sub: `${stats.tongSucChua} chỗ ngồi tổng`,
      iconBg: '#eff6ff', iconColor: '#3b82f6',
      Icon: TableOutlined,
    },
    {
      label: 'TỔNG BÀN',
      value: stats.tongBan,
      sub: 'Trong tất cả khu vực',
      iconBg: '#f0fdf4', iconColor: '#16a34a',
      Icon: TableOutlined,
    },
    {
      label: 'SẴN SÀNG',
      value: stats.sanSang,
      sub: `${stats.tongBan > 0 ? Math.round((stats.sanSang / stats.tongBan) * 100) : 0}% bàn khả dụng`,
      iconBg: '#f0fdf4', iconColor: '#16a34a',
      Icon: TeamOutlined,
    },
    {
      label: 'BẢO TRÌ',
      value: stats.baoTri,
      sub: stats.baoTri > 0 ? 'Cần kiểm tra' : 'Không có bàn hỏng',
      iconBg: '#fef2f2', iconColor: '#dc2626',
      Icon: ToolOutlined,
    },
  ];

  // ── Khu vực handlers ─────────────────────────────────────────
  const openAddKhu = () => { setEditingKhu(null); setKhuModal(true); };
  const openEditKhu = (khu: IKhuVuc) => { setEditingKhu(khu); setKhuModal(true); };

  const handleDeleteKhu = (khu: IKhuVuc) => {
    Modal.confirm({
      title: `Xoá khu vực "${khu.ten}"?`,
      content: `Khu vực này có ${khu.danhSachBan.length} bàn. Toàn bộ dữ liệu bàn sẽ bị xoá.`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setKhuVucs((prev) => prev.filter((k) => k.id !== khu.id));
        message.success(`Đã xoá khu vực "${khu.ten}"`);
      },
    });
  };

  const handleSubmitKhu = (data: Pick<IKhuVuc, 'ten' | 'moTa' | 'mau'>) => {
    if (editingKhu) {
      setKhuVucs((prev) => prev.map((k) =>
        k.id === editingKhu.id ? { ...k, ...data } : k,
      ));
      message.success('Đã cập nhật khu vực');
    } else {
      const newKhu: IKhuVuc = { ...data, id: `kv_${Date.now()}`, danhSachBan: [] };
      setKhuVucs((prev) => [...prev, newKhu]);
      message.success(`Đã thêm khu vực "${data.ten}"`);
    }
    setKhuModal(false);
  };

  // ── Bàn handlers ──────────────────────────────────────────────
  const openAddBan = (khuId: string) => {
    setTargetKhuId(khuId); setEditingBan(null); setBanModal(true);
  };

  const openEditBan = (khuId: string, ban: IBan) => {
    setTargetKhuId(khuId); setEditingBan(ban); setBanModal(true);
  };

  const handleSubmitBan = (data: Omit<IBan, 'id'>) => {
    if (!targetKhuId) return;
    setKhuVucs((prev) => prev.map((k) => {
      if (k.id !== targetKhuId) return k;
      if (editingBan) {
        return {
          ...k,
          danhSachBan: k.danhSachBan.map((b) =>
            b.id === editingBan.id ? { ...b, ...data } : b,
          ),
        };
      }
      const newBan: IBan = { ...data, id: `b_${Date.now()}` };
      return { ...k, danhSachBan: [...k.danhSachBan, newBan] };
    }));
    message.success(editingBan ? `Đã cập nhật bàn ${data.so}` : `Đã thêm bàn ${data.so}`);
    setBanModal(false);
  };

  const handleDeleteBan = () => {
    if (!targetKhuId || !editingBan) return;
    Modal.confirm({
      title: `Xoá bàn ${editingBan.so}?`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setKhuVucs((prev) => prev.map((k) =>
          k.id === targetKhuId
            ? { ...k, danhSachBan: k.danhSachBan.filter((b) => b.id !== editingBan.id) }
            : k,
        ));
        message.success(`Đã xoá bàn ${editingBan.so}`);
        setBanModal(false);
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <Topbar title="Cơ sở vật chất" />

        <div className={styles.pageBody}>
          {/* ── Stat cards ── */}
          <div className={styles.statGrid}>
            {STAT_CARDS.map((c) => (
              <div key={c.label} className={styles.statCard}>
                <div className={styles.statLeft}>
                  <div className={styles.statLabel}>{c.label}</div>
                  <div className={styles.statValue}>{c.value}</div>
                  <div className={styles.statSub}>{c.sub}</div>
                </div>
                <div className={styles.statIconWrap} style={{ background: c.iconBg }}>
                  <c.Icon style={{ fontSize: 20, color: c.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Legend ── */}
          <div className={styles.legend}>
            {Object.entries(TRANG_THAI_BAN_CONFIG).map(([, cfg]) => (
              <div key={cfg.label} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: cfg.color }} />
                {cfg.label}
              </div>
            ))}
            <span className={styles.legendItem} style={{ marginLeft: 4, fontStyle: 'italic' }}>
              · Click vào bàn để đổi trạng thái
            </span>
          </div>

          {/* ── Area grid ── */}
          <div className={styles.areaGrid}>
            {khuVucs.map((khu) => (
              <KhuVucCard
                key={khu.id}
                khu={khu}
                onEditKhu={() => openEditKhu(khu)}
                onDeleteKhu={() => handleDeleteKhu(khu)}
                onAddBan={() => openAddBan(khu.id)}
                onClickBan={(ban) => openEditBan(khu.id, ban)}
              />
            ))}

            {/* Add area card */}
            <div className={styles.addAreaCard} onClick={openAddKhu}>
              <div className={styles.addAreaIcon}><PlusOutlined /></div>
              <div className={styles.addAreaTitle}>Thêm khu vực mới</div>
              <div className={styles.addAreaSub}>Tạo khu vực ăn uống,<br />sau đó thêm bàn vào khu</div>
            </div>
          </div>
        </div>

      {/* ── Modals ── */}
      <KhuVucModal
        open={khuModal}
        initial={editingKhu}
        onCancel={() => setKhuModal(false)}
        onSubmit={handleSubmitKhu}
      />
      <BanModal
        open={banModal}
        initial={editingBan}
        onCancel={() => setBanModal(false)}
        onSubmit={handleSubmitBan}
        onDelete={editingBan ? handleDeleteBan : undefined}
      />
    </>
  );
};

export default CoSoVatChat;
