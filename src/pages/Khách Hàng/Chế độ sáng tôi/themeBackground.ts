import { ThemeType } from '@/services/Khách hàng/Component/topbar/typing';

export const getPageBackground = (image: string, theme: ThemeType) => {
  if (theme === ThemeType.DARK) {
    return `linear-gradient(rgb(6 9 8 / 88%), rgb(6 9 8 / 88%)), url("${image}")`;
  }

  return `url("${image}")`;
};
