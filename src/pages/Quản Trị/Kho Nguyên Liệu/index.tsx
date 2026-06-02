import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  HistoryOutlined,
  ImportOutlined,
  InboxOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SortAscendingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  AutoComplete,
  Badge,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Select,
  Table,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Highlight from '@/components/Highlight';
import TableStaticData from '@/components/TableStaticData';
import EmptyState from '@/pages/Quản Trị/components/EmptyState';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import { KEYS, store } from '@/utils/storage';
import { useNotif } from '@/context/NotifContext';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_NGUYEN_LIEU,
  TRANG_THAI_CONFIG,
} from '@/services/Quản Trị/Kho Nguyên Liệu';
import {
  ETrangThaiNguyenLieu,
  INguyenLieu,
} from '@/services/Quản Trị/Kho Nguyên Liệu/typing';
import styles from './index.less';

const DON_VI_OPTIONS = ['kg', 'g', 'L', 'lít', 'ml', 'thùng', 'gói', 'hộp', 'chai', 'quả', 'cái'];

function formatGia(gia: number): string {
  return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
}

function tinhPhanTram(tonKho: number, mucToiThieu: number): number {
  if (mucToiThieu === 0) return 100;
  return Math.min(100, Math.round((tonKho / (mucToiThieu * 2.5)) * 100));
}

function tinhTrangThai(tonKho: number, mucToiThieu: number): ETrangThaiNguyenLieu {
  if (tonKho === 0) return ETrangThaiNguyenLieu.HET_HANG;
  if (tonKho < mucToiThieu) return ETrangThaiNguyenLieu.SAP_HET;
  return ETrangThaiNguyenLieu.DU_HANG;
}

type TrangThaiFilter = 'all' | ETrangThaiNguyenLieu;
type NguyenLieuFormValues = Omit<INguyenLieu, 'id' | 'trangThai'>;
type ViewTab = 'danh_sach' | 'lich_su';

interface ILichSuNhap {
  id:       string;
  tenNL:    string;
  donVi:    string;
  soLuong:  number;
  giaNhap:  number;
  ngay:     string;  // 'HH:mm DD/MM/YYYY'
  ghiChu?:  string;
}

const NguyenLieuForm: React.FC<{
  open: boolean;
  initial: INguyenLieu | null;
  existingNhaCungCap: string[];
  onCancel: () => void;
  onSubmit: (values: NguyenLieuFormValues) => void;
}> = ({ open, initial, existingNhaCungCap, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const donViWatch = Form.useWatch('donVi', form) as string | undefined;
  const addonDonVi = donViWatch ?? '';

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        ten: initial.ten,
        nhaCungCap: initial.nhaCungCap,
        donVi: initial.donVi,
        tonKho: initial.tonKho,
        mucToiThieu: initial.mucToiThieu,
        giaNhap: initial.giaNhap,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ donVi: 'kg', tonKho: 0, mucToiThieu: 0, giaNhap: 0 });
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => onSubmit(values as NguyenLieuFormValues));
  };

  const ncOptions = useMemo(
    () => existingNhaCungCap.map((s) => ({ value: s })),
    [existingNhaCungCap],
  );

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Thêm nguyên liệu mới'}
      width={600}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.khoModal}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Tên nguyên liệu"
          name="ten"
          rules={[
            { required: true, message: 'Vui lòng nhập tên' },
            { min: 2, message: 'Tối thiểu 2 ký tự' },
            { max: 60, message: 'Tối đa 60 ký tự' },
          ]}
        >
          <Input placeholder="VD: Gạo Bắc Hương" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Nhà cung cấp"
            name="nhaCungCap"
            rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp' }]}
          >
            <AutoComplete
              options={ncOptions}
              filterOption={(input, opt) =>
                (opt?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
              placeholder="VD: Vinaseed"
            />
          </Form.Item>

          <Form.Item
            label="Đơn vị"
            name="donVi"
            rules={[{ required: true, message: 'Chọn đơn vị' }]}
          >
            <Select placeholder="Chọn đơn vị">
              {DON_VI_OPTIONS.map((u) => (
                <Select.Option key={u} value={u}>{u}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tồn kho hiện tại"
            name="tonKho"
            rules={[
              { required: true, message: 'Vui lòng nhập tồn kho' },
              { type: 'number', min: 0, message: 'Không được âm' },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              addonAfter={addonDonVi}
            />
          </Form.Item>

          <Form.Item
            label="Mức tối thiểu"
            name="mucToiThieu"
            rules={[
              { required: true, message: 'Vui lòng nhập mức tối thiểu' },
              { type: 'number', min: 0, message: 'Không được âm' },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              addonAfter={addonDonVi}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Giá nhập (mỗi đơn vị)"
          name="giaNhap"
          rules={[
            { required: true, message: 'Vui lòng nhập giá' },
            { type: 'number', min: 0, message: 'Không được âm' },
          ]}
        >
          <InputNumber
            min={0}
            step={1000}
            style={{ width: '100%' }}
            addonAfter="đ"
            formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v) => Number((v ?? '').replace(/,/g, ''))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const NguyenLieuRestock: React.FC<{
  open: boolean;
  item: INguyenLieu | null;
  onCancel: () => void;
  onSubmit: (id: string, soLuongNhap: number, newGiaNhap: number) => void;
}> = ({ open, item, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const soLuongWatch = Form.useWatch('soLuong', form) as number | undefined;
  const lastRef = useRef<INguyenLieu | null>(null);
  if (item) lastRef.current = item;
  const d = lastRef.current;

  const tonKhoSauNhap = (d?.tonKho ?? 0) + (soLuongWatch ?? 0);

  useEffect(() => {
    if (!open || !item) return;
    form.resetFields();
    form.setFieldsValue({
      soLuong: 1,
      giaNhap: item.giaNhap,
      ngayNhap: dayjs(),
    });
  }, [open, item]);

  const handleOk = () => {
    if (!d) return;
    form.validateFields().then((values) =>
      onSubmit(d.id, values.soLuong, values.giaNhap),
    );
  };

  return (
    <Modal
      visible={open}
      title={d ? `Nhập kho: ${d.ten}` : 'Nhập kho'}
      width={500}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Xác nhận nhập"
      cancelText="Huỷ"
      destroyOnClose
      className={styles.khoModal}
    >
      {d && (
        <>
          <div className={styles.restockCard}>
            <span>Tồn kho hiện tại</span>
            <strong>{d.tonKho} {d.donVi}</strong>
          </div>

          <Form form={form} layout="vertical" preserve={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item
                label="Số lượng nhập"
                name="soLuong"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng' },
                  { type: 'number', min: 1, message: 'Tối thiểu 1' },
                ]}
              >
                <InputNumber min={1} style={{ width: '100%' }} addonAfter={d.donVi} />
              </Form.Item>

              <Form.Item label="Giá nhập đơn vị" name="giaNhap">
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '100%' }}
                  addonAfter="đ"
                  formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => Number((v ?? '').replace(/,/g, ''))}
                />
              </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="Ngày nhập" name="ngayNhap">
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="Ghi chú" name="ghiChu">
                <Input placeholder="Ghi chú (tùy chọn)..." />
              </Form.Item>
            </div>
          </Form>

          {(soLuongWatch ?? 0) > 0 && (
            <div className={styles.restockPreview}>
              Tồn kho sau nhập:{' '}
              <strong>{d.tonKho}</strong> + <strong>{soLuongWatch}</strong> ={' '}
              <strong className={styles.restockPreviewValue}>
                {tonKhoSauNhap} {d.donVi}
              </strong>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

const BulkRestockModal: React.FC<{
  open: boolean;
  items: INguyenLieu[];
  preSelectIds: string[];
  onCancel: () => void;
  onSubmit: (updates: { id: string; soLuongNhap: number }[]) => void;
}> = ({ open, items, preSelectIds, onCancel, onSubmit }) => {
  const [checkedIds, setCheckedIds] = useState<React.Key[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const preSelectRef = useRef(preSelectIds);
  preSelectRef.current = preSelectIds;

  useEffect(() => {
    if (!open) return;
    setCheckedIds(preSelectRef.current);
    setQuantities({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const bulkTotal = useMemo(
    () =>
      (checkedIds as string[]).reduce((sum, id) => {
        const it = items.find((n) => n.id === id);
        return sum + (it ? (quantities[id] ?? 0) * it.giaNhap : 0);
      }, 0),
    [checkedIds, quantities, items],
  );

  const handleOk = () => {
    const updates = (checkedIds as string[])
      .map((id) => ({ id, soLuongNhap: quantities[id] ?? 0 }))
      .filter((u) => u.soLuongNhap > 0);
    if (updates.length === 0) {
      message.warning('Vui lòng nhập số lượng cho ít nhất một mặt hàng');
      return;
    }
    onSubmit(updates);
  };

  const bulkColumns: ColumnsType<INguyenLieu> = [
    {
      title: 'Nguyên liệu',
      dataIndex: 'ten',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.ten}</div>
          <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{r.donVi}</div>
        </div>
      ),
    },
    {
      title: 'Tồn hiện tại',
      dataIndex: 'tonKho',
      width: 105,
      render: (val, r) => {
        const cfg = TRANG_THAI_CONFIG[r.trangThai];
        return (
          <span style={{ fontWeight: 600, color: cfg.color }}>
            {val} {r.donVi}
          </span>
        );
      },
    },
    {
      title: 'Mức tối thiểu',
      dataIndex: 'mucToiThieu',
      width: 105,
      render: (val, r) => `${val} ${r.donVi}`,
    },
    {
      title: 'Số lượng nhập',
      key: 'soLuong',
      width: 140,
      render: (_, r) => (
        <InputNumber
          min={0}
          size="small"
          value={quantities[r.id] ?? 0}
          onChange={(v) => setQuantities((prev) => ({ ...prev, [r.id]: v ?? 0 }))}
          style={{ width: 110 }}
          addonAfter={r.donVi}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'thanhTien',
      width: 110,
      render: (_, r) => {
        const qty = quantities[r.id] ?? 0;
        return qty > 0 ? (
          <span style={{ color: '#16a34a', fontWeight: 600 }}>{formatGia(qty * r.giaNhap)}</span>
        ) : (
          <span style={{ color: '#d1d5db' }}>—</span>
        );
      },
    },
  ];

  return (
    <Modal
      visible={open}
      title="Tạo đơn nhập kho"
      width={780}
      onCancel={onCancel}
      footer={
        <div className={styles.bulkModalFooter}>
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 2 }}>
              TỔNG TIỀN
            </div>
            <div className={styles.bulkTotalValue}>{formatGia(bulkTotal)}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={onCancel}>Huỷ</Button>
            <Button type="primary" onClick={handleOk} className={styles.btnPrimary}>
              Xác nhận nhập kho (
              {(checkedIds as string[]).filter((id) => (quantities[id] ?? 0) > 0).length} mặt hàng)
            </Button>
          </div>
        </div>
      }
      destroyOnClose
      className={styles.khoModal}
    >
      <div style={{ marginBottom: 12, color: '#6b7280', fontSize: 13 }}>
        Chọn các mặt hàng cần nhập và điền số lượng.
      </div>
      <Table<INguyenLieu>
        rowKey="id"
        dataSource={items}
        columns={bulkColumns}
        size="small"
        pagination={false}
        scroll={{ y: 300 }}
        className={styles.bulkTable}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds,
          onChange: (keys) => setCheckedIds(keys),
        }}
      />
    </Modal>
  );
};

const NguyenLieuDetail: React.FC<{
  item: INguyenLieu | null;
  onClose: () => void;
  onEdit: () => void;
  onRestock: () => void;
  onDelete: () => void;
}> = ({ item, onClose, onEdit, onRestock, onDelete }) => {
  const lastRef = useRef<INguyenLieu | null>(null);
  if (item) lastRef.current = item;
  const d = lastRef.current;

  const pct = d ? tinhPhanTram(d.tonKho, d.mucToiThieu) : 0;
  const cfg = d ? TRANG_THAI_CONFIG[d.trangThai] : null;
  const totalValue = d ? d.tonKho * d.giaNhap : 0;
  const canNhapBox = d && d.trangThai !== ETrangThaiNguyenLieu.DU_HANG
    ? Math.max(0, d.mucToiThieu * 2 - d.tonKho)
    : 0;

  return (
    <Modal
      visible={!!item}
      title={null}
      width={520}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button danger ghost icon={<DeleteOutlined />} style={{ borderRadius: 8, height: 36 }} onClick={() => { onClose(); onDelete(); }}>Xoá</Button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button icon={<ImportOutlined />} style={{ borderRadius: 8, height: 36 }} onClick={onRestock}>Nhập kho</Button>
            <Button type="primary" icon={<EditOutlined />} style={{ borderRadius: 8, height: 36 }} onClick={onEdit} className={styles.btnPrimary}>Chỉnh sửa</Button>
          </div>
        </div>
      }
      destroyOnClose
      className={styles.khoModal}
    >
      {d && cfg && (
        <div className={styles.detailBody}>
          {/* Hero */}
          <div className={styles.detailHero}>
            <div className={styles.detailHeroIconWrap}>
              <InboxOutlined />
            </div>
            <div className={styles.detailHeroInfo}>
              <div className={styles.detailHeroName}>{d.ten}</div>
              <div className={styles.detailHeroSub}>{d.nhaCungCap}</div>
              <span
                className={styles.detailStatusBadge}
                data-status={d!.trangThai}
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Grid: tồn kho + mức tối thiểu */}
          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>TỒN KHO</div>
              <div className={styles.detailValueBig}>
                {d.tonKho}{' '}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>{d.donVi}</span>
              </div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>MỨC TỐI THIỂU</div>
              <div className={styles.detailValueBig}>
                {d.mucToiThieu}{' '}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>{d.donVi}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className={styles.detailProgressWrap}>
            <div className={styles.detailProgressRow}>
              <span className={styles.detailGridLabel}>MỨC TỒN KHO</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{pct}%</span>
            </div>
            <div className={styles.detailProgress10}>
              <div
                className={styles.detailProgress10Fill}
                style={{ width: `${pct}%`, background: cfg.barColor }}
              />
            </div>
          </div>

          {/* Grid: giá nhập + tổng giá trị */}
          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>GIÁ NHẬP</div>
              <div className={styles.detailGridValue}>{formatGia(d.giaNhap)}</div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>TỔNG GIÁ TRỊ</div>
              <div className={styles.detailGridValue}>{formatGia(totalValue)}</div>
            </div>
          </div>

          {/* Warning box khi cần nhập thêm */}
          {canNhapBox > 0 && (
            <div className={styles.detailWarnBox}>
              ⚠ Cần nhập thêm <strong>{canNhapBox} {d.donVi}</strong> để đạt mức an toàn
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

const KhoNguyenLieu: React.FC = () => {
  const { addNotif } = useNotif();
  const [items,           setItems]           = useState<INguyenLieu[]>(DANH_SACH_NGUYEN_LIEU);
  const [tuKhoa,          setTuKhoa]          = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<TrangThaiFilter>('all');
  const [filterNCC,       setFilterNCC]       = useState<string>('');
  const [sortBy,          setSortBy]          = useState<'mac_dinh' | 'ton_thap' | 'ton_cao' | 'gia_cao'>('mac_dinh');
  const [isGrid,          setIsGrid]          = useState(false);
  const [activeTab,       setActiveTab]       = useState<ViewTab>('danh_sach');
  const [lichSuNhap,      setLichSuNhap]      = useState<ILichSuNhap[]>(() =>
    store.get<ILichSuNhap[]>(KEYS.importHistory, []),
  );
  const [editing, setEditing] = useState<INguyenLieu | null>(null);
  const [viewing, setViewing] = useState<INguyenLieu | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [restocking, setRestocking] = useState<INguyenLieu | null>(null);
  const [restockOpen, setRestockOpen] = useState(false);
  const [bulkRestockOpen, setBulkRestockOpen] = useState(false);
  const [bulkPreSelectIds, setBulkPreSelectIds] = useState<string[]>([]);

  const stats = useMemo(() => {
    const tongNguyenLieu = items.length;
    const sapHetHet = items.filter((n) => n.trangThai === ETrangThaiNguyenLieu.SAP_HET || n.trangThai === ETrangThaiNguyenLieu.HET_HANG).length;
    const giaTri = formatGia(items.reduce((s, n) => s + n.tonKho * n.giaNhap, 0));
    const nhaCungCap = new Set(items.map((n) => n.nhaCungCap)).size;
    return { tongNguyenLieu, sapHetHet, giaTri, nhaCungCap };
  }, [items]);


  const danhSachLoc = useMemo(() => {
    let list = items;
    if (filterTrangThai !== 'all') list = list.filter((n) => n.trangThai === filterTrangThai);
    if (filterNCC) list = list.filter((n) => n.nhaCungCap === filterNCC);
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      list = list.filter((n) => n.ten.toLowerCase().includes(kw) || n.nhaCungCap.toLowerCase().includes(kw));
    }
    if (sortBy === 'ton_thap') list = [...list].sort((a, b) => a.tonKho - b.tonKho);
    if (sortBy === 'ton_cao')  list = [...list].sort((a, b) => b.tonKho - a.tonKho);
    if (sortBy === 'gia_cao')  list = [...list].sort((a, b) => b.giaNhap - a.giaNhap);
    return list;
  }, [items, tuKhoa, filterTrangThai, filterNCC, sortBy]);

  const canNhapThemItems = useMemo(() => items.filter((n) => n.trangThai !== ETrangThaiNguyenLieu.DU_HANG), [items]);
  const nhaCungCapOptions = useMemo(() => Array.from(new Set(items.map((n) => n.nhaCungCap))), [items]);

  const addLichSu = (entries: ILichSuNhap[]) => {
    setLichSuNhap((prev) => { const next = [...entries, ...prev]; store.set(KEYS.importHistory, next); return next; });
  };

  const handleSubmit = (values: NguyenLieuFormValues) => {
    const trangThai = tinhTrangThai(values.tonKho, values.mucToiThieu);
    if (editing) {
      setItems((prev) => prev.map((n) => n.id === editing.id ? { ...editing, ...values, trangThai } : n));
      message.success(`Đã cập nhật "${values.ten}"`);
    } else {
      const newItem: INguyenLieu = { ...values, id: `nl_${Date.now()}`, trangThai };
      setItems((prev) => [newItem, ...prev]);
      message.success(`Đã thêm nguyên liệu "${values.ten}"`);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleRestock = (id: string, soLuongNhap: number, newGiaNhap: number) => {
    let ten = '', donVi = '';
    setItems((prev) => prev.map((n) => {
      if (n.id !== id) return n;
      ten = n.ten; donVi = n.donVi;
      const tonKhoMoi = n.tonKho + soLuongNhap;
      return { ...n, tonKho: tonKhoMoi, giaNhap: newGiaNhap, trangThai: tinhTrangThai(tonKhoMoi, n.mucToiThieu) };
    }));
    addLichSu([{ id: `ls_${Date.now()}`, tenNL: ten, donVi, soLuong: soLuongNhap, giaNhap: newGiaNhap, ngay: dayjs().format('HH:mm DD/MM/YYYY') }]);
    message.success(`Đã nhập ${soLuongNhap} ${donVi} ${ten}`);
    addNotif({ icon: '📦', title: 'Đã nhập kho', desc: `${ten}: +${soLuongNhap} ${donVi}`, type: 'stock_refilled' });
    setRestockOpen(false); setRestocking(null);
  };

  const handleBulkRestock = (updates: { id: string; soLuongNhap: number }[]) => {
    const totalAmount = updates.reduce((sum, u) => { const it = items.find((n) => n.id === u.id); return sum + (it ? u.soLuongNhap * it.giaNhap : 0); }, 0);
    const now = dayjs().format('HH:mm DD/MM/YYYY');
    const entries: ILichSuNhap[] = [];
    setItems((prev) => prev.map((n) => {
      const u = updates.find((x) => x.id === n.id); if (!u) return n;
      entries.push({ id: `ls_${Date.now()}_${n.id}`, tenNL: n.ten, donVi: n.donVi, soLuong: u.soLuongNhap, giaNhap: n.giaNhap, ngay: now });
      const tonKhoMoi = n.tonKho + u.soLuongNhap;
      return { ...n, tonKho: tonKhoMoi, trangThai: tinhTrangThai(tonKhoMoi, n.mucToiThieu) };
    }));
    addLichSu(entries);
    message.success(`Đã nhập kho ${updates.length} mặt hàng, tổng ${formatGia(totalAmount)}`);
    addNotif({ icon: '📦', title: 'Nhập kho hàng loạt', desc: `${updates.length} mặt hàng · Tổng ${formatGia(totalAmount)}`, type: 'stock_refilled' });
    setBulkRestockOpen(false);
  };

  const handleDelete = (item: INguyenLieu) => {
    Modal.confirm({
      title: 'Xác nhận xoá nguyên liệu?',
      icon: <ExclamationCircleOutlined />,
      content: `Xoá "${item.ten}" khỏi kho?`,
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => { setItems((prev) => prev.filter((n) => n.id !== item.id)); message.success(`Đã xoá "${item.ten}"`); },
    });
  };

  const filterMenu = (
    <Menu
      selectedKeys={[filterTrangThai]}
      onClick={({ key }) => setFilterTrangThai(key as TrangThaiFilter)}
    >
      <Menu.Item key="all">Tất cả</Menu.Item>
      <Menu.Item key={ETrangThaiNguyenLieu.DU_HANG}>Đủ hàng</Menu.Item>
      <Menu.Item key={ETrangThaiNguyenLieu.SAP_HET}>Sắp hết</Menu.Item>
      <Menu.Item key={ETrangThaiNguyenLieu.HET_HANG}>Đã hết</Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<INguyenLieu> = [
    {
      title: 'NGUYÊN LIỆU',
      dataIndex: 'ten',
      key: 'ten',
      width: 220,
      render: (_, record) => (
        <div className={styles.colNguyenLieu}>
          <div className={styles.nlIcon}>
            <InboxOutlined className={styles.nlIconSvg} />
          </div>
          <div>
            <div className={styles.nlTen}><Highlight text={record.ten} search={tuKhoa} /></div>
            <div className={styles.nlDonVi}>Đơn vị: {record.donVi}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'NHÀ CUNG CẤP',
      dataIndex: 'nhaCungCap',
      key: 'nhaCungCap',
      width: 140,
      render: (val) => <span className={styles.nhaCungCap}>{val}</span>,
    },
    {
      title: 'TỒN KHO',
      dataIndex: 'tonKho',
      key: 'tonKho',
      width: 160,
      render: (_, record) => {
        const pct = tinhPhanTram(record.tonKho, record.mucToiThieu);
        const cfg = TRANG_THAI_CONFIG[record.trangThai];
        return (
          <div className={styles.colTonKho}>
            <span className={styles.tonKhoValue}>{record.tonKho} {record.donVi}</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${pct}%`, background: cfg.barColor }} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'MỨC TỐI THIỂU',
      dataIndex: 'mucToiThieu',
      key: 'mucToiThieu',
      width: 130,
      render: (val, record) => (
        <span className={styles.mucToiThieu}>{val} {record.donVi}</span>
      ),
    },
    {
      title: 'GIÁ NHẬP',
      dataIndex: 'giaNhap',
      key: 'giaNhap',
      width: 120,
      render: (val) => <span className={styles.giaNhap}>{formatGia(val)}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (val) => {
        const cfg = TRANG_THAI_CONFIG[val];
        return (
          <span className={styles.trangThaiBadge} data-status={val} style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        );
      },
    },
  ];

  const lichSuColumns: ColumnsType<ILichSuNhap> = [
    { title: 'NGUYÊN LIỆU', dataIndex: 'tenNL', key: 'tenNL', render: (v) => <strong>{v}</strong> },
    {
      title: 'SỐ LƯỢNG', dataIndex: 'soLuong', key: 'soLuong', width: 130,
      render: (v, r) => <span style={{ color: '#16a34a', fontWeight: 600 }}>+{v} {r.donVi}</span>,
    },
    {
      title: 'GIÁ NHẬP', dataIndex: 'giaNhap', key: 'giaNhap', width: 130,
      render: (v) => formatGia(v),
    },
    {
      title: 'THÀNH TIỀN', key: 'thanhTien', width: 140,
      render: (_, r) => <span style={{ fontWeight: 600 }}>{formatGia(r.soLuong * r.giaNhap)}</span>,
    },
    { title: 'THỜI GIAN', dataIndex: 'ngay', key: 'ngay', width: 160, render: (v) => <span style={{ color: '#9ca3af' }}>{v}</span> },
  ];

  return (
    <>
      <Topbar title="Kho nguyên liệu" />

      <div className={styles.pageBody}>

          {/* Tabs — sau stat cards */}
          <div className={styles.khoTabs}>
            <button
              className={`${styles.khoTabBtn} ${activeTab === 'danh_sach' ? styles.khoTabActive : ''}`}
              onClick={() => setActiveTab('danh_sach')}
            >
              <InboxOutlined /> Danh sách nguyên liệu
            </button>
            <button
              className={`${styles.khoTabBtn} ${activeTab === 'lich_su' ? styles.khoTabActive : ''}`}
              onClick={() => setActiveTab('lich_su')}
            >
              <HistoryOutlined /> Lịch sử nhập kho
              {lichSuNhap.length > 0 && (
                <span className={styles.khoTabCount}>{lichSuNhap.length}</span>
              )}
            </button>
          </div>

          {activeTab === 'lich_su' && (
            <div className={styles.tableSection}>
              <div className={styles.tableToolbar}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  {lichSuNhap.length} lần nhập kho
                </span>
                {lichSuNhap.length > 0 && (
                  <Button
                    danger size="small"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => {
                      Modal.confirm({
                        title: 'Xoá toàn bộ lịch sử?',
                        okType: 'danger', okText: 'Xoá', cancelText: 'Huỷ', centered: true,
                        okButtonProps: { style: { borderRadius: 8 } },
                        cancelButtonProps: { style: { borderRadius: 8 } },
                        onOk: () => { setLichSuNhap([]); store.set(KEYS.importHistory, []); },
                      });
                    }}
                  >
                    Xoá lịch sử
                  </Button>
                )}
              </div>
              {lichSuNhap.length === 0 ? (
                <EmptyState
                  kind="inventory"
                  title="Chưa có lịch sử nhập kho"
                  desc="Mỗi lần nhập kho sẽ được ghi lại tại đây."
                />
              ) : (
                <TableStaticData<ILichSuNhap>
                  dataSource={lichSuNhap}
                  columns={lichSuColumns}
                  rowKey="id"
                  pageSize={15}
                  showTotal
                  className={styles.table}
                />
              )}
            </div>
          )}

          {activeTab === 'danh_sach' && canNhapThemItems.length > 0 && (
            <div className={styles.warnBanner}>
              <div className={styles.warnLeft}>
                <ExclamationCircleOutlined className={styles.warnIcon} />
                <span>
                  <strong>Cần nhập thêm nguyên liệu:</strong>{' '}
                  {canNhapThemItems.map((n) => n.ten).join(', ')}
                </span>
              </div>
              <button
                className={styles.btnTaoDon}
                onClick={() => {
                  setBulkPreSelectIds(canNhapThemItems.map((n) => n.id));
                  setBulkRestockOpen(true);
                }}
              >
                <ShoppingCartOutlined style={{ marginRight: 6 }} />
                Tạo đơn nhập
              </button>
            </div>
          )}

          {activeTab === 'danh_sach' && <>
            <PageToolbar
              searchPlaceholder="Tìm nguyên liệu, nhà cung cấp..."
              searchValue={tuKhoa}
              onSearch={setTuKhoa}
              filters={
                <>
                  {/* View toggle — List trước, Grid sau */}
                  <div className={styles.viewToggle}>
                    <button className={`${styles.toggleBtn} ${!isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(false)} title="Dạng danh sách">
                      <UnorderedListOutlined />
                    </button>
                    <button className={`${styles.toggleBtn} ${isGrid ? styles.toggleActive : ''}`} onClick={() => setIsGrid(true)} title="Dạng lưới">
                      <AppstoreOutlined />
                    </button>
                  </div>

                  {/* NCC — Button dropdown đồng bộ với các trang khác */}
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu
                        selectedKeys={filterNCC ? [filterNCC] : ['all']}
                        onClick={({ key }) => setFilterNCC(key === 'all' ? '' : key)}
                      >
                        <Menu.Item key="all">Tất cả NCC</Menu.Item>
                        <Menu.Divider />
                        {nhaCungCapOptions.map((ncc) => (
                          <Menu.Item key={ncc}>{ncc}</Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                      {filterNCC || 'Nhà cung cấp'}
                    </Button>
                  </Dropdown>

                  {/* Trạng thái */}
                  <Badge count={filterTrangThai !== 'all' ? 1 : 0} size="small" offset={[-4, 4]}>
                    <Dropdown overlay={filterMenu} trigger={['click']}>
                      <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                        Trạng thái
                      </Button>
                    </Dropdown>
                  </Badge>

                  {/* Sort */}
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu selectedKeys={[sortBy]} onClick={({ key }) => setSortBy(key as typeof sortBy)}>
                        <Menu.Item key="mac_dinh">Mặc định</Menu.Item>
                        <Menu.Item key="ton_thap">Tồn kho thấp nhất</Menu.Item>
                        <Menu.Item key="ton_cao">Tồn kho cao nhất</Menu.Item>
                        <Menu.Item key="gia_cao">Giá nhập cao nhất</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button icon={<SortAscendingOutlined />} className={styles.btnOutline}>
                      {sortBy === 'mac_dinh' ? 'Sắp xếp' : sortBy === 'ton_thap' ? 'Tồn thấp ↑' : sortBy === 'ton_cao' ? 'Tồn cao ↓' : 'Giá cao ↓'}
                    </Button>
                  </Dropdown>
                </>
              }
              actions={
                <>
                  <Button
                    icon={<ImportOutlined />}
                    className={styles.btnOutline}
                    onClick={() => { setBulkPreSelectIds([]); setBulkRestockOpen(true); }}
                  >
                    Nhập kho
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className={styles.addBtn}
                    onClick={() => { setEditing(null); setFormOpen(true); }}
                  >
                    Thêm nguyên liệu
                  </Button>
                </>
              }
            />

            {isGrid ? (
              <div className={styles.nlGrid}>
                {danhSachLoc.length === 0 ? (
                  <div style={{ gridColumn: '1/-1' }}>
                    <EmptyState kind="search" desc="Không tìm thấy nguyên liệu nào" />
                  </div>
                ) : danhSachLoc.map((record) => {
                  const cfg = TRANG_THAI_CONFIG[record.trangThai];
                  const pct = record.mucToiThieu > 0
                    ? Math.min(100, Math.round((record.tonKho / (record.mucToiThieu * 2)) * 100))
                    : 100;
                  return (
                    <div key={record.id} className={styles.nlCard} onClick={() => setViewing(record)}>
                      <div className={styles.nlCardTop}>
                        <div className={styles.nlCardIcon}><InboxOutlined /></div>
                        <span className={styles.nlCardBadge} style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                      </div>
                      <div className={styles.nlCardName}><Highlight text={record.ten} search={tuKhoa} /></div>
                      <div className={styles.nlCardNCC}><Highlight text={record.nhaCungCap} search={tuKhoa} /></div>
                      <div className={styles.nlCardProgress}>
                        <div className={styles.nlProgressRow}>
                          <span className={styles.nlProgressVal}>{record.tonKho} {record.donVi}</span>
                          <span className={styles.nlProgressMin}>Min: {record.mucToiThieu}</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${pct}%`, background: cfg.barColor }} />
                        </div>
                      </div>
                      <div className={styles.nlCardFooter}>
                        <span className={styles.nlCardGia}>{formatGia(record.giaNhap)}</span>
                        <button
                          className={styles.nlCardNhap}
                          onClick={(e) => { e.stopPropagation(); setBulkPreSelectIds([record.id]); setBulkRestockOpen(true); }}
                        >
                          + Nhập
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.tableSection}>
              <TableStaticData<INguyenLieu>
                dataSource={danhSachLoc}
                columns={columns}
                rowKey="id"
                searchValue={tuKhoa}
                searchFields={['ten', 'nhaCungCap']}
                pageSize={10}
                className={styles.table}
                rowClassName={(record: INguyenLieu) => {
                  if (record.trangThai === ETrangThaiNguyenLieu.HET_HANG) return `${styles.tableRow} ${styles.rowHetHang}`;
                  if (record.trangThai === ETrangThaiNguyenLieu.SAP_HET)  return `${styles.tableRow} ${styles.rowSapHet}`;
                  return styles.tableRow;
                }}
                locale={{ emptyText: <EmptyState kind="search" desc="Không tìm thấy nguyên liệu nào" /> }}
                onRow={(record) => ({
                  onClick: () => setViewing(record),
                  style: { cursor: 'pointer' },
                })}
              />
              </div>
            )}
          </> }
      </div>

      <NguyenLieuForm
        open={formOpen}
        initial={editing}
        existingNhaCungCap={nhaCungCapOptions}
        onCancel={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <NguyenLieuRestock
        open={restockOpen}
        item={restocking}
        onCancel={() => { setRestockOpen(false); setRestocking(null); }}
        onSubmit={handleRestock}
      />
      <BulkRestockModal
        open={bulkRestockOpen}
        items={items}
        preSelectIds={bulkPreSelectIds}
        onCancel={() => setBulkRestockOpen(false)}
        onSubmit={handleBulkRestock}
      />
      <NguyenLieuDetail
        item={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { setEditing(viewing); setViewing(null); setFormOpen(true); }}
        onRestock={() => { setRestocking(viewing); setViewing(null); setRestockOpen(true); }}
        onDelete={() => { if (viewing) handleDelete(viewing); setViewing(null); }}
      />
    </>
  );
};

export default KhoNguyenLieu;
