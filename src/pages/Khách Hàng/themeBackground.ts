import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

export const getPageBackground = (image: string, theme: ThemeType) => {
  if (theme === ThemeType.DARK) {
    return `linear-gradient(rgb(8 12 10 / 72%), rgb(8 12 10 / 72%)), url("${image}")`;
  }

  return `url("${image}")`;
};
