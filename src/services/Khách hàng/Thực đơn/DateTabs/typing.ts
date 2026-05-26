export interface WeekDay {
  name: string;
  num: number;
  month: number;
  isToday: boolean;
}

export interface DayTabsProps {
  selected: number;
  onSelect: (index: number) => void;
}
