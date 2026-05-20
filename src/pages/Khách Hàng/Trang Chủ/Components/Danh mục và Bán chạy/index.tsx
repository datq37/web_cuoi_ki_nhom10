import React from 'react';
import { Heart, Minus, Plus, Star, Timer } from 'lucide-react';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';
import type { Dish } from '@/services/Khách hàng/Thực đơn/typing';
import type { CategoryCardProps, FoodCardProps, MenuAndBestSellersProps } from '@/services/Khách hàng/Trang Chủ/typing';
import './index.less';


const SectionTitle: React.FC<{ title: string; onViewAll?: () => void; className?: string }> = ({ title, onViewAll, className }) => (
  <div className={`section-title-row ${className || ''}`}>
    <h2>{title}</h2>
    {onViewAll && <button onClick={onViewAll}>Xem tất cả</button>}
  </div>
);

const CategoryCard: React.FC<CategoryCardProps> = ({ img, title }) => (
  <button className="category-card">
    <img src={img} alt={title} />
    <span>{title}</span>
  </button>
);

const FoodCard: React.FC<FoodCardProps> = ({ dish, img, qty, onAdd, onInc, onDec, onClick, hot }) => (
  <div className="home-food-card" onClick={onClick}>
    <div className="food-image-wrap">
      <img src={img} alt={dish.name} />
      {hot && <div className="hot-badge">HOT</div>}
      <button className="heart-btn" aria-label="Yêu thích" onClick={(e) => e.stopPropagation()}>
        <Heart size={18} />
      </button>
    </div>
    <div className="food-content">
      <h3>{dish.name}</h3>
      <p>{dish.desc}</p>
      <div className="food-meta">
        <span>
          <Timer size={14} />
          {dish.kcal} kcal
        </span>
        <span className="rating">
          <Star size={15} fill="currentColor" />
          {dish.rating.toFixed(1)}
        </span>
      </div>
      <div className="food-bottom">
        <strong>{dish.price.toLocaleString('vi-VN')}đ</strong>
        {qty === 0 ? (
          <button aria-label="Thêm món" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
            <Plus size={20} />
          </button>
        ) : (
          <div className="food-qty" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Giảm món" onClick={onDec}>
              <Minus size={15} />
            </button>
            <span>{qty}</span>
            <button aria-label="Tăng món" onClick={onInc}>
              <Plus size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const MenuAndBestSellers: React.FC<MenuAndBestSellersProps> = ({
  setPage,
  bestSellingDishes,
  cartQty,
  addToCart,
  incCart,
  decCart,
  setSelectedDish,
  getDishImage,
}) => {
  return (
    <>
      <SectionTitle title="Danh mục nổi bật" onViewAll={() => setPage('menu')} />
      <div className="category-grid">
        <CategoryCard img={comPhan} title="Cơm phần" />
        <CategoryCard img={bunPho} title="Bún / Phở" />
        <CategoryCard img={doUong} title="Đồ uống" />
        <CategoryCard img={anNhe} title="Ăn nhẹ" />
        <CategoryCard img={chaySalad} title="Chay / Salad" />
      </div>

      <SectionTitle title="Món bán chạy hôm nay" className="spaced" />
      <div className="food-grid">
        {bestSellingDishes.map((dish) => (
          <FoodCard
            key={dish.id}
            dish={dish}
            img={getDishImage(dish)}
            hot={dish.tags.includes('hot')}
            qty={cartQty(dish.id)}
            onAdd={() => addToCart(dish)}
            onInc={() => incCart(dish.id)}
            onDec={() => decCart(dish.id)}
            onClick={() => setSelectedDish(dish)}
          />
        ))}
      </div>
    </>
  );
};

export default MenuAndBestSellers;
