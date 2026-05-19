import { Dish } from '@/services/Khách hàng/Thực đơn/typing';


export interface DishCardProps {
    dish: Dish;
    qty: number;
    onAdd: () => void;
    onInc: () => void;
    onDec: () => void;
    onClick?: () => void;
    isFuture?: boolean;
}
