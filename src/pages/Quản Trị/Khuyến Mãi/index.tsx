import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  GiftOutlined,
  MoreOutlined,
  PercentageOutlined,
  PlusOutlined,
  RiseOutlined,
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Radio,
  Select,
  Switch,
  message,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/pages/Quản Trị/Sidebar';
import Topbar from '@/pages/Quản Trị/Topbar';
import {
  DANH_SACH_KHUYEN_MAI,
  STAT_KHUYEN_MAI,
  TRANG_THAI_KM_CONFIG,
} from '@/services/Quản Trị/Khuyến Mãi';
import {
  ELoaiGiamGia,
  ETrangThaiKhuyenMai,
  IKhuyenMai,
} from '@/services/Quản Trị/Khuyến Mãi/typing';
import styles from './index.less';

dayjs.extend(customParseFormat);

// ── Helpers ──────────────────────────────────────────────────────
const fmtVnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const LOAI_LABEL: Record<ELoaiGiamGia, string> = {
  [ELoaiGiamGia.PHAN_TRAM]: 'Theo %',
  [ELoaiGiamGia.SO_TIEN]:   'Số tiền cố định',
  [ELoaiGiamGia.MIEN_SHIP]: 'Miễn phí phục vụ',
};

const fmtGiaTri = (item: IKhuyenMai) => {
  if (item.loai === ELoaiGiamGia.PHAN_TRAM) return `${item.giaTriGiam}%`;
  if (item.loai === ELoaiGiamGia.SO_TIEN)   return fmtVnd(item.giaTriGiam);
  return '—';
};

type FormPayload = Omit<IKhuyenMai, 'id' | 'daDung'>;

type StatCard = {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
  sub?: string | null;
  subTrend?: 'up';
  subBold?: string;
  subBoldColor?: string;
  subSuffix?: string;
};

// ── KhuyenMaiForm ─────────────────────────────────────────────────
const KhuyenMaiForm: React.FC<{
  open: boolean;
  initial: IKhuyenMai | null;
  onCancel: () => void;
  onSubmit: (data: FormPayload) => void;
}> = ({ open, initial, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const loaiWatch = Form.useWatch('loai', form) as ELoaiGiamGia | undefined;

  const isMienShip = loaiWatch === ELoaiGiamGia.MIEN_SHIP;
  const addonAfter  = loaiWatch === ELoaiGiamGia.PHAN_TRAM ? '%' : 'đ';

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        ...initial,
        hetHanDate: dayjs(initial.hetHan, 'D/M/YYYY'),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        loai:       ELoaiGiamGia.PHAN_TRAM,
        trangThai:  ETrangThaiKhuyenMai.DANG_CHAY,
        hoatDong:   true,
        giaTriGiam: 10,
        donToiThieu: 0,
      });
    }
  }, [open, initial]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { hetHanDate, ...rest } = values;
      onSubmit({ ...rest, hetHan: (hetHanDate as Dayjs).format('D/M/YYYY') });
    });
  };

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa: ${initial.ma}` : 'Tạo khuyến mãi mới'}
      width={640}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu thay đổi' : 'Tạo mới'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.formModal}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Mã khuyến mãi"
          name="ma"
          normalize={(v) => (v ? String(v).toUpperCase() : v)}
          rules={[
            { required: true, message: 'Vui lòng nhập mã' },
            { pattern: /^[A-Z0-9_-]{3,20}$/, message: 'Viết HOA, 3-20 ký tự (A-Z, 0-9, _, -)' },
          ]}
        >
          <Input placeholder="VD: LUNCH20" style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item
          label="Tên chương trình"
          name="ten"
          rules={[
            { required: true, message: 'Vui lòng nhập tên' },
            { max: 80, message: 'Tối đa 80 ký tự' },
          ]}
        >
          <Input placeholder="VD: Giảm 20% combo trưa" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="moTa"
          rules={[{ max: 120, message: 'Tối đa 120 ký tự' }]}
        >
          <Input.TextArea rows={2} showCount maxLength={120} placeholder="Mô tả ngắn..." />
        </Form.Item>

        <Form.Item label="Loại giảm giá" name="loai" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={ELoaiGiamGia.PHAN_TRAM}>Theo %</Radio>
            <Radio value={ELoaiGiamGia.SO_TIEN}>Số tiền cố định</Radio>
            <Radio value={ELoaiGiamGia.MIEN_SHIP}>Miễn phí phục vụ</Radio>
          </Radio.Group>
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Giá trị giảm"
            name="giaTriGiam"
            rules={[
              { required: !isMienShip, message: 'Vui lòng nhập giá trị' },
              ...(loaiWatch === ELoaiGiamGia.PHAN_TRAM
                ? [{ type: 'number' as const, max: 100, message: 'Tối đa 100%' }]
                : []),
            ]}
          >
            <InputNumber
              min={0}
              max={loaiWatch === ELoaiGiamGia.PHAN_TRAM ? 100 : undefined}
              disabled={isMienShip}
              addonAfter={isMienShip ? undefined : addonAfter}
              style={{ width: '100%' }}
              formatter={
                loaiWatch === ELoaiGiamGia.SO_TIEN
                  ? (v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : undefined
              }
              parser={
                loaiWatch === ELoaiGiamGia.SO_TIEN
                  ? (v) => Number((v ?? '').replace(/,/g, ''))
                  : undefined
              }
            />
          </Form.Item>

          <Form.Item label="Đơn tối thiểu" name="donToiThieu">
            <InputNumber
              min={0}
              step={10000}
              style={{ width: '100%' }}
              addonAfter="đ"
              formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number((v ?? '').replace(/,/g, ''))}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Giới hạn lượt dùng"
            name="gioiHan"
            rules={[
              { required: true, message: 'Vui lòng nhập giới hạn' },
              { type: 'number', min: 1, message: 'Tối thiểu 1' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Ngày hết hạn"
            name="hetHanDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker format="D/M/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={ETrangThaiKhuyenMai.DANG_CHAY}>Đang chạy</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.SAP_HET}>Sắp hết</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.TAM_DUNG}>Tạm dừng</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.HET_HAN}>Hết hạn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Kích hoạt" name="hoatDong" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

// ── KhuyenMaiDetail ───────────────────────────────────────────────
const KhuyenMaiDetail: React.FC<{
  item: IKhuyenMai | null;
  onClose: () => void;
  onEdit: () => void;
}> = ({ item, onClose, onEdit }) => {
  const lastRef = React.useRef<IKhuyenMai | null>(null);
  if (item) lastRef.current = item;
  const d   = lastRef.current;
  const pct = d ? Math.min(100, Math.round((d.daDung / d.gioiHan) * 100)) : 0;
  const cfg = d ? TRANG_THAI_KM_CONFIG[d.trangThai] : null;

  return (
    <Modal
      visible={!!item}
      title={null}
      width={520}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>Đóng</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit} className={styles.btnPrimary}>
            Chỉnh sửa
          </Button>
        </div>
      }
      destroyOnClose
      className={styles.detailModal}
    >
      {d && cfg && (
        <div className={styles.detailBody}>
          <div className={styles.detailHeader}>
            <span className={styles.detailCode}>{d.ma}</span>
            <span className={styles.detailStatusTag} style={{ color: cfg.color, background: cfg.bg }}>
              {cfg.label}
            </span>
          </div>

          <div className={styles.detailTitle}>{d.ten}</div>
          <div className={styles.detailDesc}>{d.moTa}</div>

          <div className={styles.detailDivider} />

          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>LOẠI GIẢM</div>
              <div className={styles.detailGridValue}>{LOAI_LABEL[d.loai]}</div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>GIÁ TRỊ</div>
              <div className={styles.detailValueBig}>{fmtGiaTri(d)}</div>
            </div>
          </div>

          <div className={styles.detailDivider} />

          <div>
            <div className={styles.detailProgressRow}>
              <span className={styles.detailGridLabel}>ĐÃ DÙNG</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                {d.daDung} / {d.gioiHan} ·{' '}
                <span style={{ color: pct >= 90 ? '#ef4444' : '#16a34a' }}>{pct}%</span>
              </span>
            </div>
            <div className={styles.detailProgressBar}>
              <div
                className={styles.detailProgressFill}
                style={{ width: `${pct}%`, background: pct >= 90 ? '#ef4444' : '#22c55e' }}
              />
            </div>
          </div>

          <div className={styles.detailDivider} />

          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>ĐƠN TỐI THIỂU</div>
              <div className={styles.detailGridValue}>{fmtVnd(d.donToiThieu)}</div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>NGÀY HẾT HẠN</div>
              <div className={styles.detailGridValue}>{d.hetHan}</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ── KhuyenMaiRow ──────────────────────────────────────────────────
const KhuyenMaiRow: React.FC<{
  item: IKhuyenMai;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}> = ({ item, onClick, onEdit, onDelete, onToggle }) => {
  const cfg = TRANG_THAI_KM_CONFIG[item.trangThai];
  const pct = Math.min(100, Math.round((item.daDung / item.gioiHan) * 100));

  const moreMenu = (
    <Menu onClick={({ key }) => { if (key === 'edit') onEdit(); else if (key === 'delete') onDelete(); }}>
      <Menu.Item key="edit" icon={<EditOutlined />}>Chỉnh sửa</Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>Xoá</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.promoRow} onClick={onClick}>
      <div className={styles.promoLeft}>
        <div className={styles.promoBadges}>
          <span className={styles.promoCode}>{item.ma}</span>
          <span className={styles.promoStatus} style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>
        </div>
        <div className={styles.promoName}>{item.ten}</div>
        <div className={styles.promoMoTa}>{item.moTa}</div>
      </div>

      <div className={styles.promoUsage}>
        <div className={styles.usageHeader}>
          <span className={styles.usageLabel}>Đã dùng</span>
          <span className={styles.usageCount}>{item.daDung} / {item.gioiHan}</span>
        </div>
        <div className={styles.usageBar}>
          <div
            className={styles.usageFill}
            style={{ width: `${pct}%`, background: pct >= 90 ? '#ef4444' : '#22c55e' }}
          />
        </div>
      </div>

      <div className={styles.promoRight} onClick={(e) => e.stopPropagation()}>
        <div className={styles.expiryWrap}>
          <span className={styles.expiryLabel}>Hết hạn</span>
          <span className={styles.expiryDate}>{item.hetHan}</span>
        </div>
        <Switch
          checked={item.hoatDong}
          onChange={onToggle}
          className={item.hoatDong ? styles.switchOn : styles.switchOff}
        />
        <Dropdown overlay={moreMenu} trigger={['click']}>
          <button className={styles.moreBtn}>
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

// ── KhuyenMai page ────────────────────────────────────────────────
const KhuyenMai: React.FC = () => {
  const [items,          setItems]          = useState<IKhuyenMai[]>(DANH_SACH_KHUYEN_MAI);
  const [tuKhoa,         setTuKhoa]         = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<ETrangThaiKhuyenMai | null>(null);
  const [editing,        setEditing]        = useState<IKhuyenMai | null>(null);
  const [viewing,        setViewing]        = useState<IKhuyenMai | null>(null);
  const [formOpen,       setFormOpen]       = useState(false);

  // ── Dynamic stats ──────────────────────────────────────────────
  const stats = useMemo(() => ({
    dangHoatDong: items.filter((k) => k.hoatDong && k.trangThai === ETrangThaiKhuyenMai.DANG_CHAY).length,
    luotSuDung:   items.reduce((s, k) => s + k.daDung, 0),
  }), [items]);

  const statCards: StatCard[] = useMemo(() => [
    {
      label: 'ĐANG HOẠT ĐỘNG',
      value: String(stats.dangHoatDong),
      icon: TagOutlined,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
    {
      label: 'LƯỢT SỬ DỤNG',
      value: String(stats.luotSuDung),
      icon: GiftOutlined,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      sub: '+18% so với tuần trước',
      subTrend: 'up',
    },
    {
      label: 'DOANH THU ĐƯỢC TẠO',
      value: STAT_KHUYEN_MAI.doanhThuTao,
      icon: RiseOutlined,
      iconBg: '#fed7aa',
      iconColor: '#ea580c',
      sub: '+8.4% so với tuần trước',
      subTrend: 'up',
    },
    {
      label: 'TỶ LỆ CHUYỂN ĐỔI',
      value: `${STAT_KHUYEN_MAI.tyLeChuyenDoi}%`,
      icon: PercentageOutlined,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      subBold: '3 mã sắp hết',
      subBoldColor: '#dc2626',
      subSuffix: 'so với tuần trước',
    },
  ], [stats]);

  // ── Filtered list ──────────────────────────────────────────────
  const danhSachLoc = useMemo(() => {
    let list = items;
    if (filterTrangThai) {
      list = list.filter((k) => k.trangThai === filterTrangThai);
    }
    if (tuKhoa.trim()) {
      const kw = tuKhoa.toLowerCase();
      list = list.filter(
        (k) => k.ma.toLowerCase().includes(kw) || k.ten.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [items, tuKhoa, filterTrangThai]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleToggleHoatDong = (id: string, v: boolean) => {
    setItems((prev) => prev.map((k) => (k.id === id ? { ...k, hoatDong: v } : k)));
    message.success(v ? 'Đã kích hoạt khuyến mãi' : 'Đã tạm dừng khuyến mãi');
  };

  const handleDelete = (item: IKhuyenMai) => {
    Modal.confirm({
      title: 'Xác nhận xoá?',
      icon: <ExclamationCircleOutlined />,
      content: `Xoá khuyến mãi "${item.ten}"? Hành động không thể hoàn tác.`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setItems((prev) => prev.filter((k) => k.id !== item.id));
        message.success(`Đã xoá khuyến mãi ${item.ma}`);
      },
    });
  };

  const handleSubmit = (data: FormPayload) => {
    if (editing) {
      setItems((prev) => prev.map((k) => (k.id === editing.id ? { ...k, ...data } : k)));
      message.success(`Đã cập nhật khuyến mãi ${data.ma}`);
    } else {
      const newItem: IKhuyenMai = { ...data, id: `km_${Date.now()}`, daDung: 0 };
      setItems((prev) => [newItem, ...prev]);
      message.success(`Đã tạo khuyến mãi ${data.ma}`);
    }
    setFormOpen(false);
    setEditing(null);
  };

  // ── Filter dropdown ────────────────────────────────────────────
  const filterMenu = (
    <Menu
      selectedKeys={[filterTrangThai ?? 'tat_ca']}
      onClick={({ key }) =>
        setFilterTrangThai(key === 'tat_ca' ? null : (key as ETrangThaiKhuyenMai))
      }
    >
      <Menu.Item key="tat_ca">Tất cả</Menu.Item>
      <Menu.Item key={ETrangThaiKhuyenMai.DANG_CHAY}>Đang chạy</Menu.Item>
      <Menu.Item key={ETrangThaiKhuyenMai.SAP_HET}>Sắp hết</Menu.Item>
      <Menu.Item key={ETrangThaiKhuyenMai.TAM_DUNG}>Tạm dừng</Menu.Item>
      <Menu.Item key={ETrangThaiKhuyenMai.HET_HAN}>Hết hạn</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar title="Khuyến mãi" />

        <div className={styles.pageBody}>
          {/* ── Stat cards ── */}
          <div className={styles.statGrid}>
            {statCards.map((card) => (
              <div key={card.label} className={styles.statCard}>
                <div className={styles.statLeft}>
                  <div className={styles.statLabel}>{card.label}</div>
                  <div className={styles.statValue}>{card.value}</div>
                  {card.sub && (
                    <div className={`${styles.statSub} ${card.subTrend === 'up' ? styles.subUp : ''}`}>
                      {card.subTrend === 'up' && '↗ '}{card.sub}
                    </div>
                  )}
                  {card.subBold && (
                    <div className={styles.statSubComplex}>
                      <span style={{ color: card.subBoldColor, fontWeight: 600 }}>
                        ↘ {card.subBold}
                      </span>{' '}
                      <span className={styles.statSubSuffix}>{card.subSuffix}</span>
                    </div>
                  )}
                </div>
                <div className={styles.statIconWrap} style={{ background: card.iconBg }}>
                  <card.icon style={{ fontSize: 20, color: card.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>
            <Input
              prefix={<SearchOutlined className={styles.searchIcon} />}
              placeholder="Tìm mã, tên chương trình..."
              className={styles.searchInput}
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              allowClear
            />
            <Badge count={filterTrangThai ? 1 : 0} size="small" offset={[-4, 4]}>
              <Dropdown overlay={filterMenu} trigger={['click']}>
                <Button icon={<FilterOutlined />} className={styles.btnFilter}>
                  Lọc trạng thái
                </Button>
              </Dropdown>
            </Badge>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.btnCreate}
              onClick={() => { setEditing(null); setFormOpen(true); }}
            >
              Tạo khuyến mãi
            </Button>
          </div>

          {/* ── Promo list ── */}
          <div className={styles.promoList}>
            {danhSachLoc.map((item, idx) => (
              <React.Fragment key={item.id}>
                <KhuyenMaiRow
                  item={item}
                  onClick={() => setViewing(item)}
                  onEdit={() => { setEditing(item); setFormOpen(true); }}
                  onDelete={() => handleDelete(item)}
                  onToggle={(v) => handleToggleHoatDong(item.id, v)}
                />
                {idx < danhSachLoc.length - 1 && <div className={styles.divider} />}
              </React.Fragment>
            ))}
            {danhSachLoc.length === 0 && (
              <div className={styles.empty}>Không tìm thấy khuyến mãi phù hợp</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <KhuyenMaiForm
        open={formOpen}
        initial={editing}
        onCancel={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <KhuyenMaiDetail
        item={viewing}
        onClose={() => setViewing(null)}
        onEdit={() => { setEditing(viewing); setViewing(null); setFormOpen(true); }}
      />
    </div>
  );
};

export default KhuyenMai;
