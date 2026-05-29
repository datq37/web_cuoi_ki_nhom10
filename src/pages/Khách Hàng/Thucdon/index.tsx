import React, { useState } from 'react';
import { useModel } from 'umi';
import { CheckCircle2 } from 'lucide-react';
import MenuHero from './component/Hero';
import DayTabs from './component/DateTabs';
import CategoryBar from './component/CategoryBar';
import DishCard from './component/DishCard';
import DishDetailModal from './component/DishDetailModal';
import menuBackground from '@/assets/Khách Hàng/Thực đơn/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import './index.less';

import { EmployeeMenuProps } from '@/services/Khách hàng/Thực đơn';

const EmployeeMenu: React.FC<EmployeeMenuProps> = ({ onOpenCart, ordersToday }) => {
    const {
        cart,
        addToCart,
        incCart,
        decCart,
        filteredMenu,
        todayTabIndex,
    } = useModel('Khách Hàng.Thực đơn.index');
    const { theme } = useModel('Khách Hàng.global');
    const [day, setDay] = useState(todayTabIndex);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    const isFutureDay = day > todayTabIndex;

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
                    <h1 className="tieuDeTrang">Thực đơn hôm nay</h1>
                    <p className="tieuDePhuTrang">Chọn món, đặt trước - không cần xếp hàng.</p>
                </div>
                <div className="theDatTruoc">
                    <div className="bieuTuongDatTruoc">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <strong>Đặt trước dễ dàng</strong>
                        <span>Tiết kiệm thời gian chờ đợi</span>
                    </div>
                </div>
            </div>
            <MenuHero orders={ordersToday} totalDishes={filteredMenu.length} />
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

            {/* Modal chi tiết món ăn */}
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
