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
                            <span key={t} className={`nhanChiTiet ${t}`}>{t.toUpperCase()}</span>
                        ))}
                    </div>
                    <button className="nutDongChiTiet" onClick={onClose} style={{ zIndex: 10 }}>
                        <CloseOutlined />
                    </button>
                </div>
                <div className="phanThanChiTiet">
                    <div className="hangTieuDe">
                        <h2 className="tenMonChiTiet">{dish.name}</h2>
                        <span className="nhanDanhGia">
                            <StarFilled /> {calculatedRating.toFixed(1)}
                        </span>
                    </div>

                    <div className="thongTinChiTiet">
                        <span><ClockCircleOutlined /> {dish.prep} phút</span>
                        <span><ThunderboltOutlined /> {dish.kcal} kcal</span>
                        <span><FireOutlined /> {dish.sold} đã bán</span>
                    </div>
                    <p className="moTaChiTiet">{dish.desc}</p>
                    <div className="thanhPhan">
                        <span className="nhanPhanChiTiet">Nguyên liệu</span>
                        <div className="cacNhanThanhPhan">
                            {dish.ingredients.map((ing) => (
                                <span key={ing} className="nhanThanhPhan">{ing}</span>
                            ))}
                        </div>
                    </div>
                    <div className="duongChiaChiTiet" />
                    <div className="phanDanhGia">
                        <span className="nhanPhanChiTiet">
                            Bình luận
                            <span className="soLuongDanhGia">({reviews.length})</span>
                        </span>

                        {reviews.length === 0 ? (
                            <p className="khongCoDanhGia">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
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
                                            <span className="tacGiaDanhGia">{r.author}</span>
                                            <span className="ngayDanhGia">{r.date}</span>
                                        </div>
                                        <div className="saoDanhGia">{renderStars(r.rating)}</div>
                                        <p className="binhLuanDanhGia">{r.comment}</p>
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
                                                <strong>Phản hồi từ căn tin</strong>
                                                {r.adminReplyAt && (
                                                    <span className="thoiGianPhanHoiCanteen">
                                                        {r.adminReplyAt}
                                                    </span>
                                                )}
                                                <div className="noiDungPhanHoiCanteen">{r.adminReply}</div>
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
                        <span className="giaChiTiet">{formatNumberViVN(dish.price)}</span>
                        <span className="donViChiTiet">đ</span>
                    </div>

                    {isFuture ? (
                        <button className="nutThemChiTiet disabled" disabled>
                            Chưa mở bán
                        </button>
                    ) : qty === 0 ? (
                        <button className="nutThemChiTiet" onClick={onAdd}>
                            <ShoppingCartOutlined />
                            Thêm vào giỏ
                        </button>
                    ) : (
                        <div className="dieuKhienSoLuong">
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
