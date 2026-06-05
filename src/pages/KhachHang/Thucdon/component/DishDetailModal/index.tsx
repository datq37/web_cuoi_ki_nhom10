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
import type { DishDetailModalProps } from '@/services/KhachHang/ThucDon/DishDetailModal/typing';
import { getReviewsByDish } from '@/models/KhachHang/ThucDon/DishDetailModal';
import { formatNumberViVN } from '@/utils/format';
import { useModel } from 'umi';
import { Button, Typography } from 'antd';
import './index.less';

const renderStars = (count: number) =>
    [1, 2, 3, 4, 5].map((s) => (
        <StarFilled key={s} style={{ color: s <= count ? '#f59e0b' : '#e5e7eb', fontSize: 13 }} />
    ));

const isImageUrl = (value?: string) => /^https?:\/\//i.test(value || '');

const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, qty, onClose, onAdd, onInc, onDec, isFuture }) => {
    const { reviews: globalReviews } = useModel('KhachHang.ThucDon.index');
    const reviews = getReviewsByDish(globalReviews, dish.id);

    const calculatedRating = React.useMemo(() => {
        if (reviews.length === 0) return 5;
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    const handleBackdrop = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="nenMo" onClick={handleBackdrop}>
            <div className="khungChiTiet">
                <div className="phanAnhBia">
                    {dish.hinhAnh ? (
                        <img src={dish.hinhAnh} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    ) : (
                        <div className="bieuTuongAnhBia">{dish.emoji}</div>
                    )}
                    <div className="theNhanAnhBia">
                        {dish.tags.map((t) => (
                            <Typography.Text key={t} className={`nhanChiTiet ${t}`} style={{ color: 'inherit' }}>{t.toUpperCase()}</Typography.Text>
                        ))}
                    </div>
                    <Button 
                        type="text" 
                        shape="circle" 
                        className="nutDongChiTiet" 
                        onClick={onClose} 
                        style={{ zIndex: 10 }}
                        icon={<CloseOutlined />}
                    />
                </div>
                <div className="phanThanChiTiet">
                    <div className="hangTieuDe">
                        <Typography.Title level={2} className="tenMonChiTiet" style={{ margin: 0, color: 'inherit' }}>{dish.name}</Typography.Title>
                        <Typography.Text className="nhanDanhGia" style={{ color: 'inherit' }}>
                            <StarFilled /> {calculatedRating.toFixed(1)}
                        </Typography.Text>
                    </div>

                    <div className="thongTinChiTiet">
                        <Typography.Text style={{ color: 'inherit' }}><ClockCircleOutlined /> {dish.prep} phút</Typography.Text>
                        <Typography.Text style={{ color: 'inherit' }}><ThunderboltOutlined /> {dish.kcal} kcal</Typography.Text>
                        <Typography.Text style={{ color: 'inherit' }}><FireOutlined /> {dish.sold} đã bán</Typography.Text>
                    </div>
                    <Typography.Paragraph className="moTaChiTiet" style={{ margin: 0 }}>{dish.desc}</Typography.Paragraph>
                    <div className="thanhPhan">
                        <Typography.Text className="nhanPhanChiTiet" style={{ display: 'block', color: 'inherit' }}>Nguyên liệu</Typography.Text>
                        <div className="cacNhanThanhPhan">
                            {dish.ingredients.map((ing) => (
                                <Typography.Text key={ing} className="nhanThanhPhan" style={{ color: 'inherit' }}>{ing}</Typography.Text>
                            ))}
                        </div>
                    </div>
                    <div className="duongChiaChiTiet" />
                    <div className="phanDanhGia">
                        <Typography.Text className="nhanPhanChiTiet" style={{ display: 'block', color: 'inherit' }}>
                            Bình luận
                            <Typography.Text className="soLuongDanhGia" style={{ color: 'inherit' }}>({reviews.length})</Typography.Text>
                        </Typography.Text>

                        {reviews.length === 0 ? (
                            <Typography.Paragraph className="khongCoDanhGia" style={{ margin: 0 }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Typography.Paragraph>
                        ) : (
                            reviews.map((r) => (
                                <div key={r.id} className="mucDanhGia">
                                    <div className="anhDaiDienDanhGia">
                                        {isImageUrl(r.avatar) ? (
                                            <img src={r.avatar} alt={r.author} />
                                        ) : (
                                            r.avatar
                                        )}
                                    </div>
                                    <div className="noiDungDanhGia">
                                        <div className="phanDauDanhGia">
                                            <Typography.Text className="tacGiaDanhGia" style={{ color: 'inherit' }}>{r.author}</Typography.Text>
                                            <Typography.Text className="ngayDanhGia" style={{ color: 'inherit' }}>{r.date}</Typography.Text>
                                        </div>
                                        <div className="saoDanhGia">{renderStars(r.rating)}</div>
                                        <Typography.Paragraph className="binhLuanDanhGia" style={{ margin: 0 }}>{r.comment}</Typography.Paragraph>
                                        {r.images && r.images.length > 0 && (
                                            <div className="danhSachAnhDanhGia" style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                {r.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`ảnh đánh giá ${idx}`}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            border: '1px solid #e2e8f0'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {r.adminReply && (
                                            <div className="phanHoiCanteen">
                                                <Typography.Text strong style={{ color: 'inherit', display: 'block', marginBottom: 2 }}>Phản hồi từ căn tin</Typography.Text>
                                                {r.adminReplyAt && (
                                                    <Typography.Text className="thoiGianPhanHoiCanteen" style={{ color: 'inherit', display: 'block', marginBottom: 6 }}>
                                                        {r.adminReplyAt}
                                                    </Typography.Text>
                                                )}
                                                <div className="noiDungPhanHoiCanteen"><Typography.Text style={{ color: 'inherit' }}>{r.adminReply}</Typography.Text></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="phanChanChiTiet">
                    <div className="khoiGia">
                        <Typography.Text className="giaChiTiet" style={{ color: 'inherit' }}>{formatNumberViVN(dish.price)}</Typography.Text>
                        <Typography.Text className="donViChiTiet" style={{ color: 'inherit' }}>đ</Typography.Text>
                    </div>

                    {isFuture ? (
                        <Button disabled className="nutThemChiTiet disabled">
                            Chưa mở bán
                        </Button>
                    ) : qty === 0 ? (
                        <Button type="primary" className="nutThemChiTiet" onClick={onAdd} icon={<ShoppingCartOutlined />}>
                            Thêm vào giỏ
                        </Button>
                    ) : (
                        <div className="dieuKhienSoLuong">
                            <Button type="text" shape="circle" onClick={onDec} icon={<MinusOutlined />} />
                            <Typography.Text strong style={{ color: 'inherit' }}>{qty}</Typography.Text>
                            <Button type="text" shape="circle" onClick={onInc} icon={<PlusOutlined />} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DishDetailModal;
