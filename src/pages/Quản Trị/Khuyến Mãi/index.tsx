import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
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
import TinyEditor from '@/components/TinyEditor';
import Topbar from '@/pages/Quản Trị/Topbar';
import PageToolbar from '@/pages/Quản Trị/components/PageToolbar';
import {
  DANH_SACH_KHUYEN_MAI,
  DANH_SACH_COMBO,

  TRANG_THAI_KM_CONFIG,
} from '@/services/Quản Trị/Khuyến Mãi';
import {
  ELoaiGiamGia,
  ELoaiGiaCombo,
  ETrangThaiKhuyenMai,
  ICombo,
  IKhuyenMai,
} from '@/services/Quản Trị/Khuyến Mãi/typing';
import { DANH_SACH_MON } from '@/services/Quản Trị/Quản Lý Món';
import styles from './index.less';

dayjs.extend(customParseFormat);

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

type ComboFormPayload = Omit<ICombo, 'id'>;

function tinhGiaCombo(combo: ICombo): { tongLe: number; giaCombo: number; tietKiem: number } {
  const tongLe = combo.monAnIds.reduce((sum, id) => {
    const mon = DANH_SACH_MON.find((m) => m.id === id);
    return sum + (mon?.giaBan ?? 0);
  }, 0);
  const giaCombo =
    combo.loaiGia === ELoaiGiaCombo.PHAN_TRAM
      ? Math.round(tongLe * (1 - combo.giaTriGiam / 100))
      : combo.giaTriGiam;
  return { tongLe, giaCombo, tietKiem: tongLe - giaCombo };
}


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
          <TinyEditor placeholder="Mô tả ngắn..." minHeight={100} />
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
            rules={[
              { required: true, message: 'Vui lòng chọn ngày' },
              {
                validator: (_: any, value: Dayjs | undefined) => {
                  if (!value) return Promise.resolve();
                  if (value.isBefore(dayjs().startOf('day'))) {
                    return Promise.reject(new Error('Ngày hết hạn không được là ngày trong quá khứ'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              format="D/M/YYYY"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
            />
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

const KhuyenMaiDetail: React.FC<{
  item: IKhuyenMai | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}> = ({ item, onClose, onEdit, onDelete, onToggle }) => {
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
        <div className={styles.modalFooter}>
          {d && (
            <div className={styles.modalFooterLeft}>
              <Switch checked={d.hoatDong} onChange={onToggle} />
              <span className={styles.modalFooterSwitchLabel}>{d.hoatDong ? 'Đang hoạt động' : 'Tạm dừng'}</span>
            </div>
          )}
          <div className={styles.modalFooterRight}>
            <Button danger ghost icon={<DeleteOutlined />} className={styles.modalBtnDanger} onClick={() => { onClose(); onDelete(); }}>Xoá</Button>
            <Button type="primary" icon={<EditOutlined />} className={`${styles.btnPrimary} ${styles.modalBtnPrimary}`} onClick={onEdit}>Chỉnh sửa</Button>
          </div>
        </div>
      }
      destroyOnClose
      className={styles.detailModal}
    >
      {d && cfg && (
        <div className={styles.detailBody}>
          <div className={styles.detailHeader}>
            <span className={styles.detailCode}>{d.ma}</span>
            <span className={styles.detailStatusTag} data-status={d.trangThai} style={{ color: cfg.color }}>
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

const ComboForm: React.FC<{
  open: boolean;
  initial: ICombo | null;
  onCancel: () => void;
  onSubmit: (data: ComboFormPayload) => void;
}> = ({ open, initial, onCancel, onSubmit }) => {
  const [form]        = Form.useForm();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dishSearch,  setDishSearch]  = useState('');

  const loaiGiaWatch = Form.useWatch('loaiGia',    form) as ELoaiGiaCombo | undefined;
  const giaTriWatch  = Form.useWatch('giaTriGiam', form) as number        | undefined;

  // tổng giá lẻ
  const tongLe = selectedIds.reduce((sum, id) => {
    const mon = DANH_SACH_MON.find((m) => m.id === id);
    return sum + (mon?.giaBan ?? 0);
  }, 0);

  const giaComboPreview =
    loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM && giaTriWatch
      ? Math.round(tongLe * (1 - giaTriWatch / 100))
      : loaiGiaWatch === ELoaiGiaCombo.GIA_CO_DINH && giaTriWatch
      ? giaTriWatch
      : null;

  const tietKiemPreview = giaComboPreview !== null ? tongLe - giaComboPreview : null;
  const previewError =
    giaComboPreview !== null && giaComboPreview >= tongLe
      ? 'Giá combo phải nhỏ hơn tổng giá lẻ'
      : null;

  // danh sách món picker
  const filteredDishes = useMemo(() => {
    if (!dishSearch.trim()) return DANH_SACH_MON;
    const kw = dishSearch.toLowerCase();
    return DANH_SACH_MON.filter((m) => m.ten.toLowerCase().includes(kw));
  }, [dishSearch]);

  // món đã chọn
  const selectedDishes = selectedIds
    .map((id) => DANH_SACH_MON.find((m) => m.id === id))
    .filter(Boolean) as (typeof DANH_SACH_MON[number])[];

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        ten:        initial.ten,
        moTa:       initial.moTa,
        loaiGia:    initial.loaiGia,
        giaTriGiam: initial.giaTriGiam,
        hetHanDate: dayjs(initial.hetHan, 'D/M/YYYY'),
        trangThai:  initial.trangThai,
        hoatDong:   initial.hoatDong,
      });
      setSelectedIds([...initial.monAnIds]);
    } else {
      form.resetFields();
      form.setFieldsValue({
        loaiGia:   ELoaiGiaCombo.PHAN_TRAM,
        trangThai: ETrangThaiKhuyenMai.DANG_CHAY,
        hoatDong:  true,
      });
      setSelectedIds([]);
    }
    setDishSearch('');
  }, [open, initial]);

  const handleAdd    = (id: string) => setSelectedIds((p) => p.includes(id) ? p : [...p, id]);
  const handleRemove = (id: string) => setSelectedIds((p) => p.filter((x) => x !== id));

  const handleOk = () => {
    if (selectedIds.length < 2) {
      message.error('Combo cần ít nhất 2 món');
      return;
    }
    if (previewError) {
      message.error(previewError);
      return;
    }
    form.validateFields().then((values) => {
      const { hetHanDate, ...rest } = values;
      onSubmit({ ...rest, monAnIds: selectedIds, hetHan: (hetHanDate as Dayjs).format('D/M/YYYY') });
    });
  };

  return (
    <Modal
      visible={open}
      title={initial ? `Chỉnh sửa: ${initial.ten}` : 'Tạo combo mới'}
      width={640}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? 'Lưu thay đổi' : 'Tạo combo'}
      cancelText="Huỷ"
      destroyOnClose
      className={styles.formModal}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Tên combo"
          name="ten"
          rules={[
            { required: true, message: 'Vui lòng nhập tên combo' },
            { max: 80, message: 'Tối đa 80 ký tự' },
          ]}
        >
          <Input placeholder="VD: Combo cơm trưa" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="moTa"
          rules={[{ max: 120, message: 'Tối đa 120 ký tự' }]}
        >
          <TinyEditor placeholder="Mô tả ngắn..." minHeight={100} />
        </Form.Item>

        <div className={styles.dishPicker}>
          {/* Header */}
          <div className={styles.dishPickerHead}>
            <span className={styles.dishPickerHeadLabel}>MÓN TRONG COMBO</span>
            {selectedIds.length > 0 && (
              <span className={styles.dishPickerHeadCount}>{selectedIds.length} đã chọn</span>
            )}
          </div>

          {/* Search */}
          <div className={styles.dishPickerSearch}>
            <Input
              prefix={<SearchOutlined style={{ color: '#9ca3af', fontSize: 13 }} />}
              placeholder="Tìm món để thêm..."
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              allowClear
              bordered={false}
            />
          </div>

          {/* Available dishes */}
          <div className={styles.dishAvailableList}>
            {filteredDishes.length === 0 && (
              <div className={styles.dishListEmpty}>Không tìm thấy món</div>
            )}
            {filteredDishes.map((mon) => {
              const added = selectedIds.includes(mon.id);
              return (
                <div
                  key={mon.id}
                  className={`${styles.dishAvailableRow} ${added ? styles.dishAvailableRowAdded : ''}`}
                >
                  <span className={styles.dishDot} style={{ background: mon.mauNen }} />
                  <span className={styles.dishRowName}>{mon.ten}</span>
                  <span className={styles.dishRowPrice}>{fmtVnd(mon.giaBan)}</span>
                  <button
                    className={`${styles.dishToggleBtn} ${added ? styles.dishToggleBtnAdded : ''}`}
                    onClick={() => added ? handleRemove(mon.id) : handleAdd(mon.id)}
                    title={added ? 'Bỏ khỏi combo' : 'Thêm vào combo'}
                  >
                    {added ? '✓' : '+'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected dishes */}
          <div className={styles.dishSelected}>
            <div className={styles.dishSelectedHead}>
              <span className={styles.dishSelectedLabel}>ĐÃ CHỌN</span>
              <span className={`${styles.dishSelectedCount} ${selectedIds.length < 2 ? styles.dishSelectedCountWarn : ''}`}>
                {selectedIds.length} món{selectedIds.length < 2 ? ' — cần ít nhất 2' : ''}
              </span>
            </div>

            {selectedDishes.length === 0 ? (
              <div className={styles.dishSelectedEmpty}>
                Chưa chọn món nào — thêm từ danh sách bên trên
              </div>
            ) : (
              <>
                {selectedDishes.map((mon) => (
                  <div key={mon.id} className={styles.dishSelectedRow}>
                    <span className={styles.dishDot} style={{ background: mon.mauNen }} />
                    <span className={styles.dishSelectedName}>{mon.ten}</span>
                    <span className={styles.dishSelectedPrice}>{fmtVnd(mon.giaBan)}</span>
                    <button
                      className={styles.dishRemoveBtn}
                      onClick={() => handleRemove(mon.id)}
                      title="Bỏ khỏi combo"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className={styles.dishSelectedTotal}>
                  <span>Tổng giá lẻ</span>
                  <strong>{fmtVnd(tongLe)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        <Form.Item label="Loại giá combo" name="loaiGia" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={ELoaiGiaCombo.PHAN_TRAM}>Giảm %</Radio>
            <Radio value={ELoaiGiaCombo.GIA_CO_DINH}>Giá cố định</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM ? 'Mức giảm (%)' : 'Giá combo (đ)'}
          name="giaTriGiam"
          rules={[
            { required: true, message: 'Vui lòng nhập giá trị' },
            ...(loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM
              ? [{ type: 'number' as const, min: 1, max: 99, message: 'Vui lòng nhập từ 1–99%' }]
              : [{ type: 'number' as const, min: 1000, message: 'Tối thiểu 1.000đ' }]),
          ]}
        >
          <InputNumber
            min={loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM ? 1 : 1000}
            max={loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM ? 99 : undefined}
            addonAfter={loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM ? '%' : 'đ'}
            style={{ width: '100%' }}
            formatter={
              loaiGiaWatch === ELoaiGiaCombo.GIA_CO_DINH
                ? (v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : undefined
            }
            parser={
              loaiGiaWatch === ELoaiGiaCombo.GIA_CO_DINH
                ? (v) => Number((v ?? '').replace(/,/g, '')) as any
                : undefined
            }
          />
        </Form.Item>

        {/* Preview tính giá */}
        {selectedIds.length >= 2 && tongLe > 0 && giaComboPreview !== null && (
          <div className={styles.comboFormPreview}>
            <div className={styles.previewRow}>
              <span className={styles.previewRowLabel}>Tổng giá lẻ</span>
              <span>{fmtVnd(tongLe)}</span>
            </div>
            {loaiGiaWatch === ELoaiGiaCombo.PHAN_TRAM && (
              <div className={styles.previewRow}>
                <span className={styles.previewRowLabel}>Giảm ({giaTriWatch}%)</span>
                <span style={{ color: '#dc2626' }}>−{fmtVnd(tongLe - giaComboPreview)}</span>
              </div>
            )}
            <div className={styles.previewDivider} />
            <div className={styles.previewFinalRow}>
              <span className={styles.previewFinalLabel}>Giá combo</span>
              <span className={styles.previewFinalValue}>{fmtVnd(giaComboPreview)}</span>
            </div>
            {tietKiemPreview !== null && tietKiemPreview > 0 && (
              <div className={styles.previewSavingRow}>
                <span>Tiết kiệm</span>
                <span>{fmtVnd(tietKiemPreview)}</span>
              </div>
            )}
            {previewError && <div className={styles.previewError}>{previewError}</div>}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <Form.Item
            label="Ngày hết hạn"
            name="hetHanDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker format="D/M/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={ETrangThaiKhuyenMai.DANG_CHAY}>Đang chạy</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.SAP_HET}>Sắp hết</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.TAM_DUNG}>Tạm dừng</Select.Option>
              <Select.Option value={ETrangThaiKhuyenMai.HET_HAN}>Hết hạn</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Kích hoạt" name="hoatDong" valuePropName="checked">
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const KhuyenMaiRow: React.FC<{
  item: IKhuyenMai;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const cfg = TRANG_THAI_KM_CONFIG[item.trangThai];
  const pct = Math.min(100, Math.round((item.daDung / item.gioiHan) * 100));

  return (
    <div className={styles.promoRow} onClick={onClick}>
      <div className={styles.promoLeft}>
        <div className={styles.promoBadges}>
          <span className={styles.promoCode}>{item.ma}</span>
          <span className={styles.promoStatus} data-status={item.trangThai} style={{ color: cfg.color }}>
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
          <div className={styles.usageFill} style={{ width: `${pct}%`, background: pct >= 90 ? '#ef4444' : '#22c55e' }} />
        </div>
      </div>

      <div className={styles.expiryWrap}>
        <span className={styles.expiryLabel}>Hết hạn</span>
        <span className={styles.expiryDate}>{item.hetHan}</span>
      </div>
    </div>
  );
};

const ComboRow: React.FC<{
  item: ICombo;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const cfg = TRANG_THAI_KM_CONFIG[item.trangThai];
  const { tongLe, giaCombo, tietKiem } = tinhGiaCombo(item);

  const monList = item.monAnIds
    .map((id) => DANH_SACH_MON.find((m) => m.id === id))
    .filter(Boolean) as (typeof DANH_SACH_MON[number])[];

  return (
    <div className={styles.comboCard} onClick={onClick}>
      <div className={styles.comboCardTop}>
        <div className={styles.comboCardLeft}>
          <div className={styles.comboCardTitle}>
            <span className={styles.comboCardName}>{item.ten}</span>
            <span className={styles.promoStatus} data-status={item.trangThai} style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <div className={styles.comboCardMoTa}>{item.moTa}</div>
        </div>
      </div>

      <div className={styles.comboDishChips}>
        {monList.map((mon) => (
          <span
            key={mon.id}
            className={styles.comboDishChip}
            style={{ background: mon.mauNen }}
          >
            {mon.ten}
          </span>
        ))}
      </div>

      <div className={styles.comboPriceRow}>
        <span className={styles.comboOriginalPrice}>{fmtVnd(tongLe)}</span>
        <span className={styles.comboArrow}>→</span>
        <span className={styles.comboFinalPrice}>{fmtVnd(giaCombo)}</span>
        <span className={styles.comboSaving}>Tiết kiệm {fmtVnd(tietKiem)}</span>
        <div className={styles.comboExpiry}>
          <span className={styles.comboExpiryLabel}>Hết hạn</span>
          <span className={styles.comboExpiryDate}>{item.hetHan}</span>
        </div>
      </div>
    </div>
  );
};

const ComboDetail: React.FC<{
  item: ICombo | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}> = ({ item, onClose, onEdit, onDelete, onToggle }) => {
  const lastRef = React.useRef<ICombo | null>(null);
  if (item) lastRef.current = item;
  const d = lastRef.current;
  const cfg = d ? TRANG_THAI_KM_CONFIG[d.trangThai] : null;

  const monList = d
    ? d.monAnIds.map((id) => DANH_SACH_MON.find((m) => m.id === id)).filter(Boolean) as (typeof DANH_SACH_MON[number])[]
    : [];

  const { tongLe, giaCombo, tietKiem } = d ? tinhGiaCombo(d) : { tongLe: 0, giaCombo: 0, tietKiem: 0 };

  return (
    <Modal
      visible={!!item}
      title={null}
      width={520}
      centered
      onCancel={onClose}
      destroyOnClose
      className={styles.detailModal}
      footer={
        <div className={styles.modalFooter}>
          {d && (
            <div className={styles.modalFooterLeft}>
              <Switch checked={d.hoatDong} onChange={onToggle} />
              <span className={styles.modalFooterSwitchLabel}>{d.hoatDong ? 'Đang hoạt động' : 'Tạm dừng'}</span>
            </div>
          )}
          <div className={styles.modalFooterRight}>
            <Button danger ghost icon={<DeleteOutlined />} className={styles.modalBtnDanger} onClick={() => { onClose(); onDelete(); }}>Xoá</Button>
            <Button type="primary" icon={<EditOutlined />} className={`${styles.btnPrimary} ${styles.modalBtnPrimary}`} onClick={onEdit}>Chỉnh sửa</Button>
          </div>
        </div>
      }
    >
      {d && cfg && (
        <div className={styles.detailBody}>
          {/* Header */}
          <div className={styles.detailHeader}>
            <span className={styles.detailTitle} style={{ fontSize: 17, fontWeight: 700 }}>{d.ten}</span>
            <span className={styles.detailStatusTag} data-status={d.trangThai} style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          {d.moTa && <div className={styles.detailDesc}>{d.moTa}</div>}

          <div className={styles.detailDivider} />

          {/* Món trong combo */}
          <div style={{ marginBottom: 4 }}>
            <div className={styles.detailGridLabel}>MÓN TRONG COMBO</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {monList.map((mon) => (
                <span
                  key={mon.id}
                  style={{
                    background: mon.mauNen,
                    color: '#fff',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {mon.ten}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.detailDivider} />

          {/* Giá */}
          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>TỔNG GIÁ LẺ</div>
              <div className={styles.detailGridValue} style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{fmtVnd(tongLe)}</div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>GIÁ COMBO</div>
              <div className={styles.detailValueBig}>{fmtVnd(giaCombo)}</div>
            </div>
          </div>

          <div style={{ marginTop: 8, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>Tiết kiệm</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>{fmtVnd(tietKiem)}</span>
          </div>

          <div className={styles.detailDivider} />

          <div className={styles.detailGrid2}>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>NGÀY HẾT HẠN</div>
              <div className={styles.detailGridValue}>{d.hetHan}</div>
            </div>
            <div className={styles.detailGridItem}>
              <div className={styles.detailGridLabel}>TRẠNG THÁI</div>
              <div className={styles.detailGridValue} style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const KhuyenMai: React.FC = () => {
  const [items, setItems] = useState<IKhuyenMai[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_vouchers');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return DANH_SACH_KHUYEN_MAI;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_vouchers', JSON.stringify(items));
    }
  }, [items]);

  const [tuKhoa,         setTuKhoa]         = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<ETrangThaiKhuyenMai | null>(null);
  const [editing,        setEditing]        = useState<IKhuyenMai | null>(null);
  const [viewing,        setViewing]        = useState<IKhuyenMai | null>(null);
  const [formOpen,       setFormOpen]       = useState(false);

  const [activeTab,     setActiveTab]     = useState<'ma-giam-gia' | 'combo'>('ma-giam-gia');
  const [comboItems, setComboItems] = useState<ICombo[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_combos');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return DANH_SACH_COMBO;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_combos', JSON.stringify(comboItems));
    }
  }, [comboItems]);
  const [comboFormOpen,       setComboFormOpen]       = useState(false);
  const [editingCombo,        setEditingCombo]        = useState<ICombo | null>(null);
  const [viewingCombo,        setViewingCombo]        = useState<ICombo | null>(null);
  const [comboTuKhoa,         setComboTuKhoa]         = useState('');
  const [comboFilterTrangThai, setComboFilterTrangThai] = useState<ETrangThaiKhuyenMai | null>(null);


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

  const handleToggleHoatDong = (id: string, v: boolean) => {
    setItems((prev) => prev.map((k) => (k.id === id ? { ...k, hoatDong: v } : k)));
    message.success(v ? 'Đã kích hoạt khuyến mãi' : 'Đã tạm dừng khuyến mãi');
  };

  const handleDelete = (item: IKhuyenMai) => {
    Modal.confirm({
      title: 'Xác nhận xoá?',
      icon: <ExclamationCircleOutlined />,
      content: `Xoá khuyến mãi "${item.ten}"? Hành động không thể hoàn tác.`,
      okText: 'Xoá', okType: 'danger', cancelText: 'Huỷ', centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
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
      
      // gửi thông báo
      window.dispatchEvent(new CustomEvent('new_notification', {
        detail: {
            id: `notif_voucher_${Date.now()}`,
            title: 'Mã khuyến mãi mới!',
            message: `Admin vừa tung mã giảm giá mới: ${data.ma}. Nhanh tay đặt món ngay kẻo lỡ!`,
            time: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
            isRead: false,
            image: 'https://cdn-icons-png.flaticon.com/512/879/879859.png'
        }
      }));
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleComboToggle = (id: string, v: boolean) => {
    setComboItems((prev) => prev.map((c) => (c.id === id ? { ...c, hoatDong: v } : c)));
    message.success(v ? 'Đã kích hoạt combo' : 'Đã tạm dừng combo');
  };

  const handleComboDelete = (item: ICombo) => {
    Modal.confirm({
      title: 'Xác nhận xoá combo?',
      icon: <ExclamationCircleOutlined />,
      content: `Xoá combo "${item.ten}"? Hành động không thể hoàn tác.`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk: () => {
        setComboItems((prev) => prev.filter((c) => c.id !== item.id));
        message.success(`Đã xoá combo "${item.ten}"`);
      },
    });
  };

  const handleComboSubmit = (data: ComboFormPayload) => {
    if (editingCombo) {
      setComboItems((prev) =>
        prev.map((c) => (c.id === editingCombo.id ? { ...c, ...data } : c)),
      );
      message.success('Đã cập nhật combo');
    } else {
      const newCombo: ICombo = { ...data, id: `cb_${Date.now()}` };
      setComboItems((prev) => [newCombo, ...prev]);
      message.success(`Đã tạo combo "${data.ten}"`);
      
      // gửi thông báo
      window.dispatchEvent(new CustomEvent('new_notification', {
        detail: {
            id: `notif_combo_${Date.now()}`,
            title: 'Combo Mới Cực Hời!',
            message: `Vừa ra mắt combo mới: ${data.ten}. Tiết kiệm hơn khi đặt chung nha bạn ơi!`,
            time: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
            isRead: false,
            image: 'https://cdn-icons-png.flaticon.com/512/3480/3480823.png'
        }
      }));
    }
    setComboFormOpen(false);
    setEditingCombo(null);
  };

  const danhSachComboLoc = useMemo(() => {
    let list = comboItems;
    if (comboFilterTrangThai) list = list.filter((c) => c.trangThai === comboFilterTrangThai);
    if (comboTuKhoa.trim()) {
      const kw = comboTuKhoa.toLowerCase();
      list = list.filter((c) => c.ten.toLowerCase().includes(kw));
    }
    return list;
  }, [comboItems, comboTuKhoa, comboFilterTrangThai]);

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
    <>
      <Topbar title="Khuyến mãi" />

      <div className={styles.pageBody}>
          <div className={styles.tabsRow}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'ma-giam-gia' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('ma-giam-gia')}
            >
              Mã Giảm Giá
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'combo' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('combo')}
            >
              Combo
            </button>
          </div>

          {activeTab === 'ma-giam-gia' ? (
            <PageToolbar
              searchPlaceholder="Tìm mã, tên chương trình..."
              searchValue={tuKhoa}
              onSearch={setTuKhoa}
              filters={
                <Badge count={filterTrangThai ? 1 : 0} size="small" offset={[-4, 4]}>
                  <Dropdown overlay={filterMenu} trigger={['click']}>
                    <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                      Trạng thái
                    </Button>
                  </Dropdown>
                </Badge>
              }
              actions={
                <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={() => { setEditing(null); setFormOpen(true); }}>
                  Tạo khuyến mãi
                </Button>
              }
            />
          ) : (
            <PageToolbar
              searchPlaceholder="Tìm tên combo..."
              searchValue={comboTuKhoa}
              onSearch={setComboTuKhoa}
              filters={
                <Badge count={comboFilterTrangThai ? 1 : 0} size="small" offset={[-4, 4]}>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu
                        selectedKeys={[comboFilterTrangThai ?? 'tat_ca']}
                        onClick={({ key }) => setComboFilterTrangThai(key === 'tat_ca' ? null : (key as ETrangThaiKhuyenMai))}
                      >
                        <Menu.Item key="tat_ca">Tất cả</Menu.Item>
                        <Menu.Item key={ETrangThaiKhuyenMai.DANG_CHAY}>Đang chạy</Menu.Item>
                        <Menu.Item key={ETrangThaiKhuyenMai.SAP_HET}>Sắp hết</Menu.Item>
                        <Menu.Item key={ETrangThaiKhuyenMai.TAM_DUNG}>Tạm dừng</Menu.Item>
                        <Menu.Item key={ETrangThaiKhuyenMai.HET_HAN}>Hết hạn</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button icon={<FilterOutlined />} className={styles.btnOutline}>
                      Trạng thái
                    </Button>
                  </Dropdown>
                </Badge>
              }
              actions={
                <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={() => { setEditingCombo(null); setComboFormOpen(true); }}>
                  Tạo combo
                </Button>
              }
            />
          )}

          {/* Nội dung tab */}
          {activeTab === 'ma-giam-gia' && (
            <div className={styles.promoList}>
              {danhSachLoc.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <KhuyenMaiRow
                    item={item}
                    onClick={() => setViewing(item)}
                  />
                  {idx < danhSachLoc.length - 1 && <div className={styles.divider} />}
                </React.Fragment>
              ))}
              {danhSachLoc.length === 0 && (
                <div className={styles.empty}>Không tìm thấy khuyến mãi phù hợp</div>
              )}
            </div>
          )}

          {activeTab === 'combo' && (
            <div className={styles.comboList}>
              {danhSachComboLoc.map((item) => (
                <ComboRow
                  key={item.id}
                  item={item}
                  onClick={() => setViewingCombo(item)}
                />
              ))}
              {danhSachComboLoc.length === 0 && (
                <div className={styles.empty}>Không tìm thấy combo phù hợp</div>
              )}
            </div>
          )}
      </div>

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
        onDelete={() => { if (viewing) handleDelete(viewing); setViewing(null); }}
        onToggle={(v) => { if (viewing) { handleToggleHoatDong(viewing.id, v); setViewing(prev => prev ? { ...prev, hoatDong: v } : null); } }}
      />
      <ComboForm
        open={comboFormOpen}
        initial={editingCombo}
        onCancel={() => { setComboFormOpen(false); setEditingCombo(null); }}
        onSubmit={handleComboSubmit}
      />
      <ComboDetail
        item={viewingCombo}
        onClose={() => setViewingCombo(null)}
        onEdit={() => { setEditingCombo(viewingCombo); setViewingCombo(null); setComboFormOpen(true); }}
        onDelete={() => { if (viewingCombo) handleComboDelete(viewingCombo); setViewingCombo(null); }}
        onToggle={(v) => { if (viewingCombo) { handleComboToggle(viewingCombo.id, v); setViewingCombo(prev => prev ? { ...prev, hoatDong: v } : null); } }}
      />
    </>
  );
};

export default KhuyenMai;
