import { OrderStatus, PaymentMethod } from './index';

export interface OrderItem {
    id: string;
    name: string;
    qty: number;
    price: number;
}

export interface Order {
    id: string;
    user: string;
    userName: string;
    dept: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    payment: PaymentMethod;
    created: string;
    pickup: string;
    note?: string;
}
