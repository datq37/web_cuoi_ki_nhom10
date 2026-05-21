import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Space } from 'antd';
import { 
    FileTextOutlined, 
    InfoCircleOutlined, 
    CheckOutlined, 
    ReloadOutlined 
} from '@ant-design/icons';
import { ORDER_STATUSES, PAYMENT_METHODS } from '@/services/Khách hàng/Orders/typing';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import OrderTracker from './component/OrderTracker';
import RatingPage from '../Đánh Giá';
import orderBackground from '@/assets/Khách Hàng/Đơn hàng/Backgroud.png';
import { getPageBackground } from '../themeBackground';
import './index.less';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
const getDish = (id: string) => SEED_MENU.find(d => d.id === id);

const HistoryPage: React.FC = () => {
    const { orders, advanceOrder } = useModel('Khách Hàng.Orders');
    const { setSearchQuery, setActiveCategory } = useModel('Khách Hàng.Thực đơn.index');
    const { setPage, theme } = useModel('Khách Hàng.global');
    const [filter, setFilter] = useState('active');
    const [ratingOrder, setRatingOrder] = useState<any>(null);

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang xử lý' },
        { id: 'done', label: 'Hoàn thành' },
    ];

    const visibleOrders = orders.filter(o => {
        if (filter === 'all') return true;
        if (filter === 'active') return o.status !== 'done' && o.status !== 'cancelled';
        if (filter === 'done') return o.status === 'done';
        return true;
    });

    const handleReorder = (order: any) => {
        const firstName = order?.items?.[0]?.name || '';
        setActiveCategory('all');
        setSearchQuery(firstName);
        setPage('menu');
    };

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
                    {filters.map(f => (
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
                    {visibleOrders.map(o => {
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
                                            {o.items.map(it => (
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
                                        {o.status === 'ready' && (
                                            <Button 
                                                type="primary" 
                                                icon={<CheckOutlined />} 
                                                onClick={() => advanceOrder(o.id)}
                                            >
                                                Đã nhận món
                                            </Button>
                                        )}
                                        
                                        {o.status === 'done' && (
                                            <>
                                                <Button 
                                                    className="btn-rate-order"
                                                    onClick={() => setRatingOrder(o)}
                                                >
                                                    Đánh giá
                                                </Button>
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
