import React, { useState, useRef } from 'react';
import {
    CloseOutlined,
    StarFilled,
    CameraFilled
} from '@ant-design/icons';
import './index.less';

import type { RatingPageProps } from '@/services/Khách hàng/Đánh giá/typing';
import useDanhGiaModel from '@/models/Khách Hàng/Đánh giá';

const RatingPage: React.FC<RatingPageProps> = ({ order, onClose }) => {
    const {
        rating, setRating,
        comment, setComment,
        images,
        handleImageChange, handleRemoveImage,
        handleSubmit, handleBackdropClick,
        dishDetails, dishNames
    } = useDanhGiaModel(order, onClose);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
