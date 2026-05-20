import React from 'react';
import { Clock3, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useModel } from 'umi';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';
import './index.less';


const formatVND = (amount: number) =>
    amount.toLocaleString('vi-VN');


const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

const getDishImage = (cat?: string) => {
    if (cat === 'noodle') return bunPho;
    if (cat === 'drink') return doUong;
    if (cat === 'snack') return anNhe;
    if (cat === 'veg') return chaySalad;
    return comPhan;
};


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

                        {/* Thông tin tên và giá */}
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

                        {/* Bộ điều chỉnh số lượng */}
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
