import type { Dish } from '../DishCard/typing';

export interface Review {
  id: string;
  dishId: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DishDetailModalProps {
  dish: Dish;
  qty: number;
  onClose: () => void;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  isFuture?: boolean;
}
