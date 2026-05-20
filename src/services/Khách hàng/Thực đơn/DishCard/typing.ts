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

export interface DishCardProps {
  dish: Dish;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onClick?: () => void;
  isFuture?: boolean;
}
