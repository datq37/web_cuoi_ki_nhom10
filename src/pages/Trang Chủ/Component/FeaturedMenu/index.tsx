import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Soup,
} from 'lucide-react';
import './index.less';

const featuredPho = require('@/assets/trangchu/pho.png');
const bunCha = require('@/assets/trangchu/buncha.png');
const xoiXeo = require('@/assets/trangchu/xoi.png');
const nemNuong = require('@/assets/trangchu/nemnuong.png');

const allDishes = [
  {
    name: 'PHỞ BÒ',
    subtitle: 'GIA TRUYỀN',
    image: featuredPho,
    desc: 'Nước dùng thanh ngọt, bánh phở mềm dai, thịt bò tươi ngon mang đậm đà bản sắc tinh hoa ẩm thực Việt Nam.',
    price: '45.000đ',
  },
  {
    name: 'BÚN CHẢ',
    subtitle: 'HƯƠNG LIÊN',
    image: bunCha,
    desc: 'Bún chả thơm ngon với chả nướng than hoa đặc trưng, nước chấm chua ngọt đậm đà.',
    price: '35.000đ',
  },
  {
    name: 'XÔI XÉO',
    subtitle: 'HÀ NỘI',
    image: xoiXeo,
    desc: 'Xôi xéo dẻo thơm với đậu xanh mịn béo, hành phi vàng ruộm, đặc sản sáng Hà Nội.',
    price: '22.000đ',
  },
  {
    name: 'NEM NƯỚNG',
    subtitle: 'NHA TRANG',
    image: nemNuong,
    desc: 'Nem nướng Nha Trang thơm lừng, cuộn cùng rau sống tươi và nước chấm đặc trưng.',
    price: '40.000đ',
  },
];

export default function FeaturedMenu() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allDishes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allDishes.length - 1 ? 0 : prev + 1));
  };

  const active = allDishes[activeIndex];

  // Other dishes (not active)
  const others = allDishes.filter((_, i) => i !== activeIndex);

  return (
    <section className="featured-section">
      {/* Title */}
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

      {/* Big banner */}
      <div className="featured-banner-wrap">
        <div className="featured-banner">
          {/* Background image */}
          <img
            src={active.image}
            alt={active.name}
            className="featured-bg-img"
          />

          {/* Overlays */}
          <div className="featured-overlay-lr" />
          <div className="featured-overlay-tb" />

          {/* Decorative leaves */}
          <div className="featured-deco-leaf featured-deco-leaf-right">🌿</div>
          <div className="featured-deco-leaf featured-deco-leaf-left">🌱</div>

          {/* Left text */}
          <div className="featured-content">
            <h3 className="featured-dish-title">
              {active.name}
              <br />
              <span className="featured-dish-subtitle">{active.subtitle}</span>
            </h3>

            <div className="featured-divider">
              <span className="featured-divider-line" />
              <Leaf size={18} className="featured-divider-leaf" />
              <span className="featured-divider-line" />
            </div>

            <p className="featured-dish-desc">{active.desc}</p>

            {/* Feature badges */}
            <div className="featured-badges">
              <FeatureBadge icon={<Leaf size={22} />} value="100%" label="Nguyên liệu tươi" />
              <FeatureBadge icon={<Soup size={22} />} value="Ngon" label="Chuẩn vị" />
              <FeatureBadge icon={<Heart size={22} />} value="500+" label="Khách yêu thích" />
            </div>
          </div>

          {/* Food mini cards — click to switch */}
          <div className="featured-food-cards">
            {others.map((food) => (
              <FoodMiniCard
                key={food.name}
                food={food}
                onClick={() => setActiveIndex(allDishes.indexOf(food))}
              />
            ))}
          </div>

          {/* Bottom dots */}
          <div className="featured-dots">
            {allDishes.map((_, i) => (
              <span
                key={i}
                className={`featured-dot ${i === activeIndex ? 'featured-dot-active' : ''}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {/* Bottom nav arrows */}
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

function FoodMiniCard({ food, onClick }: { food: { name: string; price: string; image: string }, onClick: () => void }) {
  return (
    <div className="food-mini-card" onClick={onClick}>
      <div className="food-mini-card-img-wrap">
        <img src={food.image} alt={food.name} className="food-mini-card-img" />
      </div>
      <div className="food-mini-card-body">
        <h4 className="food-mini-card-name">{food.name}</h4>
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
