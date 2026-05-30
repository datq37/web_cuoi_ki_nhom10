import type { Dish } from '@/services/Khách hàng/Thực đơn/typing';

export type CartItem = Dish & { qty: number };

export const addDishToCart = (cart: CartItem[], dish: Dish, qty: number = 1): CartItem[] => {
  const existing = cart.find(item => item.id === dish.id);
  if (existing) {
    return cart.map(item => item.id === dish.id ? { ...item, qty: item.qty + qty } : item);
  }
  return [...cart, { ...dish, qty }];
};

export const increaseDishQty = (cart: CartItem[], id: string): CartItem[] =>
  cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);

export const decreaseDishQty = (cart: CartItem[], id: string): CartItem[] =>
  cart
    .map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
    .filter(item => item.qty > 0);
