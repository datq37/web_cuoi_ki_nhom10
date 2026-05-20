import type { WeekDay } from '@/services/Khách hàng/Thực đơn/DateTabs/typing';

export const getWeekDays = (baseDate = new Date()): WeekDay[] => {
  const today = new Date(baseDate);
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return dayNames.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name,
      num: d.getDate(),
      month: d.getMonth() + 1,
      isToday: d.toDateString() === today.toDateString(),
    };
  });
};

export const getTodayTabIndex = (date = new Date()): number => {
  const dow = date.getDay();
  if (dow === 0) return 0;
  return Math.min(dow - 1, 5);
};
