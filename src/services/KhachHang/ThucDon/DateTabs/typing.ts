export interface WeekDay {
  name: string;
  num: number;
  month: number;
  dateISO: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isOpen: boolean;
}

export interface DayTabsProps {
  selected: number;
  onSelect: (index: number) => void;
}
