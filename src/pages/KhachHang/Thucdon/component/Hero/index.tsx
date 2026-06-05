import React from 'react';
import { useModel } from 'umi';
import { Typography } from 'antd';
import { CalendarDays, Clock3, Flame } from 'lucide-react';
import type { MenuHeroProps } from '@/services/KhachHang/ThucDon/Hero/typing';
import menuBanner from '@/assets/KhachHang/ThucDon/thucdon.png';

const MenuHero: React.FC<MenuHeroProps> = ({ orders, totalDishes, bestSeller }) => {
    const { greeting, timeStr, dateStr } = useModel('KhachHang.ThucDon.index');

    return (
        <div className="menu-hero" style={{ backgroundImage: `url("${menuBanner}")` }}>
            <div className="hero-content">
                <Typography.Title level={2} style={{ margin: '0 0 16px', color: 'inherit' }}>{greeting}</Typography.Title>
                <Typography.Paragraph style={{ margin: 0, fontSize: 16 }}>
                    Hôm nay có <Typography.Text strong style={{ color: 'inherit' }}>{totalDishes} món mới</Typography.Text> sẵn sàng phục vụ bạn.
                </Typography.Paragraph>
                <Typography.Paragraph style={{ margin: 0, fontSize: 16, opacity: 0.9 }}>Đừng quên đặt món trước để nhận ưu đãi nhé.</Typography.Paragraph>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <CalendarDays size={26} />
                        <div>
                            <Typography.Text strong style={{ display: 'block', color: 'inherit', fontSize: 18 }}>{orders}</Typography.Text>
                            <Typography.Text style={{ color: 'inherit', opacity: 0.85, fontSize: 12 }}>Đơn đã đặt</Typography.Text>
                        </div>
                    </div>
                    <div className="hero-stat">
                        <Clock3 size={28} />
                        <div>
                            <Typography.Text strong style={{ display: 'block', color: 'inherit', fontSize: 18 }}>{timeStr}</Typography.Text>
                            <Typography.Text style={{ color: 'inherit', opacity: 0.85, fontSize: 12 }}>{dateStr}</Typography.Text>
                        </div>
                    </div>
                    {bestSeller && (
                        <div className="hero-stat hero-stat-best">
                            <Flame size={28} />
                            <div>
                                <Typography.Text strong style={{ display: 'block', color: 'inherit', fontSize: 18 }}>{bestSeller.name}</Typography.Text>
                                <Typography.Text style={{ color: 'inherit', opacity: 0.85, fontSize: 12 }}>{bestSeller.sold} đã bán</Typography.Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuHero;
