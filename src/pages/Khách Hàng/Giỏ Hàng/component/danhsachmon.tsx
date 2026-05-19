import React from 'react';
import { PlusOutlined, MinusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import './danhsachmon.less';


const formatVND = (amount: number) =>
    amount.toLocaleString('vi-VN');


const getDish = (id: string) => SEED_MENU.find(d => d.id === id);


const DanhSachMon: React.FC = () => {
    const { cart, incCart, decCart } = useModel('Khách Hàng.Thực đơn.index');


    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <div>
                    <div className="cart-empty-icon">
                        <ShoppingOutlined />
                    </div>
                    <div className="cart-empty-title">Giỏ đang trống</div>
                    <div className="cart-empty-sub">Hãy chọn món bạn thích từ thực đơn</div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-items-list">
            {cart.map((it: any) => {
                const dish = getDish(it.id);

                return (
                    <div className="cart-item" key={it.id}>
                        {/* Ảnh / emoji đại diện món */}
                        <div className="cart-item-thumb">
                            {dish?.emoji || '🍽️'}
                        </div>

                        {/* Thông tin tên và giá */}
                        <div className="cart-item-info">
                            <p className="info-name">{it.name}</p>
                            <p className="info-meta">
                                {formatVND(it.price)} đ
                                {dish?.prep ? ` · ${dish.prep}p chuẩn bị` : ''}
                            </p>
                        </div>

                        {/* Bộ điều chỉnh số lượng */}
                        <div className="cart-item-qty">
                            <button
                                className="qty-btn"
                                onClick={() => decCart(it.id)}
                                aria-label="Giảm số lượng"
                            >
                                <MinusOutlined style={{ fontSize: 11 }} />
                            </button>
                            <span className="qty-num">{it.qty}</span>
                            <button
                                className="qty-btn"
                                onClick={() => incCart(it.id)}
                                aria-label="Tăng số lượng"
                            >
                                <PlusOutlined style={{ fontSize: 11 }} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DanhSachMon;
