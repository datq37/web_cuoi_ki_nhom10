import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import Sidebar from '../Component/Sidebar/Sidebar';
import Topbar from '../Component/topbar';
import CustomerHome from '../TrangChu';
import EmployeeMenu from '../Thucdon';
import HistoryPage from '../Đơn Hàng';
import GioHang from '../Giỏ Hàng';
import TaiKhoan from '../Tài khoản';
import QRPaymentPage from '../Thanh Toán QR';
import CustomerChatBox from '../ChatBox';
import GlobalNotificationModal from '../Component/GlobalNotificationModal';
import { hasLoginToken } from '@/utils/auth';
import './index.less';

const MainPage: React.FC = () => {
  const { page, theme, isSidebarOpen } = useModel('KhachHang.GlobalState.index');
  const { cartOpen, setCartOpen } = useModel('KhachHang.ThucDon.index');
  const { isNotificationOpen } = useModel('KhachHang.Thông Báo.index');
  const [isAuthed, setIsAuthed] = useState(() => hasLoginToken());

  useEffect(() => {
    const checkAuth = () => {
      const ok = hasLoginToken();
      setIsAuthed(ok);
      if (!ok) history.replace('/');
    };

    checkAuth();
    window.addEventListener('focus', checkAuth);
    window.addEventListener('pageshow', checkAuth);
    return () => {
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('pageshow', checkAuth);
    };
  }, []);

  const isLockScroll = isNotificationOpen || cartOpen || isSidebarOpen;

  if (!isAuthed) return null;

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
