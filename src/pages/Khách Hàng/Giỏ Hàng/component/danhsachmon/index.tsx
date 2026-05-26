import React from 'react';
import { Clock3, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useModel } from 'umi';
import { formatVND, getDish, getDishImage } from '@/models/Khách Hàng/Giỏ hàng/danhsachmon';
import './index.less';
const DanhSachMon: React.FC = () => {
    const { cart, incCart, decCart } = useModel('Khách Hàng.Thực đơn.index');
    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <div>
                    <div className="cart-empty-icon">
                        <ShoppingCart size={34} />
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
                        <img
                            className="cart-item-thumb"
                            src={getDishImage(dish?.cat)}
                            alt={it.name}
                        />
                        <div className="cart-item-info">
                            <p className="info-name">{it.name}</p>
                            <p className="info-price">{formatVND(it.price)}đ</p>
                            {dish?.prep && (
                                <p className="info-meta">
                                    <Clock3 size={18} />
                                    {dish.prep}p chuẩn bị
                                </p>
                            )}
                        </div>
                        <div className="cart-item-qty">
                            <button
                                className="qty-btn"
                                onClick={() => decCart(it.id)}
                                aria-label="Giảm số lượng"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="qty-num">{it.qty}</span>
                            <button
                                className="qty-btn"
                                onClick={() => incCart(it.id)}
                                aria-label="Tăng số lượng"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DanhSachMon;
