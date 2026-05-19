import React, { useEffect } from 'react';
import { history } from 'umi';
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './index.less';

const ContactPage: React.FC = () => {
  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfos = [
    {
      icon: <PhoneOutlined />,
      title: 'Đường dây nóng nội bộ',
      value: '+84 123 456 789',
      sub: 'Hỗ trợ khẩn cấp từ 07:00 - 19:30 hàng ngày',
      link: 'tel:+84123456789'
    },
    {
      icon: <MailOutlined />,
      title: 'Hòm thư điện tử',
      value: 'contact@cantinhiendai.com',
      sub: 'Giải đáp thắc mắc và tiếp nhận phản hồi dịch vụ',
      link: 'mailto:contact@cantinhiendai.com'
    },
    {
      icon: <EnvironmentOutlined />,
      title: 'Địa điểm căng tin',
      value: 'Tầng 1, Tòa nhà Alpha Complex',
      sub: 'Khu công nghệ cao, Quận 9, TP. Hồ Chí Minh',
      link: '#'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Giờ mở cửa phục vụ',
      value: 'Thứ 2 - Thứ 7 | 06:30 - 20:00',
      sub: 'Bữa sáng: 06:30 - 09:00 | Bữa trưa: 11:00 - 13:30 | Bữa tối: 17:00 - 19:30',
      link: '#'
    }
  ];

  return (
    <div className="contact-page-wrapper">
      {/* Top Header */}
      <header className="contact-header">
        <div className="header-container">
          <button className="btn-back" onClick={() => history.push('/')}>
            <ArrowLeftOutlined /> Quay lại Trang Chủ
          </button>
          <div className="header-brand">
            <img src="/logo.webp" alt="Logo" className="logo" />
            <div className="brand-text">
              <span className="name">Căng tin</span>
              <span className="sub">DOANH NGHIỆP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="contact-main">
        <div className="contact-container single-column">
          {/* Direct Contact Details & Info Cards */}
          <div className="contact-info-section">
            <div className="info-intro-card">
              <h1>Liên Hệ Chúng Tôi</h1>
              <p>Ban quản lý Căng tin luôn sẵn sàng lắng nghe mọi ý kiến đóng góp, phản hồi về chất lượng món ăn cũng như thái độ phục vụ để mang tới những bữa ăn chất lượng nhất cho CBNV.</p>
            </div>

            <div className="info-grid">
              {contactInfos.map((info, idx) => (
                <div key={idx} className="info-item-card">
                  <div className="info-icon-wrapper">{info.icon}</div>
                  <div className="info-details">
                    <h3>{info.title}</h3>
                    {info.link !== '#' ? (
                      <a href={info.link} className="info-value-link">{info.value}</a>
                    ) : (
                      <span className="info-value">{info.value}</span>
                    )}
                    <p className="info-sub">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="contact-footer-simple">
        <p>© 2026 Căng tin Doanh nghiệp. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
