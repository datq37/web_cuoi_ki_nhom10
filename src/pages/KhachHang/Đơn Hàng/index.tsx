import React from 'react';
import { useModel } from 'umi';
import { Button, Space } from 'antd';
import {
    FileTextOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { ORDER_STATUSES, PAYMENT_METHODS, OrderStatus, Order } from '@/services/KhachHang/Đơn Hàng';
import { SEED_MENU } from '@/services/KhachHang/ThucDon';
import { formatNumberViVN } from '@/utils/format';
import OrderTracker from './component/OrderTracker';
import RatingPage from '../Đánh Giá';
import orderBackground from '@/assets/KhachHang/Đơn hàng/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import './index.less';

const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

const HistoryPage: React.FC = () => {
    const {
        theme,
        filter,
        setFilter,
        ratingOrder,
        setRatingOrder,
        filters,
        visibleOrders,
        handleReorder,
        advanceOrder
    } = useModel('KhachHang.Đơn Hàng.index');

    return (
        <div
            className="khungTrangLichSu"
            style={{ backgroundImage: getPageBackground(orderBackground, theme) }}
        >
            <div className="phanDauTrang">
                <div>
                    <h1 className="tieuDeTrang">Đơn của tôi</h1>
                    <p className="tieuDePhuTrang">Theo dõi trạng thái đơn ăn theo thời gian thực.</p>
                </div>

                <div className="boLocPhanDoan">
                    {filters.map((f: any) => (
                        <button
                            key={f.id}
                            className={filter === f.id ? 'dangChon' : ''}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {visibleOrders.length === 0 ? (
                <div className="trangThaiTrong">
                    <div className="khungBieuTuong"><FileTextOutlined /></div>
                    <h4>Chưa có đơn nào</h4>
                    <span>Đặt món từ thực đơn để bắt đầu</span>
                </div>
            ) : (
                <div className="luoiDonHang">
                    {visibleOrders.map((o: Order) => {
                        const st = ORDER_STATUSES[o.status];
                        const pay = PAYMENT_METHODS[o.payment];

                        return (
                            <div key={o.id} className={`theDonHang trangThai-${o.status}`}>
                                <div className="phanChinhThe">
                                    <div className="phanTraiThe">
                                        <div className="thongTinDon">
                                            <span className="maDon">{o.id}</span>
                                            <span className={`nhanTrangThai ${st.color}`}>
                                                <span className={`chamTrangThai ${st.color}`}></span>
                                                {st.label}
                                            </span>
                                            <span className="thoiGianNhan">
                                                · nhận lúc <strong>{o.pickup}</strong>
                                            </span>
                                        </div>

                                        <div className="danhSachMonAn">
                                            {o.items.map((it: any) => (
                                                <div key={it.id} className="monAnThuGon">
                                                    <span className="bieuTuongMon">{getDish(it.id)?.emoji || '🍽️'}</span>
                                                    <span className="tenMon">{it.name}</span>
                                                    <span className="soLuong">×{it.qty}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <OrderTracker status={o.status} />
                                    </div>

                                    <div className="phanBenThe">
                                        <div className="nhanTongTien">Tổng thanh toán</div>
                                        <div className="giaTriTongTien">
                                            {formatNumberViVN(o.total)}
                                            <span className="donVi">đ</span>
                                        </div>
                                        <div className="phuongThucThanhToan">
                                            {pay.icon} {pay.label}
                                        </div>
                                    </div>
                                </div>

                                {o.note && (
                                    <div className="ghiChuDon">
                                        <InfoCircleOutlined />
                                        <span>Ghi chú: {o.note}</span>
                                    </div>
                                ) || <div style={{ height: 12 }}></div>}

                                <div className="hanhDongThe">
                                    <Space size="middle">
                                        {o.status === OrderStatus.Ready && (
                                            <Button
                                                type="primary"
                                                icon={<CheckOutlined />}
                                                onClick={() => advanceOrder(o.id)}
                                            >
                                                Đã nhận món
                                            </Button>
                                        )}

                                        {o.status === OrderStatus.Done && (
                                            <>
                                                {!o.isReviewed && (
                                                    <Button
                                                        className="nutDanhGiaDon"
                                                        onClick={() => setRatingOrder(o)}
                                                    >
                                                        Đánh giá
                                                    </Button>
                                                )}
                                                <Button
                                                    icon={<ReloadOutlined />}
                                                    type="text"
                                                    onClick={() => handleReorder(o)}
                                                >
                                                    Đặt lại
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {ratingOrder && (
                <RatingPage
                    order={ratingOrder}
                    onClose={() => setRatingOrder(null)}
                />
            )}
        </div>
    );
};

export default HistoryPage;
