import React, { useState } from 'react';
import { history, useModel } from 'umi';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Clock3,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import './topbar.less';
import bannerImage from '@/assets/trangchu/banner.png';

// phần đầu trang
const Topbar: React.FC = () => {
  // phần trạng thái giao diện
  const { theme, toggleTheme } = useModel('Khách Hàng.GlobalState.index');
  const darkMode = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // phần chuyển tới đăng nhập
  const goToLogin = () => {
    setMobileMenuOpen(false);
    history.push('/dang-nhap');
  };

  // phần chuyển tới đăng ký
  const goToRegister = () => {
    setMobileMenuOpen(false);
    history.push('/dang-ky');
  };

  // phần đổi giao diện sáng tối
  const handleToggleTheme = () => {
    toggleTheme();
    setMobileMenuOpen(false);
  };

  // phần giao diện chính
  return (
    <div className={`landing-page ${darkMode ? 'dark' : 'light'}`}>
      <header className={`landing-topbar ${darkMode ? 'dark' : ''}`}>
        <div className="lt-inner">
          <div className="lt-logo" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.webp" alt="Căng tin doanh nghiệp" className="lt-logo-img" />
            <div className="lt-brand-text">
              <span className="lt-brand-name">Căng tin</span>
              <span className="lt-brand-slogan">DOANH NGHIỆP</span>
            </div>
          </div>
          <div className="lt-nav-right">
            <button
              className={`lt-theme-toggle ${darkMode ? 'dark' : ''}`}
              onClick={toggleTheme}
              title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {darkMode
                ? <BulbFilled style={{ fontSize: '10px', color: '#fbbf24' }} />
                : <BulbOutlined style={{ fontSize: '10px', color: '#6b7280' }} />
              }
            </button>

            <button
              className={`lt-btn-login ${darkMode ? 'dark' : ''}`}
              onClick={goToLogin}
            >
              Đăng nhập
            </button>

            <button
              className="lt-btn-register"
              onClick={goToRegister}
            >
              Đăng kí
            </button>
          </div>

          <button
            className={`lt-menu-toggle ${darkMode ? 'dark' : ''}`}
            onClick={() => setMobileMenuOpen(open => !open)}
            aria-label="Mở menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {mobileMenuOpen && (
            <div className={`lt-mobile-menu ${darkMode ? 'dark' : ''}`}>
              <button
                className={`lt-mobile-theme ${darkMode ? 'dark' : ''}`}
                onClick={handleToggleTheme}
              >
                <span className="lt-mobile-theme-icon">
                  {darkMode
                    ? <BulbFilled style={{ fontSize: '10px', color: '#fbbf24' }} />
                    : <BulbOutlined style={{ fontSize: '10px', color: '#6b7280' }} />
                  }
                </span>
                {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              </button>

              <button
                className={`lt-mobile-login ${darkMode ? 'dark' : ''}`}
                onClick={goToLogin}
              >
                Đăng nhập
              </button>

              <button
                className="lt-mobile-register"
                onClick={goToRegister}
              >
                Đăng kí
              </button>
            </div>
          )}
        </div>
      </header>
      <main
        className={`landing-hero ${darkMode ? 'dark' : ''}`}
        style={{ '--hero-mobile-image': `url(${bannerImage})` } as React.CSSProperties}
      >
        <div className="hero-blob hero-blob-left" />
        <div className="hero-blob hero-blob-center" />

        <div className="hero-grid">
          <div className="hero-left">
            <div className={`hero-tag ${darkMode ? 'dark' : ''}`}>
              <Leaf size={18} />
              <span>Ngon hơn mỗi ngày</span>
            </div>

            <h2 className={`hero-title ${darkMode ? 'dark' : ''}`}>
              Căng tin <br />
              doanh nghiệp
            </h2>

            <p className={`hero-desc ${darkMode ? 'dark' : ''}`}>
              Trải nghiệm ẩm thực tinh tế, kết hợp hoàn hảo giữa hương vị
              truyền thống và phong cách hiện đại trong không gian sang trọng.
            </p>
            <div className="hero-features">
              <MiniFeature darkMode={darkMode} icon={<Leaf size={22} />} title="Nguyên liệu" desc="tươi ngon" />
              <MiniFeature darkMode={darkMode} icon={<ShieldCheck size={22} />} title="An toàn" desc="vệ sinh" />
              <MiniFeature darkMode={darkMode} icon={<Clock3 size={22} />} title="Phục vụ" desc="nhanh chóng" />
            </div>
            <div className="hero-cta">
              <button
                className="hero-cta-btn"
                onClick={() => history.push('/dang-nhap')}
              >
                <ShoppingCart size={20} />
                <span>Đặt món ngay</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="hero-trust">
              <div className="hero-avatars">
                <span className="hero-avatar" style={{ background: '#fed7aa' }} />
                <span className="hero-avatar" style={{ background: '#fce7f3' }} />
                <span className="hero-avatar" style={{ background: '#dbeafe' }} />
                <span className="hero-avatar" style={{ background: '#dcfce7' }} />
              </div>
              <div>
                <p className="hero-trust-title">500+ lượt đặt mỗi ngày</p>
                <p className={`hero-trust-desc ${darkMode ? 'dark' : ''}`}>Khách hàng tin tưởng và yêu thích</p>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-wrap">
              <img
                src={bannerImage}
                alt="Ẩm thực căng tin"
                className="hero-img"
                draggable={false}
              />
              <div className="hero-img-overlay" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// phần tính năng nhỏ
function MiniFeature({ icon, title, desc, darkMode }: { icon: React.ReactNode, title: string, desc: string, darkMode: boolean }) {
  return (
    <div className="mini-feature">
      <div className={`mini-feature-icon ${darkMode ? 'dark' : ''}`}>
        {icon}
      </div>
      <div>
        <p className={`mini-feature-title ${darkMode ? 'dark' : ''}`}>{title}</p>
        <p className={`mini-feature-desc ${darkMode ? 'dark' : ''}`}>{desc}</p>
      </div>
    </div>
  );
}

export default Topbar;
