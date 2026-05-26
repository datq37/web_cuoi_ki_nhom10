import React from 'react';
import {
    Clock3,
    Minus,
    Plus,
    Star,
    Zap,
} from 'lucide-react';
import type { DishCardProps } from '@/services/Khách hàng/Thực đơn/DishCard/typing';
import riceImg from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import noodleImg from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import saladImg from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';
import snackImg from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import drinkImg from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import phoImg from '@/assets/trangchu/pho.png';
import bunChaImg from '@/assets/trangchu/buncha.png';
import xoiImg from '@/assets/trangchu/xoi.png';

const dishImages: Record<string, string> = {
    m1: riceImg,
    m2: phoImg,
    m3: bunChaImg,
    m4: riceImg,
    m5: saladImg,
    m6: xoiImg,
    m7: riceImg,
    m8: noodleImg,
    m9: saladImg,
    m10: snackImg,
    m11: drinkImg,
    m12: drinkImg,
};

const categoryFallbackImages: Record<string, string> = {
    rice: riceImg,
    noodle: noodleImg,
    veg: saladImg,
    snack: snackImg,
    drink: drinkImg,
    main: riceImg,
};

const DishCard: React.FC<DishCardProps> = ({ dish, qty, onAdd, onInc, onDec, onClick, isFuture }) => (
    <div className="dish-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="dish-image">
            <img src={dishImages[dish.id] || categoryFallbackImages[dish.cat]} alt={dish.name} />
            <div className="dish-tags">
                {dish.tags.map(t => (
                    <span key={t} className={`dish-tag ${t}`}>{t.toUpperCase()}</span>
                ))}
            </div>
        </div>
        <div className="dish-body">
            <h3 className="dish-name">{dish.name}</h3>
            <p className="dish-desc">{dish.desc}</p>
            <div className="dish-meta">
                <span><Clock3 size={14} /> {dish.prep}m</span>
                <span><Zap size={14} /> {dish.kcal} kcal</span>
                <span className="dish-rating"><Star size={14} fill="currentColor" /> {dish.rating.toFixed(1)}</span>
            </div>
            <div className="dish-foot">
                <div className="dish-price">
                    {dish.price.toLocaleString()} <span className="currency">đ</span>
                </div>
                {isFuture ? (
                    <span className="future-tag" onClick={(e) => e.stopPropagation()}>Chưa mở bán</span>
                ) : qty === 0 ? (
                    <button className="dish-add" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
                        <Plus size={20} />
                    </button>
                ) : (
                    <div className="dish-qty" onClick={(e) => e.stopPropagation()}>
                        <button onClick={onDec}><Minus size={15} /></button>
                        <span>{qty}</span>
                        <button onClick={onInc}><Plus size={15} /></button>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default DishCard;
