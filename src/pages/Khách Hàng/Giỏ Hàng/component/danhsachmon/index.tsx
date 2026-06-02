import React from 'react';
import { Clock3, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useModel } from 'umi';
import { formatVND, getDish, getDishImage } from '@/models/Khách Hàng/Giỏ hàng/danhsachmon';
import './index.less';
const DanhSachMon: React.FC = () => {
    const { cart, incCart, decCart } = useModel('Khách Hàng.Thực đơn.index');
    if (cart.length === 0) {
        return (
            <div className="gioHangTrong">
                <div>
                    <div className="bieuTuongGioHangTrong">
                        <ShoppingCart size={34} />
                    </div>
                    <div className="tieuDeGioHangTrong">Giỏ đang trống</div>
                    <div className="phuDeGioHangTrong">Hãy chọn món bạn thích từ thực đơn</div>
                </div>
            </div>
        );
    }
    return (
        <div className="danhSachMonGioHang">
            {cart.map((it: any) => {
                const dish = getDish(it.id);

                return (
                    <div className="monGioHang" key={it.id}>
                        <img
                            className="anhNhoMonGioHang"
                            src={getDishImage(dish?.cat)}
                            alt={it.name}
                        />
                        <div className="thongTinMonGioHang">
                            <p className="tenThongTin">{it.name}</p>
                            <p className="giaThongTin">{formatVND(it.price)}đ</p>
                            {dish?.prep && (
                                <p className="sieuThongTin">
                                    <Clock3 size={18} />
                                    {dish.prep}p chuẩn bị
                                </p>
                            )}
                        </div>
                        <div className="soLuongMonGioHang">
                            <button
                                className="nutSoLuong"
                                onClick={() => decCart(it.id)}
                                aria-label="Giảm số lượng"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="soLuong">{it.qty}</span>
                            <button
                                className="nutSoLuong"
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
