export interface Dish {
  id: string;
  name: string;
  cat: string;
  price: number;
  desc: string;
  emoji: string;
  tags: string[];
  rating: number;
  sold: number;
  prep: number;
  kcal: number;
  ingredients: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface EmployeeMenuProps {
  onOpenCart: () => void;
  ordersToday: number;
}
