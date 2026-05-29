import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

import type { RatingPageProps } from '@/services/Khách hàng/Đánh giá/typing';
import useDanhGiaModel from '@/models/Khách Hàng/Đánh giá';
import RatingForm from './Component/RatingForm';

const RatingPage: React.FC<RatingPageProps> = ({ order, onClose }) => {
    const {
        rating, setRating,
        comment, setComment,
        images,
        handleImageChange, handleRemoveImage,
        handleSubmit, handleBackdropClick,
        dishDetails, dishNames
    } = useDanhGiaModel(order, onClose);
    return (
        <div className="baoBocDanhGia" onClick={handleBackdropClick}>
            <div className="khungDanhGia">
                <div className="tieuDeDanhGia">
                    <CloseOutlined className="nutDong" onClick={onClose} />
                    <span className="chuTieuDe">Đánh giá món ăn</span>
                    <div style={{ width: 24 }}></div>
                </div>

                <RatingForm
                    dishDetails={dishDetails}
                    dishNames={dishNames}
                    rating={rating}
                    setRating={setRating}
                    comment={comment}
                    setComment={setComment}
                    images={images}
                    handleImageChange={handleImageChange}
                    handleRemoveImage={handleRemoveImage}
                />
                <div className="chanDanhGia">
                    <button
                        className={`nutGui ${rating > 0 ? 'hoatDong' : ''}`}
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
