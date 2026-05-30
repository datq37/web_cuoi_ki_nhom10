import React from 'react';
import { useModel } from 'umi';
import { CalendarDays, Clock3 } from 'lucide-react';
import type { MenuHeroProps } from '@/services/Khách hàng/Thực đơn/Hero/typing';
import menuBanner from '@/assets/Khách Hàng/Thực đơn/thucdon.png';
const MenuHero: React.FC<MenuHeroProps> = ({ orders, totalDishes }) => {
    const { greeting, timeStr, dateStr } = useModel('Khách Hàng.Thực đơn.index');

    return (
        <div className="menu-hero" style={{ backgroundImage: `url("${menuBanner}")` }}>
            <div className="hero-content">
                <h2>{greeting}</h2>
                <p>
                    Hôm nay có <strong>{totalDishes} món mới</strong> sẵn sàng phục vụ bạn.
                </p>
                <p>Đừng quên đặt món trước để nhận ưu đãi nhé.</p>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <CalendarDays size={26} />
                        <div>
                            <strong>{orders}</strong>
                            <span>Đơn đã đặt</span>
                        </div>
                    </div>
                    <div className="hero-stat">
                        <Clock3 size={28} />
                        <div>
                            <strong>{timeStr}</strong>
                            <span>{dateStr}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuHero;
