import {
  AppstoreOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Input, Switch } from 'antd';
import React, { useState } from 'react';
import Topbar from '@/pages/Quản Trị/Topbar';
import styles from './index.less';

// ── Enums & types ───────────────────────────────────────────────
type TTab = 'thong-tin' | 'gio-hoat-dong' | 'thanh-toan' | 'thong-bao' | 'bao-mat';

const TABS: { key: TTab; label: string; Icon: React.FC<any> }[] = [
  { key: 'thong-tin',     label: 'Thông tin chung', Icon: AppstoreOutlined    },
  { key: 'gio-hoat-dong', label: 'Giờ hoạt động',  Icon: ClockCircleOutlined },
  { key: 'thanh-toan',    label: 'Thanh toán',      Icon: CreditCardOutlined  },
  { key: 'thong-bao',     label: 'Thông báo',       Icon: BellOutlined        },
  { key: 'bao-mat',       label: 'Bảo mật',         Icon: SafetyOutlined      },
];

const DAYS = [
  { label: 'Thứ Hai',  defaultOn: true,  mo: '07:00', close: '18:00' },
  { label: 'Thứ Ba',   defaultOn: true,  mo: '07:00', close: '18:00' },
  { label: 'Thứ Tư',   defaultOn: true,  mo: '07:00', close: '18:00' },
  { label: 'Thứ Năm',  defaultOn: true,  mo: '07:00', close: '18:00' },
  { label: 'Thứ Sáu',  defaultOn: true,  mo: '07:00', close: '18:00' },
  { label: 'Thứ Bảy',  defaultOn: true,  mo: '08:00', close: '13:00' },
  { label: 'Chủ Nhật', defaultOn: false, mo: '08:00', close: '12:00' },
];

// ── Tab: Thông tin chung ────────────────────────────────────────
const ThongTinChung: React.FC = () => (
  <div className={styles.tabContent}>
    <div className={styles.contentTitle}>Thông tin chung</div>
    <div className={styles.contentSub}>Thông tin căng tin sẽ hiển thị cho người dùng</div>

    {/* Logo */}
    <div className={styles.logoSection}>
      <div className={styles.logoIcon}>
        <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 8z" fill="white" />
        </svg>
      </div>
      <div className={styles.logoMeta}>
        <div className={styles.logoName}>Logo căng tin</div>
        <div className={styles.logoHint}>Tải lên ảnh PNG hoặc SVG, kích thước tối thiểu 256×256px</div>
      </div>
      <Button icon={<UploadOutlined />} className={styles.btnOutline}>
        Đổi logo
      </Button>
    </div>

    {/* Fields */}
    <div className={styles.fieldGroup}>
      <div className={styles.fieldFull}>
        <label className={styles.fieldLabel}>
          Tên căng tin <span className={styles.required}>*</span>
        </label>
        <Input defaultValue="Căng tin Doanh nghiệp ABC" className={styles.fieldInput} />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldHalf}>
          <label className={styles.fieldLabel}>Tên hiển thị</label>
          <Input defaultValue="Căng tin · Toà nhà A" className={styles.fieldInput} />
        </div>
        <div className={styles.fieldHalf}>
          <label className={styles.fieldLabel}>Mã căng tin</label>
          <Input defaultValue="CT-HQ-01" className={styles.fieldInput} />
        </div>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.fieldLabel}>Địa chỉ</label>
        <Input defaultValue="Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM" className={styles.fieldInput} />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldHalf}>
          <label className={styles.fieldLabel}>Điện thoại liên hệ</label>
          <Input defaultValue="0283 555 1234" className={styles.fieldInput} />
        </div>
        <div className={styles.fieldHalf}>
          <label className={styles.fieldLabel}>Email</label>
          <Input defaultValue="canteen@abc.com.vn" className={styles.fieldInput} />
        </div>
      </div>
    </div>

    <div className={styles.saveRow}>
      <Button type="primary" className={styles.btnSave}>Lưu thay đổi</Button>
    </div>
  </div>
);

// ── Tab: Giờ hoạt động ──────────────────────────────────────────
const GioHoatDong: React.FC = () => {
  const [days, setDays] = useState(DAYS.map((d) => ({ ...d, on: d.defaultOn })));

  const toggle = (i: number) =>
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, on: !d.on } : d)));

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Giờ hoạt động</div>
      <div className={styles.contentSub}>Khách hàng sẽ thấy giờ này khi đặt món</div>

      <div className={styles.dayList}>
        {days.map((day, i) => (
          <div key={day.label} className={`${styles.dayRow} ${!day.on ? styles.dayOff : ''}`}>
            <span className={styles.dayLabel}>{day.label}</span>
            <Switch checked={day.on} onChange={() => toggle(i)} />
            <Input
              value={day.mo}
              disabled={!day.on}
              className={styles.timeInput}
            />
            <span className={styles.timeDash}>—</span>
            <Input
              value={day.close}
              disabled={!day.on}
              className={styles.timeInput}
            />
          </div>
        ))}
      </div>

      <div className={styles.saveRow}>
        <Button type="primary" className={styles.btnSave}>Lưu thay đổi</Button>
      </div>
    </div>
  );
};

// ── Tab: Thanh toán ─────────────────────────────────────────────
interface IPayMethod { id: string; icon: string; ten: string; moTa: string; on: boolean }

const PAYMENT_METHODS: IPayMethod[] = [
  { id: 'tien-mat',     icon: '💵', ten: 'Tiền mặt',    moTa: 'Trả trực tiếp tại quầy',             on: true  },
  { id: 'chuyen-khoan', icon: '🏦', ten: 'Chuyển khoản', moTa: 'VietQR / Chuyển khoản · Vietcombank · 0123456789', on: true  },
];

const ThanhToan: React.FC = () => {
  const [methods, setMethods] = useState(PAYMENT_METHODS);

  const toggle = (id: string) =>
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, on: !m.on } : m)));

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Phương thức thanh toán</div>
      <div className={styles.contentSub}>Quản lý các phương thức thanh toán nhân viên có thể dùng</div>

      <div className={styles.payList}>
        {methods.map((m) => (
          <div key={m.id} className={styles.payRow}>
            <div className={styles.payIconWrap}>{m.icon}</div>
            <div className={styles.payInfo}>
              <div className={styles.payName}>{m.ten}</div>
              <div className={styles.payMoTa}>{m.moTa}</div>
            </div>
            <Switch checked={m.on} onChange={() => toggle(m.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab: Thông báo ──────────────────────────────────────────────
const NOTIF_ITEMS = [
  { id: 'don-moi',    ten: 'Đơn hàng mới',      moTa: 'Mỗi khi có đơn hàng mới được tạo',              on: true  },
  { id: 'don-huy',    ten: 'Đơn hàng huỷ',      moTa: 'Khi khách huỷ đơn hoặc đơn không thực hiện được', on: true  },
  { id: 'kho',        ten: 'Cảnh báo kho',       moTa: 'Nguyên liệu sắp hết hoặc đã hết hàng',           on: true  },
  { id: 'danh-gia',   ten: 'Đánh giá mới',       moTa: 'Khách hàng đánh giá món ăn hoặc dịch vụ',        on: false },
  { id: 'bao-cao',    ten: 'Báo cáo hàng ngày',  moTa: 'Tóm tắt doanh thu cuối ngày lúc 20:00',          on: true  },
  { id: 'cap-nhat',   ten: 'Cập nhật hệ thống',  moTa: 'Thông báo bảo trì, cập nhật tính năng',          on: true  },
];

const ThongBao: React.FC = () => {
  const [items, setItems] = useState(NOTIF_ITEMS);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, on: !n.on } : n)));

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Cài đặt thông báo</div>
      <div className={styles.contentSub}>Chọn loại thông báo bạn muốn nhận</div>

      <div className={styles.notifList}>
        {items.map((item, idx) => (
          <div key={item.id} className={`${styles.notifRow} ${idx < items.length - 1 ? styles.notifBorder : ''}`}>
            <div className={styles.notifInfo}>
              <div className={styles.notifName}>{item.ten}</div>
              <div className={styles.notifMoTa}>{item.moTa}</div>
            </div>
            <Switch checked={item.on} onChange={() => toggle(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab: Bảo mật ────────────────────────────────────────────────
const BaoMat: React.FC = () => {
  const [twoFA, setTwoFA] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Bảo mật</div>
      <div className={styles.contentSub}>Bảo vệ tài khoản và dữ liệu của bạn</div>

      <div className={styles.fieldGroup}>
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Mật khẩu hiện tại</label>
          <Input.Password defaultValue="12345678" className={styles.fieldInput} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Mật khẩu mới</label>
            <Input.Password placeholder="" className={styles.fieldInput} />
          </div>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Nhập lại mật khẩu</label>
            <Input.Password placeholder="" className={styles.fieldInput} />
          </div>
        </div>
      </div>

      <div className={styles.securityList}>
        <div className={styles.secRow}>
          <div className={styles.secInfo}>
            <div className={styles.secName}>Xác thực 2 lớp (2FA)</div>
            <div className={styles.secMoTa}>Yêu cầu mã OTP khi đăng nhập</div>
          </div>
          <Switch checked={twoFA} onChange={setTwoFA} />
        </div>
        <div className={styles.secRow}>
          <div className={styles.secInfo}>
            <div className={styles.secName}>Đăng xuất tự động</div>
            <div className={styles.secMoTa}>Sau 30 phút không hoạt động</div>
          </div>
          <Switch checked={autoLogout} onChange={setAutoLogout} />
        </div>
      </div>

      <div className={styles.saveRow}>
        <Button type="primary" className={styles.btnSave}>Cập nhật mật khẩu</Button>
      </div>
    </div>
  );
};

// ── Main page ───────────────────────────────────────────────────
const CONTENT_MAP: Record<TTab, React.FC> = {
  'thong-tin':     ThongTinChung,
  'gio-hoat-dong': GioHoatDong,
  'thanh-toan':    ThanhToan,
  'thong-bao':     ThongBao,
  'bao-mat':       BaoMat,
};

const CaiDat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TTab>('thong-tin');
  const ContentComponent = CONTENT_MAP[activeTab];

  return (
    <>
      <Topbar title="Cài đặt" subtitle="Tuỳ chỉnh thông tin và cấu hình căng tin" />

        <div className={styles.pageBody}>
          <div className={styles.settingsWrap}>
            {/* Left nav */}
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

            {/* Right content */}
            <div className={styles.rightContent}>
              <ContentComponent />
            </div>
          </div>
        </div>
    </>
  );
};

export default CaiDat;
