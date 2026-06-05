import {
  CoffeeOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

export enum BadgeTone {
  Green = 'green',
  Red = 'red',
}


export const NAV_EMPLOYEE = [
  { id: 'menu', label: 'Thực Đơn', icon: CoffeeOutlined },
  { id: 'cart', label: 'Giỏ của tôi', icon: ShoppingCartOutlined },
  { id: 'history', label: 'Đơn của tôi', icon: FileTextOutlined },
];

export const defaultUser = {
  avatar: 'MA',
  name: 'Nguyễn Minh Anh',
  dept: 'Engineering'
};

export const RANKS = [
  { name: 'Đồng',      min: 0,        mult: 1,   color: '#cd7f32' },
  { name: 'Bạc',       min: 1000000,  mult: 1.2, color: '#c0c0c0' },
  { name: 'Vàng',      min: 3000000,  mult: 1.5, color: '#ffd700' },
  { name: 'Kim Cương', min: 10000000, mult: 2,   color: '#b9f2ff' },
];
