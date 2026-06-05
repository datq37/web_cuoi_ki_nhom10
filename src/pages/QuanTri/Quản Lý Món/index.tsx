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
  SortAscendingOutlined,
  StarOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
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
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Highlight from '@/components/Highlight';
import Topbar from '@/pages/QuanTri/Topbar';
import ConfirmModal from '@/pages/QuanTri/components/ConfirmModal';
import PageToolbar from '@/pages/QuanTri/components/PageToolbar';
import { DANH_SACH_NGUYEN_LIEU } from '@/services/QuanTri/Kho Nguyên Liệu';
import { EDanhMuc, IMonAn } from '@/services/QuanTri/Quản Lý Món/typing';
import useQuanLyMonModel from '@/models/QuanTri/Quản Lý Món';
import styles from './index.less';

// IMonAnLocal — extended type, không sửa typing gốc
type IMonAnLocal = IMonAn & {
  hinhAnh?: string;
  nguyenLieu?: Array<{ id: string; ten: string; soLuong: number }>;
  file?: File | null;
};

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
  key: number | string;
  label: string;
  soLuong: number;
}

interface MonCardProps {
  mon: IMonAnLocal;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCoSan: (id: string, coSan: boolean) => void;
  onDuplicate?: () => void;
  searchKw?: string;
}

const MonCard: React.FC<MonCardProps> = ({ mon, onClick, onEdit, onDelete, onToggleCoSan, onDuplicate, searchKw }) => {
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
        <div className={styles.cardName}><Highlight text={mon.ten} search={searchKw} /></div>
        <div className={styles.cardMoTa}><Highlight text={mon.moTa || ''} search={searchKw} /></div>

        <div className={styles.cardStats}>
          <span className={styles.statItem}>
            <ClockCircleOutlined className={styles.statIcon} />
            {mon.thoiGian} phút
          </span>
          <span className={styles.statItem}><FireOutlined className={styles.statIcon} /> {mon.calo} kcal</span>
          <span className={styles.statItem}>
            <StarOutlined className={styles.starIcon} />
            {mon.danhGia}
          </span>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.cardGia}>{formatGia(mon.giaBan)}</span>
        </div>
      </div>
    </div>
  );
};

interface MonFormProps {
  open: boolean;
  initial: IMonAnLocal | null;
  categories: { id: number, name: string }[];
  ingredients: Array<{ id: string; ten: string; donVi: string }>;
  onCancel: () => void;
  onSubmit: (values: Partial<IMonAnLocal>) => void;
}

const MonForm: React.FC<MonFormProps> = ({ open, initial, categories, ingredients, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imgPreview, setImgPreview] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setImgPreview(initial?.hinhAnh ?? '');
    setFileToUpload(null);
    if (initial) {
      form.setFieldsValue({ ...initial, nguyenLieu: initial.nguyenLieu ?? [] });
    } else {
      form.resetFields();
      form.setFieldsValue({
        danhMuc:    categories[0]?.id || EDanhMuc.MON_CHINH,
        isHot:      false,
        mauNen:     PRESET_GRADIENTS[0],
        danhGia:    5,
        thoiGian:   10,
        calo:       0,
        nguyenLieu: [],
      });
    }
  }, [open, initial, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileToUpload(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImgPreview(ev.target!.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, hinhAnh: imgPreview || undefined, file: fileToUpload });
    } catch {
      // hiển thị lỗi tự động
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
      okButtonProps={{ type: 'primary', style: { borderRadius: 8 } }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
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
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
                {categories.length === 0 && DANH_MUC_OPTIONS.map((o) => (
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
          <Input.TextArea placeholder="Mô tả ngắn về món ăn..." autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <Form.List name="nguyenLieu">
          {(fields, { add, remove }) => (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: '#374151', fontWeight: 600, marginBottom: 8 }}>
                Nguyên liệu sử dụng & Định lượng (cho 1 suất)
              </div>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={12} align="middle" style={{ marginBottom: 12 }}>
                  <Col span={14}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select placeholder="Chọn nguyên liệu..." showSearch optionFilterProp="label" style={{ width: '100%' }}>
                        {ingredients.map((nl) => (
                          <Select.Option key={nl.id} value={nl.id} label={nl.ten}>
                            {nl.ten} ({nl.donVi})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      {...restField}
                      name={[name, 'soLuong']}
                      rules={[
                        { required: true, message: 'Định lượng' },
                        { type: 'number', min: 0.001, message: 'Tối thiểu > 0' }
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        placeholder="Số lượng"
                        min={0.001}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3} style={{ textAlign: 'right' }}>
                    <Button type="text" danger onClick={() => remove(name)} icon={<DeleteOutlined />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  </Col>
                </Row>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                Thêm nguyên liệu định lượng
              </Button>
            </div>
          )}
        </Form.List>

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
  onDelete: () => void;
  onToggle: () => void;
}

const MonDetail: React.FC<MonDetailProps> = ({ mon, onClose, onEdit, onDelete, onToggle }) => {
  if (!mon) return null;

  const ingredientList = (mon.nguyenLieu ?? [])
    .map((item: any) => {
      const id = typeof item === 'string' ? item : item?.id;
      const qty = typeof item === 'string' ? null : item?.soLuong;
      const nl = DANH_SACH_NGUYEN_LIEU.find((n) => n.id === id);
      return nl ? { ...nl, soLuong: qty } : null;
    })
    .filter(Boolean);

  return (
    <Modal
      visible={!!mon}
      onCancel={onClose}
      width={520}
      footer={
        <div className={styles.modalFooter}>
          {mon && (
            <div className={styles.modalFooterLeft}>
              <Switch checked={mon.coSan !== false} onChange={onToggle} />
              <span className={styles.modalFooterSwitchLabel}>{mon.coSan !== false ? 'Đang bán' : 'Tạm hết'}</span>
            </div>
          )}
          <div className={styles.modalFooterRight}>
            <Button danger ghost icon={<DeleteOutlined />} className={styles.modalBtnDanger} onClick={() => { onClose(); onDelete(); }}>Xoá</Button>
            <Button type="primary" icon={<EditOutlined />} className={styles.modalBtnPrimary} onClick={onEdit}>Chỉnh sửa</Button>
          </div>
        </div>
      }
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
                {s.star && <StarOutlined style={{ fontSize: 14 }} />}
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
              {ingredientList.map((nl: any) => (
                <Tag
                  key={nl.id}
                  style={{ borderRadius: 20, fontSize: 12, padding: '2px 10px', margin: 0 }}
                >
                  {nl.ten} {nl.soLuong !== undefined && nl.soLuong !== null ? (
                    <span style={{ color: '#6b7280' }}>({nl.soLuong} {nl.donVi}/suất)</span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>({nl.donVi})</span>
                  )}
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
  const { items, categories, ingredients, addMon, updateMon, deleteMon, toggleCoSan, tabCounts: modelTabCounts } = useQuanLyMonModel();

  const [activeTab,   setActiveTab]   = useState<number | string>('tat_ca');
  const [tuKhoa,      setTuKhoa]      = useState('');
  const [isGrid,      setIsGrid]      = useState(false);
  const [formOpen,    setFormOpen]    = useState(false);
  const [editing,     setEditing]     = useState<IMonAnLocal | null>(null);
  const [viewing,     setViewing]     = useState<IMonAnLocal | null>(null);
  const [filterCoSan, setFilterCoSan] = useState<'all' | 'dang_ban' | 'tam_het'>('all');
  const [sortBy,      setSortBy]      = useState<'mac_dinh' | 'gia_tang' | 'gia_giam' | 'danh_gia'>('mac_dinh');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tabs = useMemo<TabDanhMuc[]>(() => {
    const defaultTabs: TabDanhMuc[] = [
      { key: 'tat_ca', label: 'Tất cả', soLuong: modelTabCounts['tat_ca'] || 0 },
    ];
    
    if (categories.length > 0) {
      categories.forEach(c => {
        defaultTabs.push({
          key: c.id,
          label: c.name,
          soLuong: modelTabCounts[c.id] || 0
        });
      });
    } else {
      // Fallback if API fails
      defaultTabs.push(
        { key: EDanhMuc.MON_CHINH, label: 'Món chính', soLuong: items.filter((m) => m.danhMuc === EDanhMuc.MON_CHINH).length },
        { key: EDanhMuc.DO_UONG,   label: 'Đồ uống',   soLuong: items.filter((m) => m.danhMuc === EDanhMuc.DO_UONG).length },
        { key: EDanhMuc.AN_VAT,    label: 'Ăn vặt',    soLuong: items.filter((m) => m.danhMuc === EDanhMuc.AN_VAT).length },
        { key: EDanhMuc.MON_CHAY,  label: 'Món chay',  soLuong: items.filter((m) => m.danhMuc === EDanhMuc.MON_CHAY).length }
      );
    }
    return defaultTabs;
  }, [items, categories, modelTabCounts]);

  const danhSachLoc = useMemo(() => {
    let ds = items;
    if (activeTab !== 'tat_ca') ds = ds.filter((m) => m.danhMuc === activeTab);
    if (filterCoSan === 'dang_ban') ds = ds.filter((m) => m.coSan !== false);
    if (filterCoSan === 'tam_het')  ds = ds.filter((m) => m.coSan === false);
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      ds = ds.filter((m) => m.ten.toLowerCase().includes(kw) || m.moTa.toLowerCase().includes(kw));
    }
    // Sort
    if (sortBy === 'gia_tang') ds = [...ds].sort((a, b) => a.giaBan - b.giaBan);
    if (sortBy === 'gia_giam') ds = [...ds].sort((a, b) => b.giaBan - a.giaBan);
    if (sortBy === 'danh_gia') ds = [...ds].sort((a, b) => b.danhGia - a.danhGia);
    return ds;
  }, [activeTab, tuKhoa, filterCoSan, sortBy, items]);

  const handleToggleCoSan = async (id: string, coSan: boolean) => {
    const mon = items.find((m) => m.id === id);
    if (!mon) return;
    try {
      await toggleCoSan(id, coSan);
      message.success(coSan ? `Đã bật "${mon.ten}"` : `Đã tắt "${mon.ten}"`);
    } catch (error) {
      // lỗi
    }
  };

  const handleDelete = (mon: IMonAnLocal) => {
    ConfirmModal.delete({
      title: 'Xác nhận xoá món?',
      content: `Xoá "${mon.ten}" khỏi thực đơn?`,
      onOk: async () => { 
        await deleteMon(mon.id); 
        message.success(`Đã xoá "${mon.ten}"`); 
      },
    });
  };

  const handleSubmit = async (values: Partial<IMonAnLocal>) => {
    if (values.id) {
      await updateMon(values);
      message.success('Đã cập nhật món');
    } else {
      await addMon(values);
      message.success('Đã thêm món mới');
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleDuplicate = async (mon: IMonAnLocal) => {
    const copyValues = {
      ...mon,
      id: undefined,
      ten: `${mon.ten} (copy)`,
    };
    await addMon(copyValues);
    message.success(`Đã nhân bản "${mon.ten}"`);
  };

  const handleBulkToggle = async (coSan: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map(id => toggleCoSan(id, coSan)));
      message.success(`Đã ${coSan ? 'bật' : 'tắt'} ${selectedIds.length} món`);
      setSelectedIds([]);
    } catch (error) {}
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
              <>
                {/* View toggle sát search — giống Đơn Hàng */}
                <div className={styles.viewToggle}>
                  <button className={`${styles.toggleBtn} ${!isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(false)} title="Dạng danh sách"><UnorderedListOutlined /></button>
                  <button className={`${styles.toggleBtn} ${isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(true)} title="Dạng lưới"><AppstoreOutlined /></button>
                </div>

                <Dropdown trigger={['click']} overlay={
                  <Menu selectedKeys={[filterCoSan]} onClick={({ key }) => setFilterCoSan(key as typeof filterCoSan)}>
                    <Menu.Item key="all">Tất cả</Menu.Item>
                    <Menu.Item key="dang_ban">Đang bán</Menu.Item>
                    <Menu.Item key="tam_het">Tạm hết</Menu.Item>
                  </Menu>
                }>
                  <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                    {filterCoSan === 'all' ? 'Bộ lọc' : filterCoSan === 'dang_ban' ? 'Đang bán' : 'Tạm hết'}
                  </Button>
                </Dropdown>

                <Dropdown trigger={['click']} overlay={
                  <Menu selectedKeys={[sortBy]} onClick={({ key }) => setSortBy(key as typeof sortBy)}>
                    <Menu.Item key="mac_dinh">Mặc định</Menu.Item>
                    <Menu.Item key="gia_tang">Giá tăng dần</Menu.Item>
                    <Menu.Item key="gia_giam">Giá giảm dần</Menu.Item>
                    <Menu.Item key="danh_gia">Đánh giá cao nhất</Menu.Item>
                  </Menu>
                }>
                  <Button icon={<SortAscendingOutlined />} className={styles.btnOutline}>
                    {sortBy === 'mac_dinh' ? 'Sắp xếp' : sortBy === 'gia_tang' ? 'Giá ↑' : sortBy === 'gia_giam' ? 'Giá ↓' : 'Đánh giá ↓'}
                  </Button>
                </Dropdown>
              </>
            }
            actions={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addBtn}
                onClick={() => { setEditing(null); setFormOpen(true); }}
              >
                Thêm món mới
              </Button>
            }
          />

          {/* Bulk action bar */}
          {selectedIds.length > 0 && (
            <div className={styles.bulkMonBar}>
              <span className={styles.bulkMonCount}>Đã chọn <strong>{selectedIds.length}</strong> món</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="small" type="primary" onClick={() => handleBulkToggle(true)}>Bật tất cả</Button>
                <Button size="small" danger onClick={() => handleBulkToggle(false)}>Tắt tất cả</Button>
                <Button size="small" onClick={() => setSelectedIds([])}>Bỏ chọn</Button>
              </div>
            </div>
          )}

          <div className={isGrid ? styles.gridView : styles.listView}>
            {danhSachLoc.map((mon) => (
              <div key={mon.id} className={styles.monCardWrap}>
                <Checkbox
                  checked={selectedIds.includes(mon.id)}
                  onChange={() => toggleSelect(mon.id)}
                  className={styles.monCheckbox}
                  onClick={(e) => e.stopPropagation()}
                />
                <MonCard
                  mon={mon}
                  onClick={() => setViewing(mon)}
                  onEdit={() => { setEditing(mon); setFormOpen(true); }}
                  onDelete={() => handleDelete(mon)}
                  onToggleCoSan={handleToggleCoSan}
                  onDuplicate={() => handleDuplicate(mon)}
                  searchKw={tuKhoa}
                />
              </div>
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy món ăn phù hợp</div>
            )}
          </div>
      </div>

      <MonForm
        open={formOpen}
        initial={editing}
        categories={categories}
        ingredients={ingredients}
        onCancel={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <MonDetail
        mon={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { setEditing(viewing); setViewing(null); setFormOpen(true); }}
        onDelete={() => { if (viewing) handleDelete(viewing); setViewing(null); }}
        onToggle={() => { if (viewing) { handleToggleCoSan(viewing.id, viewing.coSan === false); setViewing(prev => prev ? { ...prev, coSan: prev.coSan === false } : null); } }}
      />
    </>
  );
};

export default QuanLyMon;
