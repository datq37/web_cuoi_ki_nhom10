import React from 'react';
import { useModel } from 'umi';
import { Button, Space } from 'antd';
import { 
    FileTextOutlined, 
    InfoCircleOutlined, 
    CheckOutlined, 
    ReloadOutlined 
} from '@ant-design/icons';
import { ORDER_STATUSES, PAYMENT_METHODS, OrderStatus, Order } from '@/services/Khách hàng/Đơn Hàng';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import OrderTracker from './component/OrderTracker';
import RatingPage from '../Đánh Giá';
import orderBackground from '@/assets/Khách Hàng/Đơn hàng/Backgroud.png';
import { getPageBackground } from '../themeBackground';
import './index.less';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
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
    } = useModel('Khách Hàng.Đơn Hàng.index');

    return (
        <div
            className="history-page-container"
            style={{ backgroundImage: getPageBackground(orderBackground, theme) }}
        >
            <div className="page-header">
                <div>
                    <h1 className="page-title">Đơn của tôi</h1>
                    <p className="page-subtitle">Theo dõi trạng thái đơn ăn theo thời gian thực.</p>
                </div>

                <div className="seg-radio">
                    {filters.map((f: any) => (
                        <button
                            key={f.id}
                            className={filter === f.id ? 'active' : ''}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {visibleOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="icon-wrapper"><FileTextOutlined /></div>
                    <h4>Chưa có đơn nào</h4>
                    <span>Đặt món từ thực đơn để bắt đầu</span>
                </div>
            ) : (
                <div className="orders-grid">
                    {visibleOrders.map((o: Order) => {
                        const st = ORDER_STATUSES[o.status];
                        const pay = PAYMENT_METHODS[o.payment];

                        return (
                            <div key={o.id} className={`order-card status-${o.status}`}>
                                <div className="card-main">
                                    <div className="card-left">
                                        <div className="order-meta">
                                            <span className="order-id">{o.id}</span>
                                            <span className={`status-chip ${st.color}`}>
                                                <span className={`dot-status ${st.color}`}></span>
                                                {st.label}
                                            </span>
                                            <span className="pickup-time">
                                                · nhận lúc <strong>{o.pickup}</strong>
                                            </span>
                                        </div>

                                        <div className="order-items">
                                            {o.items.map((it: any) => (
                                                <div key={it.id} className="item-preview">
                                                    <span className="emoji">{getDish(it.id)?.emoji || '🍽️'}</span>
                                                    <span className="name">{it.name}</span>
                                                    <span className="qty">×{it.qty}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <OrderTracker status={o.status} />
                                    </div>

                                    <div className="card-side">
                                        <div className="total-label">Tổng thanh toán</div>
                                        <div className="total-value">
                                            {formatVND(o.total)}
                                            <span className="unit">đ</span>
                                        </div>
                                        <div className="payment-method">
                                            {pay.icon} {pay.label}
                                        </div>
                                    </div>
                                </div>

                                {o.note && (
                                    <div className="order-note">
                                        <InfoCircleOutlined />
                                        <span>Ghi chú: {o.note}</span>
                                    </div>
                                ) || <div style={{ height: 12 }}></div>}

                                <div className="card-actions">
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
                                                        className="btn-rate-order"
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
