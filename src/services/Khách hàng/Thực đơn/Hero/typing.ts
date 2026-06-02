import type { Dish } from '../DishCard/typing';

export interface MenuHeroProps {
  orders: number;
  totalDishes: number;
  bestSeller?: Dish;
}
