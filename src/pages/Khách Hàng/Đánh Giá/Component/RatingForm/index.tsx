import React, { useRef } from 'react';
import { StarFilled, CameraFilled } from '@ant-design/icons';

interface RatingFormProps {
    dishDetails: any;
    dishNames: string;
    rating: number;
    setRating: (rating: number) => void;
    comment: string;
    setComment: (comment: string) => void;
    images: string[];
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (idx: number) => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
    dishDetails,
    dishNames,
    rating,
    setRating,
    comment,
    setComment,
    images,
    handleImageChange,
    handleRemoveImage,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="noiDungDanhGia">
            {/* món */}
            <div className="thongTinCuaHang">
                <div className="anhDaiDienMon" style={{ fontSize: 60, marginBottom: 12 }}>
                    {dishDetails?.emoji || '🍽️'}
                </div>
                <div className="tenCuaHang" style={{ color: '#333', fontSize: 15, fontWeight: 600 }}>
                    {dishNames || 'Đơn hàng không tên'}
                </div>
            </div>

            {/* sao đánh giá */}
            <div className="khungSao">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarFilled
                        key={star}
                        className={`sao ${star <= rating ? 'hoatDong' : ''}`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>

            {/*from đnahs giá */}
            <div className="phanBinhLuan">
                <textarea
                    placeholder="Món ăn có ngon không? Bạn hãy chia sẻ cảm nhận nhé..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />

                <div className="khuVucTaiAnh">
                    <div
                        className="hopTaiAnh"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <CameraFilled className="bieuTuongTaiAnh" />
                        <span>Thêm ảnh</span>
                    </div>

                    {images.map((src, idx) => (
                        <div key={idx} className="anhXemTruoc">
                            <img src={src} alt={`preview-${idx}`} />
                            <span
                                className="nutXoaAnh"
                                onClick={() => handleRemoveImage(idx)}
                            >×</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RatingForm;
