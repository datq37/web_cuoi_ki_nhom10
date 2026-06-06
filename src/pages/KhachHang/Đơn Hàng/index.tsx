import React from 'react';
import { useModel } from 'umi';
import { Button, Space, Typography, Segmented, Empty, Card, Tag, Alert, Avatar } from 'antd';
import {
    FileTextOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    ReloadOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { ORDER_STATUSES, PAYMENT_METHODS, OrderStatus, PaymentMethod } from '@/services/KhachHang/Đơn Hàng';
import type { Order } from '@/services/KhachHang/Đơn Hàng';

import { formatNumberViVN } from '@/utils/format';
import OrderTracker from './component/OrderTracker';
import RatingPage from '../Đánh Giá';
import orderBackground from '@/assets/KhachHang/Đơn hàng/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import './index.less';



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
                    <Typography.Title level={1} className="tieuDeTrang" style={{ margin: 0 }}>Đơn của tôi</Typography.Title>
                    <Typography.Text className="tieuDePhuTrang">Theo dõi trạng thái đơn ăn theo thời gian thực.</Typography.Text>
                </div>

                <Segmented
                    className="boLocPhanDoan"
                    options={filters.map((f: any) => ({ label: f.label, value: f.id }))}
                    value={filter}
                    onChange={(val) => setFilter(val as string)}
                />
            </div>

            {visibleOrders.length === 0 ? (
                <Empty 
                    className="trangThaiTrong"
                    image={<FileTextOutlined className="khungBieuTuong" />}
                    description={
                        <>
                            <h4>Chưa có đơn nào</h4>
                            <span>Đặt món từ thực đơn để bắt đầu</span>
                        </>
                    }
                />
            ) : (
                <div className="luoiDonHang">
                    {visibleOrders.map((o: Order) => {
                        const st = ORDER_STATUSES[o.status];
                        const pay = PAYMENT_METHODS[o.payment];
                        const statusLabel = o.status === OrderStatus.Pending && o.payment === PaymentMethod.QR
                            ? o.paymentStatus === 'paid' ? 'Đã đặt' : 'Chờ thanh toán'
                            : st.label;

                        return (
                            <Card 
                                key={o.id} 
                                className={`theDonHang trangThai-${o.status}`}
                                bordered={false}
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="phanChinhThe">
                                    <div className="phanTraiThe">
                                        <div className="thongTinDon">
                                            <span className="maDon">{o.id}</span>
                                            <Tag className={`nhanTrangThai ${st.color}`}>
                                                <span className={`chamTrangThai ${st.color}`} />
                                                {statusLabel}
                                            </Tag>
                                            <Typography.Text className="thoiGianNhan">
                                                <ClockCircleOutlined />
                                                <span>Nhận lúc</span>
                                                <strong>{o.pickup || 'Đang cập nhật'}</strong>
                                            </Typography.Text>
                                        </div>

                                        <div className="danhSachMonAn">
                                            {o.items.map((it: any) => (
                                                <div key={it.id} className="monAnThuGon">
                                                    {it.image ? (
                                                        <Avatar shape="square" size={36} src={it.image} className="anhMonLichSu" />
                                                    ) : (
                                                        <Avatar shape="square" size={36} className="anhMonMacDinh">{String(it.name || 'M').charAt(0).toUpperCase()}</Avatar>
                                                    )}
                                                    <Typography.Text className="tenMon">{it.name}</Typography.Text>
                                                    <Typography.Text className="soLuong">×{it.qty}</Typography.Text>
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
                                                    <Alert
                                                        className="ghiChuDon"
                                                        message={`Ghi chú: ${o.note}`}
                                                        type="warning"
                                                        showIcon
                                                        icon={<InfoCircleOutlined />}
                                                    />
                                                ) || <div style={{ height: 12 }} />}

                                <div className="hanhDongThe">
                                    <Space size="middle">
                                        {o.status === OrderStatus.Ready && (
                                            <Button
                                                type="primary"
                                                className="nutDaNhanMon"
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
                            </Card>
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
