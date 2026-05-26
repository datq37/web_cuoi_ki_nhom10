import React, { useState, useRef } from 'react';
import {
    CloseOutlined,
    StarFilled,
    CameraFilled
} from '@ant-design/icons';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import { useModel } from 'umi';
import { message } from 'antd';
import './index.less';

interface RatingPageProps {
    order?: any;
    onClose: () => void;
}

const RatingPage: React.FC<RatingPageProps> = ({ order, onClose }) => {
    const { currentUser } = useModel('Khách Hàng.user');
    const { addReview } = useModel('Khách Hàng.Thực đơn.index');
    const { markAsReviewed } = useModel('Khách Hàng.Orders');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImages((prev) => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleRemoveImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };
    const firstItem = order?.items?.[0];
    const dishDetails = SEED_MENU.find(d => d.id === firstItem?.id);
    const dishNames = order?.items?.map((it: any) => it.name).join(' + ');

    const handleSubmit = () => {
        if (rating === 0) return;
        
        // Thêm đánh giá động cho từng món ăn có trong đơn hàng
        if (order?.items) {
            order.items.forEach((item: any) => {
                addReview({
                    dishId: item.id,
                    author: currentUser?.name || 'Khách hàng',
                    avatar: '😋', // Emoji ăn ngon siêu dễ thương làm avatar đại diện
                    rating: rating,
                    comment: comment.trim() || 'Món ăn ngon, đóng gói rất cẩn thận và sạch sẽ!',
                });
            });
        }
        
        if (order?.id) {
            markAsReviewed(order.id);
        }
        message.success("Cảm ơn bạn đã gửi đánh giá món ăn!");
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="rating-modal-wrapper" onClick={handleBackdropClick}>
            <div className="rating-container">
                {/* Header */}
                <div className="rating-header">
                    <CloseOutlined className="btn-close" onClick={onClose} />
                    <span className="header-title">Đánh giá món ăn</span>
                    <div style={{ width: 24 }}></div>
                </div>

                {/* Main Content Area */}
                <div className="rating-content">
                    {/* Dish Info */}
                    <div className="store-info">
                        <div className="dish-avatar" style={{ fontSize: 60, marginBottom: 12 }}>
                            {dishDetails?.emoji || '🍽️'}
                        </div>
                        <div className="store-name" style={{ color: '#333', fontSize: 15, fontWeight: 600 }}>
                            {dishNames || 'Đơn hàng không tên'}
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarFilled
                                key={star}
                                className={`star-item ${star <= rating ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    {/* Comment Section */}
                    <div className="comment-section">
                        <textarea
                            placeholder="Món ăn có ngon không? Bạn hãy chia sẻ cảm nhận nhé..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />

                        <div className="upload-area">
                            <div
                                className="upload-box"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <CameraFilled className="upload-icon" />
                                <span>Thêm ảnh</span>
                            </div>

                            {images.map((src, idx) => (
                                <div key={idx} className="preview-item">
                                    <img src={src} alt={`preview-${idx}`} />
                                    <span
                                        className="remove-btn"
                                        onClick={() => handleRemoveImage(idx)}
                                    >×</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="rating-footer">
                    <button
                        className={`btn-submit ${rating > 0 ? 'active' : ''}`}
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Gửi đi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingPage;
