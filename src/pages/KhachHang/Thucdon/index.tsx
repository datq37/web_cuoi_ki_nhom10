import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Typography } from 'antd';
import { CheckCircle2 } from 'lucide-react';
import MenuHero from './component/Hero';
import DayTabs from './component/DateTabs';
import CategoryBar from './component/CategoryBar';
import DishCard from './component/DishCard';
import DishDetailModal from './component/DishDetailModal';
import menuBackground from '@/assets/KhachHang/ThucDon/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import './index.less';

import type { EmployeeMenuProps } from '@/services/KhachHang/ThucDon';

const EmployeeMenu: React.FC<EmployeeMenuProps> = ({ onOpenCart, ordersToday }) => {
    const {
        cart,
        addToCart,
        incCart,
        decCart,
        filteredMenu,
        bestSeller,
        todayTabIndex,
        days,
    } = useModel('KhachHang.ThucDon.index');
    const { theme } = useModel('KhachHang.GlobalState.index');
    const [day, setDay] = useState(todayTabIndex);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    useEffect(() => {
        const selectedDay = days[day];
        if (day >= days.length || selectedDay?.isPast) {
            setDay(Math.max(0, Math.min(todayTabIndex, days.length - 1)));
        }
    }, [day, days, todayTabIndex]);

    const isFutureDay = Boolean(days[day]?.isFuture);

    const cartQty = (id: string) => {
        const item = cart.find((c: any) => c.id === id);
        return item ? item.qty : 0;
    };

    return (
        <div
            className="khungThucDonNhanVien"
            style={{ backgroundImage: getPageBackground(menuBackground, theme) }}
        >

            <div className="phanDauTrang">
                <div>
                    <Typography.Title level={1} className="tieuDeTrang" style={{ margin: 0, color: 'inherit' }}>Thực Đơn hôm nay</Typography.Title>
                    <Typography.Paragraph className="tieuDePhuTrang" style={{ margin: 0 }}>Chọn món, đặt trước - không cần xếp hàng.</Typography.Paragraph>
                </div>
                <div className="theDatTruoc">
                    <div className="bieuTuongDatTruoc">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <Typography.Text strong style={{ display: 'block' }}>Đặt trước dễ dàng</Typography.Text>
                        <Typography.Text style={{ fontSize: 13, color: '#4e5968' }}>Tiết kiệm thời gian chờ đợi</Typography.Text>
                    </div>
                </div>
            </div>
            <MenuHero orders={ordersToday} totalDishes={filteredMenu.length} bestSeller={bestSeller} />
            <div className="hangLichTrinh">
                <DayTabs selected={day} onSelect={setDay} />
            </div>
            <CategoryBar />
            <div className="luoiThucDon">
                {filteredMenu.map((d: any) => (
                    <DishCard
                        key={d.id}
                        dish={d}
                        qty={cartQty(d.id)}
                        onAdd={() => addToCart(d)}
                        onInc={() => incCart(d.id)}
                        onDec={() => decCart(d.id)}
                        onClick={() => setSelectedDish(d)}
                        isFuture={isFutureDay}
                    />
                ))}
            </div>
            {selectedDish && (
                <DishDetailModal
                    dish={selectedDish}
                    qty={cartQty(selectedDish.id)}
                    onClose={() => setSelectedDish(null)}
                    onAdd={() => { addToCart(selectedDish); }}
                    onInc={() => incCart(selectedDish.id)}
                    onDec={() => decCart(selectedDish.id)}
                    isFuture={isFutureDay}
                />
            )}
        </div>
    );
};

export default EmployeeMenu;
