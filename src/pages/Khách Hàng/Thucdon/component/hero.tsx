import React from 'react';
import { useModel } from 'umi';

// ─── Banner chào mừng — lấy lời chào và giờ hiện tại từ model ───────────────
interface MenuHeroProps {
    orders: number;
    totalDishes: number;
}

const MenuHero: React.FC<MenuHeroProps> = ({ orders, totalDishes }) => {
    const { greeting, timeStr, dateStr } = useModel('Khách Hàng.Thực đơn.index');

    return (
        <div className="menu-hero">
            <div className="hero-content">
                <h2>{greeting}</h2>
                <p>
                    Hôm nay có <strong>{totalDishes} món mới</strong> sẵn sàng phục vụ bạn.
                    Đừng quên đặt món trước để nhận ưu đãi nhé.
                </p>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <strong>{orders}</strong>
                        <span>Đơn đã đặt</span>
                    </div>
                    <div className="hero-stat">
                        <strong>{timeStr}</strong>
                        <span>{dateStr}</span>
                    </div>
                </div>
            </div>
            <div className="hero-decoration">
                {/* Có thể thêm ảnh minh họa tại đây */}
            </div>
        </div>
    );
};

export default MenuHero;
