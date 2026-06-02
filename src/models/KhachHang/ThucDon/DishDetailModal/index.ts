import type { Review } from '@/services/KhachHang/ThucDon/typing';

export const getReviewsByDish = (reviews: Review[], dishId: string): Review[] =>
  reviews.filter(review => review.dishId === dishId);

export const createReview = (newReview: Omit<Review, 'id' | 'date'>): Review => ({
  ...newReview,
  id: `r_${Date.now()}`,
  date: new Date().toLocaleDateString('vi-VN'),
});
