import { KEYS, store } from '@/utils/storage';

export interface DayBusinessConfig {
  label: string;
  on: boolean;
  mo: string;
  close: string;
}

export interface CanteenSettings {
  gioHD?: DayBusinessConfig[];
  [key: string]: any;
}

export interface OrderingStatus {
  open: boolean;
  message: string;
  dayLabel?: string;
  openTime?: string;
  closeTime?: string;
}

export const DEFAULT_GIO_HD: DayBusinessConfig[] = [
  { label: 'Thứ Hai', on: true, mo: '07:00', close: '18:00' },
  { label: 'Thứ Ba', on: true, mo: '07:00', close: '18:00' },
  { label: 'Thứ Tư', on: true, mo: '07:00', close: '18:00' },
  { label: 'Thứ Năm', on: true, mo: '07:00', close: '18:00' },
  { label: 'Thứ Sáu', on: true, mo: '07:00', close: '18:00' },
  { label: 'Thứ Bảy', on: true, mo: '08:00', close: '13:00' },
  { label: 'Chủ Nhật', on: false, mo: '08:00', close: '12:00' },
];

const parseMinutes = (value?: string): number | null => {
  if (!value) return null;
  const [hour, minute] = value.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
};

const getTodayConfig = (now: Date, days: DayBusinessConfig[]) => {
  const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  return days[dayIndex];
};

export const cacheCanteenSettings = (settings: CanteenSettings) => {
  store.set(KEYS.settings, settings);
};

export const getCachedCanteenSettings = (): CanteenSettings => {
  return store.get<CanteenSettings>(KEYS.settings, { gioHD: DEFAULT_GIO_HD });
};

export const getOrderingStatusFromCache = (now = new Date()): OrderingStatus => {
  const settings = getCachedCanteenSettings();
  const days = settings.gioHD?.length ? settings.gioHD : DEFAULT_GIO_HD;
  const today = getTodayConfig(now, days);

  if (!today || !today.on) {
    return {
      open: false,
      message: 'Căng tin hôm nay không mở bán.',
      dayLabel: today?.label,
    };
  }

  const openMin = parseMinutes(today.mo);
  const closeMin = parseMinutes(today.close);
  if (openMin === null || closeMin === null) {
    return {
      open: false,
      message: 'Giờ mở bán chưa được cấu hình hợp lệ.',
      dayLabel: today.label,
      openTime: today.mo,
      closeTime: today.close,
    };
  }

  const currentMin = now.getHours() * 60 + now.getMinutes();
  const open =
    closeMin >= openMin
      ? currentMin >= openMin && currentMin <= closeMin
      : currentMin >= openMin || currentMin <= closeMin;

  return {
    open,
    message: open
      ? `Đang mở bán đến ${today.close}.`
      : `Căng tin chỉ mở bán từ ${today.mo} đến ${today.close} hôm nay.`,
    dayLabel: today.label,
    openTime: today.mo,
    closeTime: today.close,
  };
};
