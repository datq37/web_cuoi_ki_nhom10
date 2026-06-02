import React from 'react';
import { useModel } from 'umi';
import Sidebar from '../Component/Sidebar/Sidebar';
import Topbar from '../Component/topbar';
import CustomerHome from '../Trang Chủ';
import EmployeeMenu from '../Thucdon';
import HistoryPage from '../Đơn Hàng';
import GioHang from '../Giỏ Hàng';
import TaiKhoan from '../Tài khoản';
import QRPaymentPage from '../Thanh Toán QR';
import CustomerChatBox from '../ChatBox';
import GlobalNotificationModal from '../Component/GlobalNotificationModal';
import './index.less';

const MainPage: React.FC = () => {
  const { page, theme, isSidebarOpen } = useModel('Khách Hàng.GlobalState.index');
  const { cartOpen, setCartOpen } = useModel('Khách Hàng.Thực đơn.index');
  const { isNotificationOpen } = useModel('Khách Hàng.Thông Báo.index');

  const isLockScroll = isNotificationOpen || cartOpen || isSidebarOpen;

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <CustomerHome />;
      case 'menu':
        return <EmployeeMenu onOpenCart={() => setCartOpen(true)} ordersToday={12} />;
      case 'history':
        return <HistoryPage />;
      case 'qr-payment':
        return <QRPaymentPage />;
      case 'settings':
        return <TaiKhoan />;
      default:
        return null;
    }
  };

  return (
    <div className={`main-page-container theme-${theme}`}>
      <Sidebar />
      <main className={`content-area ${isLockScroll ? 'scroll-locked' : ''}`}>
        <Topbar />
        <section className="content-body">
          {renderContent()}
        </section>
      </main>
      <GioHang />
      <CustomerChatBox />
      <GlobalNotificationModal />
    </div>
  );
};

export default MainPage;
