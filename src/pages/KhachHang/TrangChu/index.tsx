import React from 'react';
import { useModel } from 'umi';
import DishDetailModal from '@/pages/KhachHang/Thucdon/component/DishDetailModal';
import Banner from './Components/Banner';
import MenuAndBestSellers from './Components/Danh mục và Bán chạy';
import OrderSteps from './Components/Quy trình';
import homeBackground from '@/assets/KhachHang/Trang chủ/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import './index.less';

const CustomerHome: React.FC = () => {
  const { theme } = useModel('KhachHang.GlobalState.index');
  const {
    setPage,
    addToCart,
    incCart,
    decCart,
    selectedDish,
    setSelectedDish,
    bestSellingDishes,
    todayDishCount,
    activeOfferCount,
    placedOrderCount,
    cartQty,
    getDishImage,
    categories,
  } = useModel('KhachHang.TrangChu.index');

  return (
    <div
      className="customer-home-page"
      style={{ backgroundImage: getPageBackground(homeBackground, theme) }}
    >
      <Banner
        setPage={setPage}
        todayDishCount={todayDishCount}
        activeOfferCount={activeOfferCount}
        placedOrderCount={placedOrderCount}
      />

      <div className="home-main-grid">
        <div className="home-main-left">
          <MenuAndBestSellers
            setPage={setPage}
            bestSellingDishes={bestSellingDishes}
            cartQty={cartQty}
            addToCart={addToCart}
            incCart={incCart}
            decCart={decCart}
            setSelectedDish={setSelectedDish}
            getDishImage={getDishImage}
            categories={categories}
          />
          <OrderSteps />
        </div>

              </div>

      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          qty={cartQty(selectedDish.id)}
          onClose={() => setSelectedDish(null)}
          onAdd={() => addToCart(selectedDish)}
          onInc={() => incCart(selectedDish.id)}
          onDec={() => decCart(selectedDish.id)}
        />
      )}
    </div>
  );
};

export default CustomerHome;
