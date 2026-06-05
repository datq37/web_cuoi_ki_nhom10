import React from 'react';
import { Empty, Button, Typography, Avatar } from 'antd';
import { Clock3, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useModel } from 'umi';
import { formatVND, getDish, getDishImage } from '@/models/KhachHang/Giỏ hàng/danhsachmon';
import './index.less';
const DanhSachMon: React.FC = () => {
    const { cart, incCart, decCart } = useModel('KhachHang.ThucDon.index');
    if (cart.length === 0) {
        return (
            <Empty
                className="gioHangTrong"
                image={<div className="bieuTuongGioHangTrong"><ShoppingCart size={34} /></div>}
                description={
                    <>
                        <Typography.Title level={5} className="tieuDeGioHangTrong" style={{ margin: '0 0 5px' }}>Giỏ đang trống</Typography.Title>
                        <Typography.Text className="phuDeGioHangTrong">Hãy chọn món bạn thích từ thực đơn</Typography.Text>
                    </>
                }
            />
        );
    }
    return (
        <div className="danhSachMonGioHang">
            {cart.map((it: any) => {
                const dish = getDish(it.id);

                return (
                    <div className="monGioHang" key={it.id}>
                        <Avatar
                            shape="square"
                            className="anhNhoMonGioHang"
                            src={getDishImage(it)}
                            alt={it.name}
                        />
                        <div className="thongTinMonGioHang">
                            <Typography.Paragraph className="tenThongTin" style={{ marginBottom: 0 }}>{it.name}</Typography.Paragraph>
                            <Typography.Paragraph className="giaThongTin" style={{ marginBottom: 0 }}>{formatVND(it.price)}đ</Typography.Paragraph>
                            {dish?.prep && (
                                <Typography.Paragraph className="sieuThongTin" style={{ marginBottom: 0 }}>
                                    <Clock3 size={18} />
                                    {dish.prep}p chuẩn bị
                                </Typography.Paragraph>
                            )}
                        </div>
                        <div className="soLuongMonGioHang">
                            <Button
                                type="text"
                                className="nutSoLuong"
                                onClick={() => decCart(it.id)}
                                aria-label="Giảm số lượng"
                                icon={<Minus size={20} />}
                            />
                            <Typography.Text className="soLuong">{it.qty}</Typography.Text>
                            <Button
                                type="text"
                                className="nutSoLuong"
                                onClick={() => incCart(it.id)}
                                aria-label="Tăng số lượng"
                                icon={<Plus size={20} />}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DanhSachMon;
