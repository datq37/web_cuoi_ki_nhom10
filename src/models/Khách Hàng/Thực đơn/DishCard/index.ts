import type { Dish } from '@/services/Khách hàng/Thực đơn/typing';

export type CartItem = Dish & { qty: number };

export const addDishToCart = (cart: CartItem[], dish: Dish): CartItem[] => [
  ...cart,
  { ...dish, qty: 1 },
];

export const increaseDishQty = (cart: CartItem[], id: string): CartItem[] =>
  cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);

export const decreaseDishQty = (cart: CartItem[], id: string): CartItem[] =>
  cart
    .map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
    .filter(item => item.qty > 0);
