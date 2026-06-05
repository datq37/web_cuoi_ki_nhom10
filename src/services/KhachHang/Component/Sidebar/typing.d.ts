import { BadgeTone } from './index';

export interface SidebarProps {
  role?: 'employee';
  onRoleChange?: (role: 'employee') => void;
  page?: string;
  onPageChange?: (page: string) => void;
  cartCount?: number;
  currentUser?: {
    avatar?: string;
    name?: string;
    dept?: string;
  };
}

export interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

export interface SidebarItemProps {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeTone?: BadgeTone;
  onClick: () => void;
}
