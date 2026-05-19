import React, { useState } from 'react';
import { useModel } from 'umi';
import { EmployeeMenuProps } from '@/services/Khách hàng/Thực đơn/typing';
import MenuHero from './component/hero';
import DayTabs from './component/datetabs';
import CategoryBar from './component/thanhlocdanhsach';
import DishCard from './component/themonan';
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
            </div>
            <MenuHero orders={ordersToday} totalDishes={filteredMenu.length} />
            <DayTabs selected={day} onSelect={setDay} />
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

