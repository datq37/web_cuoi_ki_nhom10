import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import './index.less';

const AppFooter: React.FC = () => {
  return (
    <footer className="modern-footer">
      <div className="modern-footer-container">
        <div className="footer-column brand-column">
          <div className="brand-logo">
            <img src="/logo.webp" alt="Logo Căng tin Hiện đại" className="logo-img" />
          </div>
          <p className="brand-description">
            Trải nghiệm ẩm thực tuyệt vời<br />trong không gian hiện đại.
          </p>
        </div>

        <div className="footer-column links-column">
          <h4 className="footer-heading">Liên kết</h4>
          <ul className="footer-links">
            <li><a href="/chinh-sach-bao-mat">Chính sách bảo mật</a></li>
            <li><a href="/dieu-khoan-dich-vu">Điều khoản dịch vụ</a></li>
            <li><a href="/lien-he">Liên hệ</a></li>

          </ul>
        </div>

        <div className="footer-column contact-column">
          <h4 className="footer-heading">Liên hệ</h4>
          <ul className="footer-contact-info">
            <li>Công ty doanh nghiệp</li>
            <li><a href="mailto:contact@cantinhiendai.com">contact@cantinhiendai.com</a></li>
            <li><a href="tel:+84123456789">+84 123 456 789</a></li>
          </ul>
        </div>

        <div className="footer-column social-column">
          <h4 className="footer-heading">Theo dõi chúng tôi</h4>
          <div className="social-container">
            <a href="https://www.facebook.com/" className="social-btn facebook">
              <FacebookOutlined className="icon" />
              <span className="text">Facebook</span>
            </a>

            <a href="https://www.instagram.com/" className="social-btn instagram">
              <InstagramOutlined className="icon" />
              <span className="text">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
