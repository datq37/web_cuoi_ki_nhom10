import type { Category } from './typing';

export const CATEGORIES: Category[] = [
    { id: 'all', name: 'Tất cả', icon: 'AppstoreOutlined' },
    { id: 'main', name: 'Món chính', icon: 'CoffeeOutlined' },
    { id: 'noodle', name: 'Bún / Phở', icon: 'SmileOutlined' },
    { id: 'rice', name: 'Cơm phần', icon: 'CodeSandboxOutlined' },
    { id: 'veg', name: 'Chay / Salad', icon: 'HeartOutlined' },
    { id: 'snack', name: 'Ăn nhẹ', icon: 'FireOutlined' },
    { id: 'drink', name: 'Đồ uống', icon: 'CoffeeOutlined' },
];

export const MENU_CATEGORIES: Category[] = [
    { id: 'all', name: 'Tất cả', icon: 'AppstoreOutlined' },
    { id: 'main', name: 'Món chính', icon: 'CoffeeOutlined' },
    { id: 'noodle', name: 'Bún / Phở', icon: 'ShopOutlined' },
    { id: 'rice', name: 'Cơm phần', icon: 'ContainerOutlined' },
    { id: 'veg', name: 'Chay / Salad', icon: 'HeartOutlined' },
    { id: 'snack', name: 'Ăn nhẹ', icon: 'FireOutlined' },
    { id: 'drink', name: 'Đồ uống', icon: 'RestOutlined' },
];

export type { Category } from './typing';
