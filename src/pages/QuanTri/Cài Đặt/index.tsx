import {
  AppstoreOutlined,
  ClockCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Input, Switch, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Topbar from '@/pages/QuanTri/Topbar';
import useLocalStorage from '@/hooks/useLocalStorage';
import { KEYS, store } from '@/utils/storage';
import { CANTEEN_INFO_CHANGE_EVENT } from '@/hooks/useCanteenInfo';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { cacheCanteenSettings } from '@/utils/businessHours';
import styles from './index.less';

// ── Types ────────────────────────────────────────────────────────
type TTab = 'thong-tin' | 'gio-hoat-dong';

interface IDayConfig { label: string; on: boolean; mo: string; close: string; }

interface ISettings {
  thongTin: { ten: string; diaChi: string; sdt: string; email: string; logo: string; };
  gioHD:    IDayConfig[];
  thanhToan: { id: string; on: boolean }[];
  thongBao:  { id: string; on: boolean }[];
  baoMat:   { twoFA: boolean; autoLogout: boolean; };
}

// ── Defaults ─────────────────────────────────────────────────────
const DEFAULT_SETTINGS: ISettings = {
  thongTin: {
    ten: 'Căng tin Doanh nghiệp',
    diaChi: 'Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM',
    sdt: '0283 555 1234',
    email: 'canteen@abc.com.vn',
    logo: '/logo.webp',
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

const TABS: { key: TTab; label: string; Icon: React.FC<any> }[] = [
  { key: 'thong-tin',     label: 'Thông tin chung', Icon: AppstoreOutlined    },
  { key: 'gio-hoat-dong', label: 'Giờ hoạt động',  Icon: ClockCircleOutlined },
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
  const [form, setForm] = useState({ ...init, logo: (init as any).logo || '/logo.webp' });
  const [savedUser, setSavedUser] = useLocalStorage<{ ten?: string; email?: string; avatar?: string }>(KEYS.user, {});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const s = loadSettings();
    const nextThongTin = {
      ten: form.ten,
      diaChi: form.diaChi,
      sdt: form.sdt,
      email: form.email,
      logo: form.logo,
    };
    const nextSettings = { ...s, thongTin: nextThongTin };

    // 1. Lưu localStorage ngay — UI phản hồi tức thì
    store.set(KEYS.settings, nextSettings);
    // 2. Cập nhật admin_user để Topbar admin phản ánh
    setSavedUser({ ten: form.ten, email: form.email, avatar: savedUser.avatar });
    // 3. Phát sự kiện để tất cả component dùng useCanteenInfo tự cập nhật
    window.dispatchEvent(new Event(CANTEEN_INFO_CHANGE_EVENT));

    // 4. Đồng bộ lên backend (database)
    try {
      const res = await axios.put(`${ip3}/settings`, nextSettings);
      // Cập nhật lại localStorage từ response backend (đảm bảo nhất quán)
      if (res.data) {
        store.set(KEYS.settings, res.data);
        window.dispatchEvent(new Event(CANTEEN_INFO_CHANGE_EVENT));
      }
      savedMsg();
    } catch {
      message.warning('Đã lưu trên trình duyệt, nhưng chưa đồng bộ được lên máy chủ.');
    }
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setForm((prev) => ({ ...prev, logo: b64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentTitle}>Thông tin chung</div>
      <div className={styles.contentSub}>Thông tin căng tin sẽ hiển thị cho người dùng trên toàn bộ hệ thống</div>

      {/* Logo */}
      <div className={styles.logoSection}>
        <div
          className={styles.logoIcon}
          style={{ overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
        >
          <img
            src={form.logo || '/logo.webp'}
            alt="Logo căng tin"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className={styles.logoMeta}>
          <div className={styles.logoName}>Logo căng tin</div>
          <div className={styles.logoHint}>PNG hoặc JPG · Hiển thị trên tất cả trang</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
        <Button icon={<UploadOutlined />} className={styles.btnOutline} onClick={() => fileRef.current?.click()}>
          Đổi logo
        </Button>
      </div>

      <div className={styles.fieldGroup}>
        {/* Tên căng tin */}
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Tên căng tin <span className={styles.required}>*</span></label>
          <Input
            value={form.ten}
            onChange={(e) => setForm({ ...form, ten: e.target.value })}
            className={styles.fieldInput}
            placeholder="Ví dụ: Căng tin Doanh nghiệp ABC"
          />
        </div>

        {/* Địa chỉ */}
        <div className={styles.fieldFull}>
          <label className={styles.fieldLabel}>Địa chỉ</label>
          <Input
            value={form.diaChi}
            onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
            className={styles.fieldInput}
            placeholder="Ví dụ: Tầng 1, Toà nhà A, KCN Tân Thuận, Q.7, TP.HCM"
          />
        </div>

        {/* SĐT + Email */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Số điện thoại</label>
            <Input
              value={form.sdt}
              onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              className={styles.fieldInput}
              placeholder="Ví dụ: 0283 555 1234"
            />
          </div>
          <div className={styles.fieldHalf}>
            <label className={styles.fieldLabel}>Email liên hệ</label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={styles.fieldInput}
              placeholder="Ví dụ: canteen@abc.com.vn"
            />
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

  useEffect(() => {
    axios.get(`${ip3}/settings`)
      .then((res) => {
        if (res.data?.gioHD?.length) {
          cacheCanteenSettings(res.data);
          setDays(res.data.gioHD);
        }
      })
      .catch(() => {});
  }, []);

  const update = (i: number, patch: Partial<IDayConfig>) =>
    setDays((prev) => prev.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const handleSave = async () => {
    const nextSettings = { ...loadSettings(), gioHD: days };
    store.set(KEYS.settings, nextSettings);
    try {
      const res = await axios.put(`${ip3}/settings`, nextSettings);
      cacheCanteenSettings(res.data || nextSettings);
      savedMsg();
    } catch (error) {
      message.warning('Đã lưu trên trình duyệt, nhưng chưa đồng bộ được lên máy chủ.');
    }
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


// ── Trang chính ──────────────────────────────────────────────────
const CaiDat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TTab>('thong-tin');

  const CONTENT_MAP: Record<TTab, React.FC> = {
    'thong-tin':     ThongTinChung,
    'gio-hoat-dong': GioHoatDong,
  };
  const ContentComponent = CONTENT_MAP[activeTab];

  return (
    <>
      <Topbar title="Cài đặt" />

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
