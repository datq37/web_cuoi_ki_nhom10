import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  ShoppingCart,
  Soup,
} from 'lucide-react';
import { history } from 'umi';
import { foodData } from '@/services/Trangchu/herosection';
import './index.less';

export default function FeaturedMenu() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? foodData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === foodData.length - 1 ? 0 : prev + 1));
  };

  const active = foodData[activeIndex];
  const others = foodData.filter((_, i) => i !== activeIndex);

  return (
    <section className="featured-section">
      <div className="featured-title-wrap">
        <div className="featured-title-row">
          <span className="featured-title-line" />
          <div className="featured-title-center">
            <Leaf className="featured-leaf-icon" size={28} />
            <h2 className="featured-title">THỰC ĐƠN NỔI BẬT</h2>
          </div>
          <span className="featured-title-line" />
        </div>
      </div>

      <div className="featured-banner-wrap">
        <div className="featured-banner">
          <div className="featured-main-card">
            <img
              src={active.image}
              alt={active.name}
              className="featured-bg-img"
            />

            <div className="featured-overlay-lr" />
            <div className="featured-overlay-tb" />

            <div className="featured-deco-leaf featured-deco-leaf-right">🌿</div>
            <div className="featured-deco-leaf featured-deco-leaf-left">🌱</div>

            <div className="featured-content">
              <h3 className="featured-dish-title">
                {active.menuName}
                <br />
                <span className="featured-dish-subtitle">{active.subtitle}</span>
              </h3>

              <div className="featured-divider">
                <span className="featured-divider-line" />
                <Leaf size={18} className="featured-divider-leaf" />
                <span className="featured-divider-line" />
              </div>

              <p className="featured-dish-desc">{active.description}</p>

              <button
                className="featured-mobile-cta-btn"
                onClick={() => history.push('/dang-nhap')}
              >
                <ShoppingCart size={18} />
                <span>Đặt món ngay</span>
                <ArrowRight size={18} />
              </button>

              <div className="featured-badges">
                <FeatureBadge icon={<Leaf size={22} />} value="100%" label="Nguyên liệu tươi" />
                <FeatureBadge icon={<Soup size={22} />} value="Ngon" label="Chuẩn vị" />
                <FeatureBadge icon={<Heart size={22} />} value="500+" label="Khách yêu thích" />
              </div>
            </div>
          </div>

          <div className="featured-mobile-other-head">
            <h3>MÓN NGON KHÁC</h3>
          </div>

          <div className="featured-food-cards">
            {others.map((food) => (
              <FoodMiniCard
                key={food.name}
                food={food}
                onClick={() => setActiveIndex(foodData.indexOf(food))}
              />
            ))}
          </div>

          <div className="featured-dots">
            {foodData.map((dish, i) => (
              <span
                key={dish.name}
                className={`featured-dot ${i === activeIndex ? 'featured-dot-active' : ''}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          <div className="featured-bottom-arrows">
            <button className="featured-nav-btn" onClick={handlePrev}>
              <ChevronLeft size={22} />
            </button>
            <button className="featured-nav-btn" onClick={handleNext}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FoodMiniCard({ food, onClick }: { food: typeof foodData[number], onClick: () => void }) {
  return (
    <div className="food-mini-card" onClick={onClick}>
      <div className="food-mini-card-img-wrap">
        <img src={food.image} alt={food.menuName} className="food-mini-card-img" />
      </div>
      <div className="food-mini-card-body">
        <h4 className="food-mini-card-name">{food.menuName}</h4>
        <div className="food-mini-card-line" />
        <p className="food-mini-card-price">{food.price}</p>
      </div>
    </div>
  );
}

function FeatureBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="feature-badge">
      <span className="feature-badge-icon">{icon}</span>
      <div>
        <p className="feature-badge-value">{value}</p>
        <p className="feature-badge-label">{label}</p>
      </div>
    </div>
  );
}
