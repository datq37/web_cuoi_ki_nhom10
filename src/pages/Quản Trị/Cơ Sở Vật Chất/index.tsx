import {
  AppstoreOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Select,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableStaticData from '@/components/TableStaticData';
import EmptyState from '@/pages/Quản Trị/components/EmptyState';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import { ETrangThaiTrucTiep } from '@/services/Quản Trị/Tổng Quan/typing';
import { mockData } from '@/services/Quản Trị/Tổng Quan';
import { KEYS, store } from '@/utils/storage';
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

// ── Vật dụng & Thiết bị ──────────────────────────────────────────
type EDanhMucVD    = 'ban_ghe' | 'bat_dua' | 'noi_nieu' | 'khac';
type ETinhTrangVD  = 'tot' | 'can_sua' | 'hong';

interface IVatDung {
  id: string;
  ten: string;
  danhMuc: EDanhMucVD;
  soLuong: number;
  tinhTrang: ETinhTrangVD;
  ghiChu?: string;
}

const DANH_MUC_CONFIG: Record<EDanhMucVD, { label: string; icon: string; color: string }> = {
  ban_ghe:  { label: 'Bàn ghế',                 icon: '🪑', color: '#3b82f6' },
  bat_dua:  { label: 'Bát đũa & Dụng cụ ăn',   icon: '🥢', color: '#f97316' },
  noi_nieu: { label: 'Nồi niêu & Bếp',          icon: '🍳', color: '#dc2626' },
  khac:     { label: 'Khác',                     icon: '📦', color: '#6b7280' },
};

const TINH_TRANG_CONFIG: Record<ETinhTrangVD, { label: string; color: string; bg: string }> = {
  tot:     { label: 'Tốt',      color: '#16a34a', bg: '#f0fdf4' },
  can_sua: { label: 'Cần sửa',  color: '#d97706', bg: '#fffbeb' },
  hong:    { label: 'Hỏng',     color: '#dc2626', bg: '#fef2f2' },
};

const DANH_SACH_VAT_DUNG_INITIAL: IVatDung[] = [
  { id: 'vd1',  ten: 'Bàn ăn 4 chỗ',        danhMuc: 'ban_ghe',  soLuong: 20,  tinhTrang: 'tot'     },
  { id: 'vd2',  ten: 'Ghế nhựa',             danhMuc: 'ban_ghe',  soLuong: 80,  tinhTrang: 'tot'     },
  { id: 'vd3',  ten: 'Ghế gỗ',               danhMuc: 'ban_ghe',  soLuong: 40,  tinhTrang: 'can_sua', ghiChu: 'Một số ghế bị lung lay' },
  { id: 'vd4',  ten: 'Băng dài',             danhMuc: 'ban_ghe',  soLuong: 10,  tinhTrang: 'tot'     },
  { id: 'vd5',  ten: 'Bát inox',             danhMuc: 'bat_dua',  soLuong: 200, tinhTrang: 'tot'     },
  { id: 'vd6',  ten: 'Đũa tre',              danhMuc: 'bat_dua',  soLuong: 500, tinhTrang: 'tot'     },
  { id: 'vd7',  ten: 'Thìa inox',            danhMuc: 'bat_dua',  soLuong: 150, tinhTrang: 'tot'     },
  { id: 'vd8',  ten: 'Khay nhựa',            danhMuc: 'bat_dua',  soLuong: 100, tinhTrang: 'can_sua', ghiChu: 'Cần thay mới' },
  { id: 'vd9',  ten: 'Nồi inox lớn',         danhMuc: 'noi_nieu', soLuong: 5,   tinhTrang: 'tot'     },
  { id: 'vd10', ten: 'Chảo chống dính',       danhMuc: 'noi_nieu', soLuong: 8,   tinhTrang: 'tot'     },
  { id: 'vd11', ten: 'Dao bếp',              danhMuc: 'noi_nieu', soLuong: 15,  tinhTrang: 'tot'     },
  { id: 'vd12', ten: 'Thớt gỗ',              danhMuc: 'noi_nieu', soLuong: 6,   tinhTrang: 'hong',   ghiChu: 'Cần thay mới' },
  { id: 'vd13', ten: 'Tủ lạnh công nghiệp',  danhMuc: 'khac',     soLuong: 2,   tinhTrang: 'tot'     },
  { id: 'vd14', ten: 'Máy pha cà phê',       danhMuc: 'khac',     soLuong: 1,   tinhTrang: 'can_sua', ghiChu: 'Đang chờ sửa' },
  { id: 'vd15', ten: 'Bình nước nóng',       danhMuc: 'khac',     soLuong: 3,   tinhTrang: 'tot'     },
];

// ─────────────────────────────────────────────────────────────────

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
      data-status={ban.trangThai}
      onClick={onClick}
      title={`${ban.so} · ${LOAI_BAN_LABEL[ban.loai]}${ban.ghiChu ? ` · ${ban.ghiChu}` : ''}`}
    >
      <span className={styles.chipSo} style={{ color: s.color }}>{ban.so}</span>
      <span className={styles.chipLoai} style={{ color: s.color }}>{SUC_CHUA_LOAI[ban.loai]}c</span>
    </div>
  );
};

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

const VatDungModal: React.FC<{
  open: boolean;
  initial: IVatDung | null;
  onCancel: () => void;
  onSubmit: (data: Omit<IVatDung, 'id'>) => void;
}> = ({ open, initial, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
      form.setFieldsValue({ danhMuc: 'bat_dua', tinhTrang: 'tot', soLuong: 1 });
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => onSubmit(values));
  };

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Thêm vật dụng mới'}
      width={480}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu thay đổi' : 'Thêm'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.modal}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="ten" label="Tên vật dụng" rules={[{ required: true, message: 'Nhập tên vật dụng' }, { max: 80 }]}>
          <Input placeholder="VD: Bát inox, Ghế nhựa, Nồi lớn..." />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="danhMuc" label="Danh mục" rules={[{ required: true }]}>
            <Select>
              {Object.entries(DANH_MUC_CONFIG).map(([k, c]) => (
                <Select.Option key={k} value={k}>{c.icon} {c.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: 'Nhập số lượng' }, { type: 'number' as const, min: 0, message: 'Tối thiểu 0' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <Form.Item name="tinhTrang" label="Tình trạng" rules={[{ required: true }]}>
          <Select>
            {Object.entries(TINH_TRANG_CONFIG).map(([k, c]) => (
              <Select.Option key={k} value={k}>
                <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="VD: Cần thay mới, đang chờ sửa..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CoSoVatChat: React.FC = () => {
  const [khuVucs, setKhuVucs] = useState<IKhuVuc[]>(DANH_SACH_KHU_VUC);
  const [lastSync, setLastSync] = useState<string>('');

  // ── Auto-sync bàn theo đơn hàng ─────────────────────────────────
  const syncTrangThaiBan = useCallback(() => {
    const orders = store.get<typeof mockData.trucTiep.donHang>(KEYS.orders, mockData.trucTiep.donHang);
    const cancelledIds = new Set<string>();
    orders.forEach((o) => { if ((o.trangThai as any) === 'da_huy') cancelledIds.add(o.maDon); });

    const activeDang = orders.filter(
      (o) => !cancelledIds.has(o.maDon) &&
      (o.trangThai === ETrangThaiTrucTiep.CHO_XAC_NHAN ||
       o.trangThai === ETrangThaiTrucTiep.DANG_CHE_BIEN ||
       o.trangThai === ETrangThaiTrucTiep.SAN_SANG),
    ).length;

    setKhuVucs((prev) => {
      let dangCount = activeDang;
      return prev.map((khu) => ({
        ...khu,
        danhSachBan: khu.danhSachBan.map((ban) => {
          if (ban.trangThai === ETrangThaiBan.BAO_TRI) return ban;
          if (dangCount > 0) {
            dangCount--;
            return { ...ban, trangThai: ETrangThaiBan.DANG_DUNG };
          }
          return { ...ban, trangThai: ETrangThaiBan.SAN_SANG };
        }),
      }));
    });

    const now = new Date();
    setLastSync(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`);
  }, []);

  // Auto-sync mỗi 30 giây
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    syncTrangThaiBan();
    intervalRef.current = setInterval(syncTrangThaiBan, 30000);
    return () => clearInterval(intervalRef.current);
  }, [syncTrangThaiBan]);

  // trạng thái modal
  const [khuModal,  setKhuModal]  = useState(false);
  const [editingKhu, setEditingKhu] = useState<IKhuVuc | null>(null);

  const [banModal,  setBanModal]  = useState(false);
  const [editingBan, setEditingBan] = useState<IBan | null>(null);
  const [targetKhuId, setTargetKhuId] = useState<string | null>(null);

  // ── Tab ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'so_do_ban' | 'vat_dung'>('so_do_ban');

  // ── Vật dụng state ──────────────────────────────────────────────
  const [vatDungList, setVatDungList] = useState<IVatDung[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_vat_dung');
      if (saved) try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DANH_SACH_VAT_DUNG_INITIAL;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('admin_vat_dung', JSON.stringify(vatDungList));
  }, [vatDungList]);

  const [vdTuKhoa,         setVdTuKhoa]         = useState('');
  const [vdFilterDanhMuc,  setVdFilterDanhMuc]  = useState<EDanhMucVD | ''>('');
  const [vdFilterTinhTrang, setVdFilterTinhTrang] = useState<ETinhTrangVD | ''>('');
  const [vdFormOpen,       setVdFormOpen]       = useState(false);
  const [vdEditing,        setVdEditing]        = useState<IVatDung | null>(null);

  const vdDanhSachLoc = useMemo(() => {
    let list = vatDungList;
    if (vdFilterDanhMuc)  list = list.filter((v) => v.danhMuc === vdFilterDanhMuc);
    if (vdFilterTinhTrang) list = list.filter((v) => v.tinhTrang === vdFilterTinhTrang);
    return list;
  }, [vatDungList, vdFilterDanhMuc, vdFilterTinhTrang]);

  const vdStats = useMemo(() => {
    const tot     = vatDungList.filter((v) => v.tinhTrang === 'tot');
    const canSua  = vatDungList.filter((v) => v.tinhTrang === 'can_sua');
    const hong    = vatDungList.filter((v) => v.tinhTrang === 'hong');
    const tongSoLuong = vatDungList.reduce((s, v) => s + v.soLuong, 0);
    return { tong: vatDungList.length, tot: tot.length, canSua: canSua.length, hong: hong.length, tongSoLuong };
  }, [vatDungList]);

  const handleVdSubmit = (data: Omit<IVatDung, 'id'>) => {
    if (vdEditing) {
      setVatDungList((prev) => prev.map((v) => v.id === vdEditing.id ? { ...v, ...data } : v));
      message.success('Đã cập nhật vật dụng');
    } else {
      setVatDungList((prev) => [...prev, { ...data, id: `vd_${Date.now()}` }]);
      message.success(`Đã thêm "${data.ten}"`);
    }
    setVdFormOpen(false);
    setVdEditing(null);
  };

  const handleVdDelete = (item: IVatDung) => {
    Modal.confirm({
      title: `Xoá "${item.ten}"?`,
      content: 'Hành động không thể hoàn tác.',
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => {
        setVatDungList((prev) => prev.filter((v) => v.id !== item.id));
        message.success(`Đã xoá "${item.ten}"`);
      },
    });
  };

  const vdColumns: ColumnsType<IVatDung> = [
    {
      title: 'TÊN VẬT DỤNG',
      key: 'ten',
      render: (_: any, r: IVatDung) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: 13.5 }}>{r.ten}</div>
          {r.ghiChu && <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>{r.ghiChu}</div>}
        </div>
      ),
    },
    {
      title: 'DANH MỤC',
      dataIndex: 'danhMuc',
      key: 'danhMuc',
      width: 200,
      render: (v: EDanhMucVD) => {
        const cfg = DANH_MUC_CONFIG[v];
        return <span style={{ fontSize: 13, color: cfg.color, fontWeight: 500 }}>{cfg.icon} {cfg.label}</span>;
      },
    },
    {
      title: 'SỐ LƯỢNG',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: 110,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontWeight: 700, color: '#374151', fontSize: 14 }}>{v}</span>,
    },
    {
      title: 'TÌNH TRẠNG',
      dataIndex: 'tinhTrang',
      key: 'tinhTrang',
      width: 140,
      render: (v: ETinhTrangVD) => {
        const cfg = TINH_TRANG_CONFIG[v];
        return (
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            color: cfg.color, background: cfg.bg, borderRadius: 20, padding: '3px 12px',
          }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, r: IVatDung) => (
        <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <button className={styles.iconBtn} title="Chỉnh sửa" onClick={() => { setVdEditing(r); setVdFormOpen(true); }}>
            <EditOutlined />
          </button>
          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Xoá" onClick={() => handleVdDelete(r)}>
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

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

  const openAddKhu = () => { setEditingKhu(null); setKhuModal(true); };
  const openEditKhu = (khu: IKhuVuc) => { setEditingKhu(khu); setKhuModal(true); };

  const handleDeleteKhu = (khu: IKhuVuc) => {
    Modal.confirm({
      title: `Xoá khu vực "${khu.ten}"?`,
      content: `Khu vực này có ${khu.danhSachBan.length} bàn. Toàn bộ dữ liệu bàn sẽ bị xoá.`,
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
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
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
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

  const VD_STAT_CARDS = [
    { label: 'TỔNG LOẠI',   value: vdStats.tong,   sub: `${vdStats.tongSoLuong} đơn vị`,              iconBg: '#eff6ff', iconColor: '#3b82f6', Icon: AppstoreOutlined   },
    { label: 'ĐANG TỐT',    value: vdStats.tot,    sub: 'Loại vật dụng trong tình trạng tốt',          iconBg: '#f0fdf4', iconColor: '#16a34a', Icon: CheckCircleOutlined },
    { label: 'CẦN SỬA',     value: vdStats.canSua, sub: 'Loại vật dụng cần bảo trì / sửa chữa',       iconBg: '#fffbeb', iconColor: '#d97706', Icon: ToolOutlined        },
    { label: 'HỎNG / HẾT',  value: vdStats.hong,   sub: vdStats.hong > 0 ? 'Cần thay mới sớm' : 'Không có', iconBg: '#fef2f2', iconColor: '#dc2626', Icon: WarningOutlined    },
  ];

  return (
    <>
      <Topbar title="Cơ sở vật chất" />

      <div className={styles.pageBody}>
        {/* Tab row */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'so_do_ban' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('so_do_ban')}
          >
            Sơ đồ bàn
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'vat_dung' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('vat_dung')}
          >
            Vật dụng & Thiết bị
          </button>
        </div>

        {/* ── Tab 1: Sơ đồ bàn ─────────────────────────────────── */}
        {activeTab === 'so_do_ban' && (
          <>
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

            <div className={styles.legendBar}>
              <div className={styles.legend}>
                {Object.entries(TRANG_THAI_BAN_CONFIG).map(([, cfg]) => (
                  <div key={cfg.label} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: cfg.color }} />
                    {cfg.label}
                  </div>
                ))}
                <span className={styles.legendHint}>· Click vào bàn để đổi trạng thái</span>
              </div>
              <div className={styles.legendActions}>
                {lastSync && <span className={styles.lastSyncText}>Đồng bộ lúc {lastSync}</span>}
                <Tooltip title="Đồng bộ trạng thái bàn theo đơn hàng hiện tại">
                  <Button icon={<ReloadOutlined />} className={styles.syncBtn}
                    onClick={() => { syncTrangThaiBan(); message.success('Đã đồng bộ trạng thái bàn'); }}>
                    Sync bàn
                  </Button>
                </Tooltip>
                <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={openAddKhu}>
                  Thêm khu vực
                </Button>
              </div>
            </div>

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
            </div>
          </>
        )}

        {/* ── Tab 2: Vật dụng & Thiết bị ──────────────────────── */}
        {activeTab === 'vat_dung' && (
          <>
            <div className={styles.statGrid}>
              {VD_STAT_CARDS.map((c) => (
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

            <PageToolbar
              searchPlaceholder="Tìm tên vật dụng, ghi chú..."
              searchValue={vdTuKhoa}
              onSearch={setVdTuKhoa}
              filters={
                <>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu
                        selectedKeys={[vdFilterDanhMuc || 'tat_ca']}
                        onClick={({ key }) => setVdFilterDanhMuc(key === 'tat_ca' ? '' : (key as EDanhMucVD))}
                      >
                        <Menu.Item key="tat_ca">Tất cả danh mục</Menu.Item>
                        <Menu.Divider />
                        {Object.entries(DANH_MUC_CONFIG).map(([k, c]) => (
                          <Menu.Item key={k}>{c.icon} {c.label}</Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                      {vdFilterDanhMuc ? DANH_MUC_CONFIG[vdFilterDanhMuc].label : 'Danh mục'}
                    </Button>
                  </Dropdown>

                  <Badge count={vdFilterTinhTrang ? 1 : 0} size="small" offset={[-4, 4]}>
                    <Dropdown
                      trigger={['click']}
                      overlay={
                        <Menu
                          selectedKeys={[vdFilterTinhTrang || 'tat_ca']}
                          onClick={({ key }) => setVdFilterTinhTrang(key === 'tat_ca' ? '' : (key as ETinhTrangVD))}
                        >
                          <Menu.Item key="tat_ca">Tất cả tình trạng</Menu.Item>
                          {Object.entries(TINH_TRANG_CONFIG).map(([k, c]) => (
                            <Menu.Item key={k}>
                              <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                    >
                      <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                        {vdFilterTinhTrang ? TINH_TRANG_CONFIG[vdFilterTinhTrang].label : 'Tình trạng'}
                      </Button>
                    </Dropdown>
                  </Badge>
                </>
              }
              actions={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addBtn}
                  onClick={() => { setVdEditing(null); setVdFormOpen(true); }}
                >
                  Thêm vật dụng
                </Button>
              }
            />

            <TableStaticData<IVatDung>
              dataSource={vdDanhSachLoc}
              columns={vdColumns}
              rowKey="id"
              searchValue={vdTuKhoa}
              searchFields={['ten', 'ghiChu']}
              pageSize={12}
              locale={{ emptyText: <EmptyState kind="search" desc="Không tìm thấy vật dụng nào phù hợp" /> }}
            />
          </>
        )}
      </div>

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
      <VatDungModal
        open={vdFormOpen}
        initial={vdEditing}
        onCancel={() => { setVdFormOpen(false); setVdEditing(null); }}
        onSubmit={handleVdSubmit}
      />
    </>
  );
};

export default CoSoVatChat;
