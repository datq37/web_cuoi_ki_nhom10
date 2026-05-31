import {
  AppstoreOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  FireOutlined,
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row,
  Select,
  Switch,
  Tag,
  message,
  notification,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import { DANH_SACH_NGUYEN_LIEU } from '@/services/Quản Trị/Kho Nguyên Liệu';
import { DANH_SACH_MON } from '@/services/Quản Trị/Quản Lý Món';
import { EDanhMuc, IMonAn } from '@/services/Quản Trị/Quản Lý Món/typing';
import styles from './index.less';

interface IMonAnLocal extends IMonAn {
  hinhAnh?: string;
  nguyenLieu?: string[];
  coSan?: boolean;  // true = đang bán, false = tạm hết (default true)
}

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

interface MonCardProps {
  mon: IMonAnLocal;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCoSan: (id: string, coSan: boolean) => void;
}

const MonCard: React.FC<MonCardProps> = ({ mon, onClick, onEdit, onDelete, onToggleCoSan }) => {
  const dangBan = mon.coSan !== false;
  return (
    <div
      className={`${styles.monCard} ${!dangBan ? styles.monCardOff : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.cardImage} style={mon.hinhAnh ? {} : { background: mon.mauNen }}>
        {mon.hinhAnh ? (
          <img src={mon.hinhAnh} alt={mon.ten} className={styles.cardImg} />
        ) : (
          <PictureOutlined className={styles.cardNoImg} />
        )}
        {mon.isHot && dangBan && (
          <span className={styles.hotBadge}>
            <FireOutlined style={{ marginRight: 3 }} />HOT
          </span>
        )}
        {!dangBan && (
          <span className={styles.tamHetBadge}>Tạm hết</span>
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
          <span className={styles.statItem}><FireOutlined className={styles.statIcon} /> {mon.calo} kcal</span>
          <span className={styles.statItem}>
            <StarFilled className={styles.starIcon} />
            {mon.danhGia}
          </span>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.cardGia}>{formatGia(mon.giaBan)}</span>
          <div className={styles.cardActions}>
            <Switch
              size="small"
              checked={dangBan}
              onClick={(checked, e) => {
                e.stopPropagation();
                onToggleCoSan(mon.id, checked);
              }}
              title={dangBan ? 'Đang bán — click để tắt' : 'Tạm hết — click để bật'}
            />
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
};

interface MonFormProps {
  open: boolean;
  initial: IMonAnLocal | null;
  onCancel: () => void;
  onSubmit: (values: Partial<IMonAnLocal>) => void;
}

const MonForm: React.FC<MonFormProps> = ({ open, initial, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imgPreview, setImgPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setImgPreview(initial?.hinhAnh ?? '');
    if (initial) {
      form.setFieldsValue({ ...initial, nguyenLieu: initial.nguyenLieu ?? [] });
    } else {
      form.resetFields();
      form.setFieldsValue({
        danhMuc:    EDanhMuc.MON_CHINH,
        isHot:      false,
        mauNen:     PRESET_GRADIENTS[0],
        danhGia:    5,
        thoiGian:   10,
        calo:       0,
        nguyenLieu: [],
      });
    }
  }, [open, initial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgPreview(ev.target!.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, hinhAnh: imgPreview || undefined });
    } catch {
      // antd hiển thị lỗi tự động
    }
  };

  return (
    <Modal
      visible={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Cập nhật' : 'Thêm món'}
      cancelText="Huỷ"
      width={660}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Thêm món mới'}
      destroyOnClose
      okButtonProps={{ type: 'primary' }}
      className={styles.formModal}
      transitionName="ant-move-up"
    >
      <Form form={form} layout="vertical" preserve={false} style={{ marginTop: 8 }}>
        <Form.Item name="id" hidden><Input /></Form.Item>

        <Form.Item label="Hình ảnh món ăn">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div
            className={`${styles.imgUploadArea} ${imgPreview ? styles.imgUploadHasImg : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imgPreview ? (
              <>
                <img src={imgPreview} alt="preview" className={styles.imgPreviewImg} />
                <div className={styles.imgPreviewOverlay}>
                  <PictureOutlined style={{ marginRight: 6 }} />Thay ảnh
                </div>
              </>
            ) : (
              <div className={styles.imgEmptyState}>
                <PictureOutlined className={styles.imgEmptyIcon} />
                <div className={styles.imgEmptyText}>Click để chọn ảnh từ máy</div>
                <div className={styles.imgEmptyHint}>PNG, JPG, WEBP · Khuyến nghị 800×600 px</div>
              </div>
            )}
          </div>
          {imgPreview && (
            <button
              type="button"
              className={styles.imgRemoveBtn}
              onClick={() => setImgPreview('')}
            >
              <CloseOutlined style={{ marginRight: 4 }} />Xoá ảnh
            </button>
          )}
        </Form.Item>

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
        </Row>

        <Row gutter={16}>
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
          <Col span={12}>
            <Form.Item name="calo" label="Calo">
              <InputNumber style={{ width: '100%' }} min={0} addonAfter="kcal" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[{ required: true, message: 'Nhập mô tả ngắn về món' }]}
        >
          <Input.TextArea rows={3} maxLength={200} showCount placeholder="Mô tả ngắn về món ăn..." />
        </Form.Item>

        <Form.Item name="nguyenLieu" label="Nguyên liệu sử dụng">
          <Select
            mode="multiple"
            placeholder="Chọn nguyên liệu từ kho..."
            optionFilterProp="label"
            showArrow
            allowClear
          >
            {DANH_SACH_NGUYEN_LIEU.map((nl) => (
              <Select.Option key={nl.id} value={nl.id} label={nl.ten}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{nl.ten}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{nl.donVi}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* hidden — giữ giá trị khi edit, dùng default khi tạo mới */}
        <Form.Item name="mauNen" hidden><Input /></Form.Item>
        <Form.Item name="isHot"  hidden valuePropName="checked"><Switch /></Form.Item>

        <Form.Item name="danhGia" label="Đánh giá mặc định" style={{ marginBottom: 0 }}>
          <InputNumber style={{ width: '100%' }} min={1} max={5} step={0.1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface MonDetailProps {
  mon: IMonAnLocal | null;
  onClose: () => void;
  onEdit: () => void;
}

const MonDetail: React.FC<MonDetailProps> = ({ mon, onClose, onEdit }) => {
  if (!mon) return null;

  const ingredientList = (mon.nguyenLieu ?? [])
    .map((id) => DANH_SACH_NGUYEN_LIEU.find((n) => n.id === id))
    .filter(Boolean) as (typeof DANH_SACH_NGUYEN_LIEU[number])[];

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
        height: 180,
        background: mon.hinhAnh ? undefined : mon.mauNen,
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {mon.hinhAnh ? (
          <img
            src={mon.hinhAnh}
            alt={mon.ten}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PictureOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.6)' }} />
        )}
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

        {/* Nguyên liệu */}
        {ingredientList.length > 0 && (
          <div style={{ marginTop: 18, paddingBottom: 8 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#9ca3af',
              letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8,
            }}>
              Nguyên liệu
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ingredientList.map((nl) => (
                <Tag
                  key={nl.id}
                  style={{ borderRadius: 20, fontSize: 12, padding: '2px 10px', margin: 0 }}
                >
                  {nl.ten} <span style={{ color: '#9ca3af' }}>({nl.donVi})</span>
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const QuanLyMon: React.FC = () => {
  const [items, setItems] = useState<IMonAnLocal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_dishes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DANH_SACH_MON as IMonAnLocal[];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_dishes', JSON.stringify(items));
    }
  }, [items]);

  const [activeTab,    setActiveTab]    = useState<EDanhMuc | 'tat_ca'>('tat_ca');
  const [tuKhoa,       setTuKhoa]       = useState('');
  const [isGrid,       setIsGrid]       = useState(true);
  const [formOpen,     setFormOpen]     = useState(false);
  const [editing,      setEditing]      = useState<IMonAnLocal | null>(null);
  const [viewing,      setViewing]      = useState<IMonAnLocal | null>(null);
  const [filterCoSan,  setFilterCoSan]  = useState<'all' | 'dang_ban' | 'tam_het'>('all');

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
    if (filterCoSan === 'dang_ban') ds = ds.filter((m) => m.coSan !== false);
    if (filterCoSan === 'tam_het')  ds = ds.filter((m) => m.coSan === false);
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      ds = ds.filter((m) => m.ten.toLowerCase().includes(kw) || m.moTa.toLowerCase().includes(kw));
    }
    return ds;
  }, [activeTab, tuKhoa, filterCoSan, items]);

  const handleToggleCoSan = (id: string, coSan: boolean) => {
    const mon = items.find((m) => m.id === id);
    if (!mon) return;
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, coSan } : m));
    const key = `notif_${id}`;
    notification.open({
      key,
      message: coSan ? `Đã bật "${mon.ten}"` : `Đã tắt "${mon.ten}"`,
      description: coSan ? 'Món đang được bán.' : 'Món tạm thời ẩn khỏi thực đơn.',
      duration: 4,
      btn: (
        <Button
          size="small"
          onClick={() => {
            setItems((prev) => prev.map((m) => m.id === id ? { ...m, coSan: !coSan } : m));
            notification.close(key);
            message.info('Đã hoàn tác');
          }}
        >
          Hoàn tác
        </Button>
      ),
    });
  };

  const handleDelete = (mon: IMonAnLocal) => {
    Modal.confirm({
      title: 'Xác nhận xoá món?',
      content: `Xoá "${mon.ten}" khỏi thực đơn? Hành động không thể hoàn tác.`,
      okType: 'danger', okText: 'Xoá', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => {
        setItems((prev) => prev.filter((i) => i.id !== mon.id));
        message.success(`Đã xoá "${mon.ten}"`);
      },
    });
  };

  const handleSubmit = (values: Partial<IMonAnLocal>) => {
    if (values.id) {
      setItems((prev) => prev.map((i) => i.id === values.id ? { ...i, ...values } as IMonAnLocal : i));
      message.success('Đã cập nhật món');
    } else {
      const newItem: IMonAnLocal = { ...values, id: `mon_${Date.now()}` } as IMonAnLocal;
      setItems((prev) => [newItem, ...prev]);
      message.success('Đã thêm món mới');
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Topbar title="Quản lý món ăn" />

      <div className={styles.pageBody}>
          {/* Tab danh mục — hàng riêng */}
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

          {/* Toolbar */}
          <PageToolbar
            searchPlaceholder="Tìm kiếm món ăn..."
            searchValue={tuKhoa}
            onSearch={setTuKhoa}
            filters={
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    selectedKeys={[filterCoSan]}
                    onClick={({ key }) => setFilterCoSan(key as typeof filterCoSan)}
                  >
                    <Menu.Item key="all">Tất cả</Menu.Item>
                    <Menu.Item key="dang_ban">🟢 Đang bán</Menu.Item>
                    <Menu.Item key="tam_het">🔴 Tạm hết</Menu.Item>
                  </Menu>
                }
              >
                <Button icon={<FilterOutlined />} className={styles.btnFilter}>
                  {filterCoSan === 'all' ? 'Bộ lọc' : filterCoSan === 'dang_ban' ? 'Đang bán' : 'Tạm hết'}
                </Button>
              </Dropdown>
            }
            actions={
              <>
                <div className={styles.viewToggle}>
                  <button className={`${styles.toggleBtn} ${isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(true)} title="Dạng lưới"><AppstoreOutlined /></button>
                  <button className={`${styles.toggleBtn} ${!isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(false)} title="Dạng danh sách"><UnorderedListOutlined /></button>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addBtn}
                  onClick={() => { setEditing(null); setFormOpen(true); }}
                >
                  Thêm món mới
                </Button>
              </>
            }
          />

          <div className={isGrid ? styles.gridView : styles.listView}>
            {danhSachLoc.map((mon) => (
              <MonCard
                key={mon.id}
                mon={mon}
                onClick={() => setViewing(mon)}
                onEdit={() => { setEditing(mon); setFormOpen(true); }}
                onDelete={() => handleDelete(mon)}
                onToggleCoSan={handleToggleCoSan}
              />
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy món ăn phù hợp</div>
            )}
          </div>
      </div>

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
    </>
  );
};

export default QuanLyMon;
