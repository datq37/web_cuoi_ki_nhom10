import React from 'react';
import {
    CloseOutlined,
    StarFilled,
    ThunderboltOutlined,
    ClockCircleOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
    FireOutlined,
} from '@ant-design/icons';
import type { DishDetailModalProps } from '@/services/Khách hàng/Thực đơn/DishDetailModal/typing';
import { getReviewsByDish } from '@/models/Khách Hàng/Thực đơn/DishDetailModal';
import { useModel } from 'umi';
import './index.less';

const renderStars = (count: number) =>
    [1, 2, 3, 4, 5].map((s) => (
        <StarFilled key={s} style={{ color: s <= count ? '#f59e0b' : '#e5e7eb', fontSize: 13 }} />
    ));

const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, qty, onClose, onAdd, onInc, onDec, isFuture }) => {
    const { reviews: globalReviews } = useModel('Khách Hàng.Thực đơn.index');
    const reviews = getReviewsByDish(globalReviews, dish.id);

    const handleBackdrop = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="ddm-backdrop" onClick={handleBackdrop}>
            <div className="ddm-sheet">
                <div className="ddm-hero">
                    <div className="ddm-hero-emoji">{dish.emoji}</div>
                    <div className="ddm-hero-tags">
                        {dish.tags.map((t) => (
                            <span key={t} className={`ddm-tag ${t}`}>{t.toUpperCase()}</span>
                        ))}
                    </div>
                    <button className="ddm-close" onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>
                <div className="ddm-body">
                    <div className="ddm-title-row">
                        <h2 className="ddm-name">{dish.name}</h2>
                        <span className="ddm-rating-badge">
                            <StarFilled /> {dish.rating.toFixed(1)}
                        </span>
                    </div>

                    <div className="ddm-meta">
                        <span><ClockCircleOutlined /> {dish.prep} phút</span>
                        <span><ThunderboltOutlined /> {dish.kcal} kcal</span>
                        <span><FireOutlined /> {dish.sold} đã bán</span>
                    </div>
                    <p className="ddm-desc">{dish.desc}</p>
                    <div className="ddm-ingredients">
                        <span className="ddm-section-label">Nguyên liệu</span>
                        <div className="ddm-ing-chips">
                            {dish.ingredients.map((ing) => (
                                <span key={ing} className="ddm-ing-chip">{ing}</span>
                            ))}
                        </div>
                    </div>
                    <div className="ddm-divider" />
                    <div className="ddm-reviews">
                        <span className="ddm-section-label">
                            Bình luận
                            <span className="ddm-review-count">({reviews.length})</span>
                        </span>

                        {reviews.length === 0 ? (
                            <p className="ddm-no-review">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                        ) : (
                            reviews.map((r) => (
                                <div key={r.id} className="ddm-review-item">
                                    <div className="ddm-review-avatar">{r.avatar}</div>
                                    <div className="ddm-review-content">
                                        <div className="ddm-review-header">
                                            <span className="ddm-review-author">{r.author}</span>
                                            <span className="ddm-review-date">{r.date}</span>
                                        </div>
                                        <div className="ddm-review-stars">{renderStars(r.rating)}</div>
                                        <p className="ddm-review-comment">{r.comment}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="ddm-footer">
                    <div className="ddm-price-block">
                        <span className="ddm-price">{dish.price.toLocaleString('vi-VN')}</span>
                        <span className="ddm-currency">đ</span>
                    </div>

                    {isFuture ? (
                        <button className="ddm-btn-add disabled" disabled style={{ background: '#f5f5f5', color: '#999', cursor: 'not-allowed', border: '1px solid #e9ecef', boxShadow: 'none' }}>
                            Chưa mở bán
                        </button>
                    ) : qty === 0 ? (
                        <button className="ddm-btn-add" onClick={onAdd}>
                            <ShoppingCartOutlined />
                            Thêm vào giỏ
                        </button>
                    ) : (
                        <div className="ddm-qty-control">
                            <button onClick={onDec}><MinusOutlined /></button>
                            <span>{qty}</span>
                            <button onClick={onInc}><PlusOutlined /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DishDetailModal;
