import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FireOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  message,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import { DANH_SACH_MON } from '@/services/Quản Trị/Quản Lý Món';
import { EDanhMuc, IMonAn } from '@/services/Quản Trị/Quản Lý Món/typing';
import styles from './index.less';

// ── Helpers ──────────────────────────────────────────────────────

function formatGia(gia: number): string {
  return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
}

const PRESET_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
];

const DANH_MUC_OPTIONS = [
  { value: EDanhMuc.MON_CHINH, label: 'Món chính' },
  { value: EDanhMuc.DO_UONG,   label: 'Đồ uống'   },
  { value: EDanhMuc.AN_VAT,    label: 'Ăn vặt'    },
  { value: EDanhMuc.MON_CHAY,  label: 'Món chay'  },
];

interface TabDanhMuc {
  key: EDanhMuc | 'tat_ca';
  label: string;
  soLuong: number;
}

// ── MonCard ───────────────────────────────────────────────────────

interface MonCardProps {
  mon: IMonAn;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MonCard: React.FC<MonCardProps> = ({ mon, onClick, onEdit, onDelete }) => (
  <div className={styles.monCard} onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className={styles.cardImage} style={{ background: mon.mauNen }}>
      <span className={styles.cardEmoji}>{mon.emoji}</span>
      {mon.isHot && (
        <span className={styles.hotBadge}>
          <FireOutlined style={{ marginRight: 3 }} />HOT
        </span>
      )}
    </div>

    <div className={styles.cardBody}>
      <div className={styles.cardName}>{mon.ten}</div>
      <div className={styles.cardMoTa}>{mon.moTa}</div>

      <div className={styles.cardStats}>
        <span className={styles.statItem}>
          <ClockCircleOutlined className={styles.statIcon} />
          {mon.thoiGian} phút
        </span>
        <span className={styles.statItem}>🔥 {mon.calo} kcal</span>
        <span className={styles.statItem}>
          <StarFilled className={styles.starIcon} />
          {mon.danhGia}
        </span>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardGia}>{formatGia(mon.giaBan)}</span>
        <div className={styles.cardActions}>
          <button
            className={styles.actionBtn}
            title="Chỉnh sửa"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <EditOutlined />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionDelete}`}
            title="Xóa"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── MonForm ───────────────────────────────────────────────────────

interface MonFormProps {
  open: boolean;
  initial: IMonAn | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const MonForm: React.FC<MonFormProps> = ({ open, initial, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue(initial);
      } else {
        form.setFieldsValue({
          id:       undefined,
          danhMuc:  EDanhMuc.MON_CHINH,
          isHot:    false,
          emoji:    '🍽️',
          mauNen:   PRESET_GRADIENTS[0],
          danhGia:  5,
          thoiGian: 10,
          calo:     0,
          ten:      undefined,
          moTa:     undefined,
          giaBan:   undefined,
        });
      }
    }
  }, [open, initial]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // validation failed — antd shows field errors automatically
    }
  };

  return (
    <Modal
      visible={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Cập nhật' : 'Thêm món'}
      cancelText="Huỷ"
      width={640}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Thêm món mới'}
      destroyOnClose
      okButtonProps={{ type: 'primary' }}
      className={styles.formModal}
      transitionName="ant-move-up"
    >
      <Form form={form} layout="vertical" preserve={false} style={{ marginTop: 12 }}>
        {/* hidden id */}
        <Form.Item name="id" hidden><Input /></Form.Item>

        {/* Tên */}
        <Form.Item
          name="ten"
          label="Tên món"
          rules={[
            { required: true, message: 'Vui lòng nhập tên món' },
            { min: 2, message: 'Tên tối thiểu 2 ký tự' },
            { max: 80, message: 'Tên tối đa 80 ký tự' },
          ]}
        >
          <Input placeholder="VD: Cơm gà xôi mỡ" />
        </Form.Item>

        <Row gutter={16}>
          {/* Danh mục */}
          <Col span={12}>
            <Form.Item
              name="danhMuc"
              label="Danh mục"
              rules={[{ required: true, message: 'Chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                {DANH_MUC_OPTIONS.map((o) => (
                  <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Emoji */}
          <Col span={12}>
            <Form.Item
              name="emoji"
              label="Emoji đại diện"
              rules={[{ required: true, message: 'Nhập emoji cho món' }]}
            >
              <Input maxLength={4} placeholder="🍽️" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Giá bán */}
          <Col span={12}>
            <Form.Item
              name="giaBan"
              label="Giá bán"
              rules={[
                { required: true, message: 'Nhập giá bán' },
                { type: 'number', min: 1000, message: 'Giá tối thiểu 1.000đ' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as any}
                min={1000}
                addonAfter="đ"
                placeholder="45000"
              />
            </Form.Item>
          </Col>

          {/* Thời gian */}
          <Col span={12}>
            <Form.Item
              name="thoiGian"
              label="Thời gian chuẩn bị"
              rules={[
                { required: true, message: 'Nhập thời gian' },
                { type: 'number', min: 1, message: 'Tối thiểu 1 phút' },
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={1} addonAfter="phút" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Calo */}
          <Col span={12}>
            <Form.Item name="calo" label="Calo">
              <InputNumber style={{ width: '100%' }} min={0} addonAfter="kcal" />
            </Form.Item>
          </Col>

          {/* Đánh giá */}
          <Col span={12}>
            <Form.Item name="danhGia" label="Đánh giá mặc định">
              <InputNumber style={{ width: '100%' }} min={1} max={5} step={0.1} />
            </Form.Item>
          </Col>
        </Row>

        {/* Mô tả */}
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[{ required: true, message: 'Nhập mô tả ngắn về món' }]}
        >
          <Input.TextArea rows={3} maxLength={200} showCount placeholder="Mô tả ngắn về món ăn..." />
        </Form.Item>

        {/* Màu nền */}
        <Form.Item name="mauNen" label="Màu nền thẻ">
          <Select optionLabelProp="label">
            {PRESET_GRADIENTS.map((g, i) => (
              <Select.Option key={i} value={g} label={`Màu ${i + 1}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 64, height: 20, borderRadius: 4, background: g, flexShrink: 0 }} />
                  <span style={{ color: '#374151' }}>Màu {i + 1}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* isHot */}
        <Form.Item name="isHot" label="Gắn nhãn HOT" valuePropName="checked">
          <Switch checkedChildren="HOT" unCheckedChildren="Thường" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── MonDetail ─────────────────────────────────────────────────────

interface MonDetailProps {
  mon: IMonAn | null;
  onClose: () => void;
  onEdit: () => void;
}

const MonDetail: React.FC<MonDetailProps> = ({ mon, onClose, onEdit }) => {
  if (!mon) return null;

  return (
    <Modal
      visible={!!mon}
      onCancel={onClose}
      width={520}
      footer={[
        <Button key="close" onClick={onClose}>Đóng</Button>,
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={onEdit}>Chỉnh sửa</Button>,
      ]}
      title={null}
      destroyOnClose
      className={styles.detailModal}
      transitionName="ant-move-up"
    >
      {/* Hero */}
      <div style={{
        height: 160,
        background: mon.mauNen,
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: 80 }}>{mon.emoji}</span>
        {mon.isHot && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: '#ef4444', color: '#fff',
            padding: '3px 10px', borderRadius: 999,
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <FireOutlined /> HOT
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{mon.ten}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{mon.moTa}</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#16a34a', flexShrink: 0, marginLeft: 16 }}>
            {formatGia(mon.giaBan)}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
          {[
            { value: mon.thoiGian, unit: 'phút',  label: 'Thời gian', color: '#111827' },
            { value: mon.calo,     unit: 'kcal',   label: 'Calo',      color: '#111827' },
            { value: mon.danhGia,  unit: '/ 5',    label: 'Đánh giá',  color: '#f59e0b', star: true },
          ].map((s) => (
            <div key={s.label} style={{
              textAlign: 'center',
              padding: '12px 8px',
              background: '#f8fafc',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                {s.star && <StarFilled style={{ fontSize: 14 }} />}
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{s.unit}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// ── QuanLyMon (main page) ─────────────────────────────────────────

const QuanLyMon: React.FC = () => {
  const [items,    setItems]    = useState<IMonAn[]>(DANH_SACH_MON);
  const [activeTab, setActiveTab] = useState<EDanhMuc | 'tat_ca'>('tat_ca');
  const [tuKhoa,   setTuKhoa]   = useState('');
  const [isGrid,   setIsGrid]   = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState<IMonAn | null>(null);
  const [viewing,  setViewing]  = useState<IMonAn | null>(null);

  // Dynamic tab counts
  const tabs = useMemo<TabDanhMuc[]>(() => [
    { key: 'tat_ca',           label: 'Tất cả',    soLuong: items.length },
    { key: EDanhMuc.MON_CHINH, label: 'Món chính', soLuong: items.filter((m) => m.danhMuc === EDanhMuc.MON_CHINH).length },
    { key: EDanhMuc.DO_UONG,   label: 'Đồ uống',   soLuong: items.filter((m) => m.danhMuc === EDanhMuc.DO_UONG).length   },
    { key: EDanhMuc.AN_VAT,    label: 'Ăn vặt',    soLuong: items.filter((m) => m.danhMuc === EDanhMuc.AN_VAT).length    },
    { key: EDanhMuc.MON_CHAY,  label: 'Món chay',  soLuong: items.filter((m) => m.danhMuc === EDanhMuc.MON_CHAY).length  },
  ], [items]);

  const danhSachLoc = useMemo(() => {
    let ds = items;
    if (activeTab !== 'tat_ca') ds = ds.filter((m) => m.danhMuc === activeTab);
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      ds = ds.filter((m) => m.ten.toLowerCase().includes(kw) || m.moTa.toLowerCase().includes(kw));
    }
    return ds;
  }, [activeTab, tuKhoa, items]);

  // ── Handlers ──────────────────────────────────────────────────

  const handleDelete = (mon: IMonAn) => {
    Modal.confirm({
      title: 'Xác nhận xoá món?',
      content: `Xoá "${mon.ten}" khỏi thực đơn? Hành động không thể hoàn tác.`,
      okType: 'danger',
      okText: 'Xoá',
      cancelText: 'Huỷ',
      onOk: () => {
        setItems((prev) => prev.filter((i) => i.id !== mon.id));
        message.success(`Đã xoá "${mon.ten}"`);
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (values.id) {
      setItems((prev) => prev.map((i) => i.id === values.id ? { ...i, ...values } as IMonAn : i));
      message.success('Đã cập nhật món');
    } else {
      const newItem: IMonAn = { ...values, id: `mon_${Date.now()}` };
      setItems((prev) => [newItem, ...prev]);
      message.success('Đã thêm món mới');
    }
    setFormOpen(false);
    setEditing(null);
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Quản lý món ăn" />

        <div className={styles.pageBody}>
          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>
            <div className={styles.tabsRow}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  <span className={styles.tabCount}>{t.soLuong}</span>
                </button>
              ))}
            </div>

            <div className={styles.toolbarRight}>
              <Input
                prefix={<SearchOutlined className={styles.searchIcon} />}
                placeholder="Tìm kiếm món ăn..."
                className={styles.searchInput}
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
              />
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleBtn} ${isGrid ? styles.toggleActive : ''}`}
                  onClick={() => setIsGrid(true)}
                  title="Dạng lưới"
                >
                  <AppstoreOutlined />
                </button>
                <button
                  className={`${styles.toggleBtn} ${!isGrid ? styles.toggleActive : ''}`}
                  onClick={() => setIsGrid(false)}
                  title="Dạng danh sách"
                >
                  <UnorderedListOutlined />
                </button>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addBtn}
                onClick={() => { setEditing(null); setFormOpen(true); }}
              >
                Thêm món mới
              </Button>
            </div>
          </div>

          {/* ── Grid / List ── */}
          <div className={isGrid ? styles.gridView : styles.listView}>
            {danhSachLoc.map((mon) => (
              <MonCard
                key={mon.id}
                mon={mon}
                onClick={() => setViewing(mon)}
                onEdit={() => { setEditing(mon); setFormOpen(true); }}
                onDelete={() => handleDelete(mon)}
              />
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy món ăn phù hợp</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <MonForm
        open={formOpen}
        initial={editing}
        onCancel={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <MonDetail
        mon={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { setEditing(viewing); setViewing(null); setFormOpen(true); }}
      />
    </div>
  );
};

export default QuanLyMon;
