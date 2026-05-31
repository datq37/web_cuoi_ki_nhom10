import {
  AppstoreOutlined,
  BellOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Input, Switch, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import { KEYS, store } from '@/utils/storage';
import styles from './index.less';

// ── Types ────────────────────────────────────────────────────────
type TTab = 'thong-tin' | 'gio-hoat-dong' | 'thanh-toan' | 'thong-bao' | 'bao-mat';

interface IDayConfig { label: string; on: boolean; mo: string; close: string; }
interface IPayMethod  { id: string; icon: string; ten: string; moTa: string; on: boolean; }
interface INotifItem  { id: string; ten: string; moTa: string; on: boolean; }

interface ISettings {
  thongTin: { ten: string; tenHienThi: string; ma: string; diaChi: string; sdt: string; email: string; };
  gioHD:    IDayConfig[];
  thanhToan: { id: string; on: boolean }[];
  thongBao:  { id: string; on: boolean }[];
  baoMat:   { twoFA: boolean; autoLogout: boolean; };
}

// ── Defaults ─────────────────────────────────────────────────────
const DEFAULT_SETTINGS: ISettings = {
  thongTin: {
    ten: 'Căng tin Doanh nghiệp ABC',
    tenHienThi: 'Căng tin · Toà nhà A',
    ma: 'CT-HQ-01',
    diaChi: 'Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM',
    sdt: '0283 555 1234',
    email: 'canteen@abc.com.vn',
  },
  gioHD: [
    { label: 'Thứ Hai',  on: true,  mo: '07:00', close: '18:00' },
    { label: 'Thứ Ba',   on: true,  mo: '07:00', close: '18:00' },
    { label: 'Thứ Tư',   on: true,  mo: '07:00', close: '18:00' },
    { label: 'Thứ Năm',  on: true,  mo: '07:00', close: '18:00' },
    { label: 'Thứ Sáu',  on: true,  mo: '07:00', close: '18:00' },
    { label: 'Thứ Bảy',  on: true,  mo: '08:00', close: '13:00' },
    { label: 'Chủ Nhật', on: false, mo: '08:00', close: '12:00' },
  ],
  thanhToan: [
    { id: 'tien-mat',     on: true  },
    { id: 'chuyen-khoan', on: true  },
  ],
  thongBao: [
    { id: 'don-moi',  on: true  },
    { id: 'don-huy',  on: true  },
    { id: 'kho',      on: true  },
    { id: 'danh-gia', on: false },
    { id: 'bao-cao',  on: true  },
    { id: 'cap-nhat', on: true  },
  ],
  baoMat: { twoFA: true, autoLogout: true },
};

const PAYMENT_META: Record<string, { icon: string; ten: string; moTa: string }> = {
  'tien-mat':     { icon: '💵', ten: 'Tiền mặt',    moTa: 'Trả trực tiếp tại quầy' },
  'chuyen-khoan': { icon: '🏦', ten: 'Chuyển khoản', moTa: 'VietQR / Chuyển khoản · Vietcombank · 0123456789' },
};

const NOTIF_META: Record<string, { ten: string; moTa: string }> = {
  'don-moi':  { ten: 'Đơn hàng mới',     moTa: 'Mỗi khi có đơn hàng mới được tạo' },
  'don-huy':  { ten: 'Đơn hàng huỷ',     moTa: 'Khi khách huỷ đơn hoặc không thực hiện được' },
  'kho':      { ten: 'Cảnh báo kho',      moTa: 'Nguyên liệu sắp hết hoặc đã hết hàng' },
  'danh-gia': { ten: 'Đánh giá mới',      moTa: 'Khách hàng đánh giá món ăn hoặc dịch vụ' },
  'bao-cao':  { ten: 'Báo cáo hàng ngày', moTa: 'Tóm tắt doanh thu cuối ngày lúc 20:00' },
  'cap-nhat': { ten: 'Cập nhật hệ thống', moTa: 'Thông báo bảo trì, cập nhật tính năng' },
};

const TABS: { key: TTab; label: string; Icon: React.FC<any> }[] = [
  { key: 'thong-tin',     label: 'Thông tin chung', Icon: AppstoreOutlined    },
  { key: 'gio-hoat-dong', label: 'Giờ hoạt động',  Icon: ClockCircleOutlined },
  { key: 'thanh-toan',    label: 'Thanh toán',      Icon: CreditCardOutlined  },
  { key: 'thong-bao',     label: 'Thông báo',       Icon: BellOutlined        },
  { key: 'bao-mat',       label: 'Bảo mật',         Icon: SafetyOutlined      },
];

// ── Helper ───────────────────────────────────────────────────────
function loadSettings(): ISettings {
  return store.get<ISettings>(KEYS.settings, DEFAULT_SETTINGS);
}

function savedMsg() {
  message.success(`Đã lưu lúc ${dayjs().format('HH:mm')}`);
}

// ── Tab: Thông tin chung ─────────────────────────────────────────
const ThongTinChung: React.FC = () => {
  const init = loadSettings().thongTin;
  const [form, setForm] = useState(init);
  const [avatar, setAvatar] = useState<string>(
    store.get<{ avatar?: string }>(KEYS.user, {}).avatar ?? '',
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const s = loadSettings();
    store.set(KEYS.settings, { ...s, thongTin: form });
    // Cập nhật Topbar
    store.set(KEYS.user, { ten: form.tenHienThi || form.ten, email: form.email, avatar });
    savedMsg();
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setAvatar(b64);
      const user = store.get<any>(KEYS.user, {});
      store.set(KEYS.user, { ...user, avatar: b64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Thông tin chung</div>
      <div className={styles.contentSub}>Thông tin căng tin sẽ hiển thị cho người dùng</div>

      {/* Avatar / Logo */}
      <div className={styles.logoSection}>
        <div
          className={styles.logoIcon}
          style={{ overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
        >
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 8z" fill="white" />
              </svg>
          }
        </div>
        <div className={styles.logoMeta}>
          <div className={styles.logoName}>Ảnh đại diện / Logo</div>
          <div className={styles.logoHint}>PNG hoặc JPG, hiển thị trên Topbar</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
        <Button icon={<UploadOutlined />} className={styles.btnOutline} onClick={() => fileRef.current?.click()}>
          Đổi ảnh
        </Button>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Tên căng tin <span className={styles.required}>*</span></label>
          <Input value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} className={styles.fieldInput} />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Tên hiển thị</label>
            <Input value={form.tenHienThi} onChange={(e) => setForm({ ...form, tenHienThi: e.target.value })} className={styles.fieldInput} />
          </div>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Mã căng tin</label>
            <Input value={form.ma} onChange={(e) => setForm({ ...form, ma: e.target.value })} className={styles.fieldInput} />
          </div>
        </div>
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Địa chỉ</label>
          <Input value={form.diaChi} onChange={(e) => setForm({ ...form, diaChi: e.target.value })} className={styles.fieldInput} />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Điện thoại liên hệ</label>
            <Input value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} className={styles.fieldInput} />
          </div>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={styles.fieldInput} />
          </div>
        </div>
      </div>

      <div className={styles.saveRow}>
        <Button type="primary" className={styles.btnSave} onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </div>
  );
};

// ── Tab: Giờ hoạt động ───────────────────────────────────────────
const GioHoatDong: React.FC = () => {
  const [days, setDays] = useState<IDayConfig[]>(loadSettings().gioHD);

  const update = (i: number, patch: Partial<IDayConfig>) =>
    setDays((prev) => prev.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const handleSave = () => {
    store.set(KEYS.settings, { ...loadSettings(), gioHD: days });
    savedMsg();
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Giờ hoạt động</div>
      <div className={styles.contentSub}>Khách hàng sẽ thấy giờ này khi đặt món</div>

      <div className={styles.dayList}>
        {days.map((day, i) => (
          <div key={day.label} className={`${styles.dayRow} ${!day.on ? styles.dayOff : ''}`}>
            <span className={styles.dayLabel}>{day.label}</span>
            <Switch checked={day.on} onChange={(v) => update(i, { on: v })} />
            <Input
              value={day.mo}
              disabled={!day.on}
              className={styles.timeInput}
              onChange={(e) => update(i, { mo: e.target.value })}
            />
            <span className={styles.timeDash}>—</span>
            <Input
              value={day.close}
              disabled={!day.on}
              className={styles.timeInput}
              onChange={(e) => update(i, { close: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className={styles.saveRow}>
        <Button type="primary" className={styles.btnSave} onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </div>
  );
};

// ── Tab: Thanh toán ──────────────────────────────────────────────
const ThanhToan: React.FC = () => {
  const [methods, setMethods] = useState(() => loadSettings().thanhToan);

  const toggle = (id: string) => {
    const next = methods.map((m) => m.id === id ? { ...m, on: !m.on } : m);
    setMethods(next);
    store.set(KEYS.settings, { ...loadSettings(), thanhToan: next });
    savedMsg();
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Phương thức thanh toán</div>
      <div className={styles.contentSub}>Quản lý các phương thức thanh toán nhân viên có thể dùng</div>

      <div className={styles.payList}>
        {methods.map((m) => {
          const meta = PAYMENT_META[m.id];
          return (
            <div key={m.id} className={styles.payRow}>
              <div className={styles.payIconWrap}>{meta?.icon}</div>
              <div className={styles.payInfo}>
                <div className={styles.payName}>{meta?.ten}</div>
                <div className={styles.payMoTa}>{meta?.moTa}</div>
              </div>
              <Switch checked={m.on} onChange={() => toggle(m.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Tab: Thông báo ───────────────────────────────────────────────
const ThongBao: React.FC = () => {
  const [items, setItems] = useState(() => loadSettings().thongBao);

  const toggle = (id: string) => {
    const next = items.map((n) => n.id === id ? { ...n, on: !n.on } : n);
    setItems(next);
    store.set(KEYS.settings, { ...loadSettings(), thongBao: next });
    savedMsg();
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Cài đặt thông báo</div>
      <div className={styles.contentSub}>Chọn loại thông báo bạn muốn nhận</div>

      <div className={styles.notifList}>
        {items.map((item, idx) => {
          const meta = NOTIF_META[item.id];
          return (
            <div key={item.id} className={`${styles.notifRow} ${idx < items.length - 1 ? styles.notifBorder : ''}`}>
              <div className={styles.notifInfo}>
                <div className={styles.notifName}>{meta?.ten}</div>
                <div className={styles.notifMoTa}>{meta?.moTa}</div>
              </div>
              <Switch checked={item.on} onChange={() => toggle(item.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Tab: Bảo mật ─────────────────────────────────────────────────
const BaoMat: React.FC = () => {
  const initBaoMat = loadSettings().baoMat;
  const [twoFA,      setTwoFA]      = useState(initBaoMat.twoFA);
  const [autoLogout, setAutoLogout] = useState(initBaoMat.autoLogout);
  const [matKhauCu,  setMatKhauCu]  = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [nhapLai,    setNhapLai]    = useState('');
  const [err,        setErr]        = useState('');

  const saveSecurity = (patch: Partial<{ twoFA: boolean; autoLogout: boolean }>) => {
    store.set(KEYS.settings, { ...loadSettings(), baoMat: { twoFA, autoLogout, ...patch } });
    savedMsg();
  };

  const handleMatKhau = () => {
    setErr('');
    if (!matKhauCu) { setErr('Vui lòng nhập mật khẩu hiện tại'); return; }
    if (matKhauMoi.length < 8) { setErr('Mật khẩu mới tối thiểu 8 ký tự'); return; }
    if (matKhauMoi !== nhapLai) { setErr('Mật khẩu nhập lại không khớp'); return; }
    message.success('Đã cập nhật mật khẩu thành công');
    setMatKhauCu(''); setMatKhauMoi(''); setNhapLai('');
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Bảo mật</div>
      <div className={styles.contentSub}>Bảo vệ tài khoản và dữ liệu của bạn</div>

      <div className={styles.fieldGroup}>
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Mật khẩu hiện tại</label>
          <Input.Password value={matKhauCu} onChange={(e) => setMatKhauCu(e.target.value)} className={styles.fieldInput} />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Mật khẩu mới</label>
            <Input.Password value={matKhauMoi} onChange={(e) => setMatKhauMoi(e.target.value)} placeholder="Tối thiểu 8 ký tự" className={styles.fieldInput} />
          </div>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Nhập lại mật khẩu</label>
            <Input.Password value={nhapLai} onChange={(e) => setNhapLai(e.target.value)} className={styles.fieldInput} />
          </div>
        </div>
        {err && <div style={{ color: '#dc2626', fontSize: 13 }}>{err}</div>}
      </div>

      <div className={styles.securityList}>
        <div className={styles.secRow}>
          <div className={styles.secInfo}>
            <div className={styles.secName}>Xác thực 2 lớp (2FA)</div>
            <div className={styles.secMoTa}>Yêu cầu mã OTP khi đăng nhập</div>
          </div>
          <Switch checked={twoFA} onChange={(v) => { setTwoFA(v); saveSecurity({ twoFA: v }); }} />
        </div>
        <div className={styles.secRow}>
          <div className={styles.secInfo}>
            <div className={styles.secName}>Đăng xuất tự động</div>
            <div className={styles.secMoTa}>Sau 30 phút không hoạt động</div>
          </div>
          <Switch checked={autoLogout} onChange={(v) => { setAutoLogout(v); saveSecurity({ autoLogout: v }); }} />
        </div>
      </div>

      <div className={styles.saveRow}>
        <Button type="primary" className={styles.btnSave} onClick={handleMatKhau}>
          Cập nhật mật khẩu
        </Button>
      </div>
    </div>
  );
};

// ── Trang chính ──────────────────────────────────────────────────
const CaiDat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TTab>('thong-tin');

  const CONTENT_MAP: Record<TTab, React.FC> = {
    'thong-tin':     ThongTinChung,
    'gio-hoat-dong': GioHoatDong,
    'thanh-toan':    ThanhToan,
    'thong-bao':     ThongBao,
    'bao-mat':       BaoMat,
  };
  const ContentComponent = CONTENT_MAP[activeTab];

  return (
    <>
      <Topbar title="Cài đặt" subtitle="Tuỳ chỉnh thông tin và cấu hình căng tin" />

      <div className={styles.pageBody}>
        <div className={styles.settingsWrap}>
          <div className={styles.leftNav}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.navItem} ${activeTab === tab.key ? styles.navActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.Icon className={styles.navIcon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.rightContent}>
            <ContentComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default CaiDat;
