import React from 'react';
import { history, useModel } from 'umi';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Clock3,
  ShoppingCart,
  Users,
  Utensils,
  Building2,
  Star,
} from 'lucide-react';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import './topbar.less';

const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useModel('Khách Hàng.global');
  const darkMode = theme === 'dark';

  return (
    <div className={`landing-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Navbar */}
      <header className={`landing-topbar ${darkMode ? 'dark' : ''}`}>
        <div className="lt-inner">
          {/* Logo */}
          <div className="lt-logo" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.webp" alt="Căng tin doanh nghiệp" className="lt-logo-img" />
            <div className="lt-brand-text">
              <span className="lt-brand-name">Căng tin</span>
              <span className="lt-brand-slogan">DOANH NGHIỆP</span>
            </div>
          </div>

          {/* Right nav */}
          <div className="lt-nav-right">
            {/* Theme toggle */}
            <button
              className={`lt-theme-toggle ${darkMode ? 'dark' : ''}`}
              onClick={toggleTheme}
              title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {darkMode
                ? <BulbFilled style={{ fontSize: '20px', color: '#fbbf24' }} />
                : <BulbOutlined style={{ fontSize: '20px', color: '#6b7280' }} />
              }
            </button>

            <button
              className={`lt-btn-login ${darkMode ? 'dark' : ''}`}
              onClick={() => history.push('/dang-nhap')}
            >
              Đăng nhập
            </button>

            <button
              className="lt-btn-register"
              onClick={() => history.push('/dang-ky')}
            >
              Đăng kí
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className={`landing-hero ${darkMode ? 'dark' : ''}`}>
        {/* Background blobs */}
        <div className="hero-blob hero-blob-left" />
        <div className="hero-blob hero-blob-center" />

        <div className="hero-grid">
          {/* Left content */}
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

            {/* Mini features */}
            <div className="hero-features">
              <MiniFeature darkMode={darkMode} icon={<Leaf size={22} />} title="Nguyên liệu" desc="tươi ngon" />
              <MiniFeature darkMode={darkMode} icon={<ShieldCheck size={22} />} title="An toàn" desc="vệ sinh" />
              <MiniFeature darkMode={darkMode} icon={<Clock3 size={22} />} title="Phục vụ" desc="nhanh chóng" />
            </div>

            {/* CTA */}
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

            {/* Trust */}
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

          {/* Right image */}
          <div className="hero-right">
            <div className="hero-img-wrap">
              <img
                src={require('@/assets/trangchu/banner.png')}
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

function StatItem({ icon, value, label, darkMode }: { icon: React.ReactNode, value: string, label: string, darkMode: boolean }) {
  return (
    <div className="stat-item">
      <div className={`stat-icon-wrap ${darkMode ? 'dark' : ''}`}>
        {icon}
      </div>
      <div>
        <p className="stat-value">{value}</p>
        <p className={`stat-label ${darkMode ? 'dark' : ''}`}>{label}</p>
      </div>
    </div>
  );
}

export default Topbar;
