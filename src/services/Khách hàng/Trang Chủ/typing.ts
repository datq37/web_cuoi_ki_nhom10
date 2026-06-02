import React from 'react';
import type { Dish } from '@/services/Khách hàng/Thực đơn/typing';

export enum StatCardTone {
  Green = 'green',
  Orange = 'orange',
  Blue = 'blue',
  Lime = 'lime',
}

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain',
}

export interface StatCardProps {
  icon: React.ReactNode;
  image?: string;
  tone: StatCardTone;
  title: string;
  value: string;
  desc: string;
}

export interface CategoryCardProps {
  img: string;
  title: string;
}

export interface FoodCardProps {
  dish: Dish;
  img: string;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onClick: () => void;
  hot?: boolean;
}

export interface StepCardProps {
  number: string;
  img?: string;
  icon?: React.ReactNode;
  imageFit?: ImageFit;
  title: string;
  desc: string;
}


export interface BannerProps {
  setPage: (page: string) => void;
  todayDishCount: number;
  activeOfferCount: number;
  placedOrderCount: number;
}


export interface MenuAndBestSellersProps {
  setPage: (page: string) => void;
  bestSellingDishes: Dish[];
  cartQty: (id: string) => number;
  addToCart: (dish: Dish) => void;
  incCart: (id: string) => void;
  decCart: (id: string) => void;
  setSelectedDish: (dish: Dish) => void;
  getDishImage: (dish: Dish) => string;
}


export interface OffersAndCombosProps {
  setPage: (page: string) => void;
}
