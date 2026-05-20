import React, { useState } from 'react';
import { useModel } from 'umi';
import { CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react';
import { EmployeeMenuProps } from '@/services/Khách hàng/Thực đơn/typing';
import MenuHero from './component/Hero';
import DayTabs from './component/DateTabs';
import CategoryBar from './component/CategoryBar';
import DishCard from './component/DishCard';
import DishDetailModal from './component/DishDetailModal';
import './index.less';

const EmployeeMenu: React.FC<EmployeeMenuProps> = ({ onOpenCart, ordersToday }) => {
    const {
        cart,
        addToCart,
        incCart,
        decCart,
        filteredMenu,
        todayTabIndex,
    } = useModel('Khách Hàng.Thực đơn.index');
    const [day, setDay] = useState(todayTabIndex);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    const isFutureDay = day > todayTabIndex;

    const cartQty = (id: string) => {
        const item = cart.find((c: any) => c.id === id);
        return item ? item.qty : 0;
    };

    return (
        <div className="employee-menu-container">

            <div className="page-header">
                <div>
                    <h1 className="page-title">Thực đơn hôm nay</h1>
                    <p className="page-subtitle">Chọn món, đặt trước - không cần xếp hàng.</p>
                </div>
                <div className="preorder-card">
                    <div className="preorder-icon">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <strong>Đặt trước dễ dàng</strong>
                        <span>Tiết kiệm thời gian chờ đợi</span>
                    </div>
                    <ChevronRight size={18} />
                </div>
            </div>
            <MenuHero orders={ordersToday} totalDishes={filteredMenu.length} />
            <div className="schedule-row">
                <DayTabs selected={day} onSelect={setDay} />
                <button className="week-button">
                    <CalendarDays size={16} />
                    Lịch tuần
                </button>
            </div>
            <CategoryBar />
            <div className="menu-grid">
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
