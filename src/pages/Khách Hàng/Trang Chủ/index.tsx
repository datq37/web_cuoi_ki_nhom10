import React from 'react';
import { useModel } from 'umi';
import DishDetailModal from '@/pages/Khách Hàng/Thucdon/component/DishDetailModal';
import Banner from './Components/Banner';
import MenuAndBestSellers from './Components/Danh mục và Bán chạy';
import OrderSteps from './Components/Quy trình';
import OffersAndCombos from './Components/Ưu đãi';
import './index.less';

const CustomerHome: React.FC = () => {
  const {
    setPage,
    addToCart,
    incCart,
    decCart,
    selectedDish,
    setSelectedDish,
    bestSellingDishes,
    cartQty,
    getDishImage,
  } = useModel('Khách Hàng.Trang Chủ.index');

  return (
    <div className="customer-home-page">
      <Banner setPage={setPage} />

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
          />
          <OrderSteps />
        </div>

        <OffersAndCombos setPage={setPage} />
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
