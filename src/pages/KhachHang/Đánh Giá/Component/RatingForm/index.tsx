import React from 'react';
import { CameraFilled, CloseOutlined } from '@ant-design/icons';
import { Button, Input, Rate, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { RatingFormProps } from '@/services/KhachHang/Đánh giá/typing';

const RatingForm: React.FC<RatingFormProps> = ({
    dishDetails,
    dishNames,
    rating,
    setRating,
    comment,
    setComment,
    images,
    handleImageFiles,
    handleRemoveImage,
}) => {
    const beforeUpload = (file: RcFile) => {
        handleImageFiles([file]);
        return false;
    };

    return (
        <div className="noiDungDanhGia">
            <div className="thongTinCuaHang">
                <div className="anhDaiDienMon" style={{ fontSize: 60, marginBottom: 12 }}>
                    {dishDetails?.emoji || '🍽️'}
                </div>
                <div className="tenCuaHang" style={{ color: '#333', fontSize: 15, fontWeight: 600 }}>
                    {dishNames || 'Đơn hàng không tên'}
                </div>
            </div>
            <div className="khungSao">
                <Rate value={rating} onChange={setRating} className="saoAnt" />
            </div>
            <div className="phanBinhLuan">
                <Input.TextArea
                    placeholder="Món ăn có ngon không? Bạn hãy chia sẻ cảm nhận nhé..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />

                <div className="khuVucTaiAnh">
                    <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                    >
                        <Button className="hopTaiAnh" icon={<CameraFilled className="bieuTuongTaiAnh" />}>
                            Thêm ảnh
                        </Button>
                    </Upload>

                    {images.map((src, idx) => (
                        <div key={idx} className="anhXemTruoc">
                            <img src={src} alt={`preview-${idx}`} />
                            <Button
                                type="text"
                                shape="circle"
                                className="nutXoaAnh"
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveImage(idx)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RatingForm;
