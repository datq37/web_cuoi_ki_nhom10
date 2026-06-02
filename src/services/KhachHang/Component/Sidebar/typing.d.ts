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
