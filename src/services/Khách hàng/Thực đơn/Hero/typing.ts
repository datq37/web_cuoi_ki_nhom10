export interface MenuHeroProps {
  orders: number;
  totalDishes: number;
}

export interface EmployeeMenuProps {
  onOpenCart: () => void;
  ordersToday: number;
}
