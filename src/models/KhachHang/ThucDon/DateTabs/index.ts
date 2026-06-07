import type { WeekDay } from '@/services/KhachHang/ThucDon/DateTabs/typing';
import { getCachedCanteenSettings, isBusinessDayOpen } from '@/utils/businessHours';

export const getWeekDays = (baseDate = new Date()): WeekDay[] => {
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const settings = getCachedCanteenSettings();
  const days = settings.gioHD || [];

  return dayNames.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return {
      name,
      num: d.getDate(),
      month: d.getMonth() + 1,
      dateISO: d.toISOString(),
      isToday: d.getTime() === today.getTime(),
      isPast: d.getTime() < today.getTime(),
      isFuture: d.getTime() > today.getTime(),
      isOpen: isBusinessDayOpen(d, days),
    };
  }).filter((d) => d.isOpen);
};

export const getTodayTabIndex = (date = new Date()): number => {
  const days = getWeekDays(date);
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const index = days.findIndex((day) => {
    const d = new Date(day.dateISO);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  return index >= 0 ? index : 0;
};
