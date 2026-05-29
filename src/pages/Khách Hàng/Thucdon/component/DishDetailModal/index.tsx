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
                            <StarFilled /> {dish.rating.toFixed(1)}
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
                                    <div className="anhDaiDienDanhGia">{r.avatar}</div>
                                    <div className="noiDungDanhGia">
                                        <div className="phanDauDanhGia">
                                            <span className="tacGiaDanhGia">{r.author}</span>
                                            <span className="ngayDanhGia">{r.date}</span>
                                        </div>
                                        <div className="saoDanhGia">{renderStars(r.rating)}</div>
                                        <p className="binhLuanDanhGia">{r.comment}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="phanChanChiTiet">
                    <div className="khoiGia">
                        <span className="giaChiTiet">{dish.price.toLocaleString('vi-VN')}</span>
                        <span className="donViChiTiet">đ</span>
                    </div>

                    {isFuture ? (
                        <button className="nutThemChiTiet disabled" disabled style={{ background: '#f5f5f5', color: '#999', cursor: 'not-allowed', border: '1px solid #e9ecef', boxShadow: 'none' }}>
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
