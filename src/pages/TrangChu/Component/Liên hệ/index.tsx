import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock3,
  Headphones,
} from 'lucide-react';

import './index.less';

// phần dữ liệu liên hệ
const contactItems = [
  {
    icon: <Phone size={24} />,
    title: 'Đường dây nóng nội bộ',
    value: '+84 123 456 789',
    desc: 'Hỗ trợ khẩn cấp từ 07:00 - 19:30 hằng ngày',
  },
  {
    icon: <Mail size={24} />,
    title: 'Hòm thư điện tử',
    value: 'contact@cantinhiendai.com',
    desc: 'Giải đáp thắc mắc và tiếp nhận phản hồi dịch vụ',
  },
  {
    icon: <MapPin size={24} />,
    title: 'Địa điểm căng tin',
    value: 'Tầng 1, Tòa nhà Alpha Complex',
    desc: 'Khu công nghệ cao, Quận 9, TP. Hồ Chí Minh',
    active: true,
  },
  {
    icon: <Clock3 size={24} />,
    title: 'Giờ mở cửa phục vụ',
    value: 'Thứ 2 - Thứ 7 | 06:30 - 20:00',
    desc: 'Bữa sáng: 06:30 - 09:00 | Bữa trưa: 11:00 - 13:30 | Bữa tối: 17:00 - 19:30',
  },
];

// phần trang liên hệ
export default function ContactPage() {
  // phần lấy giao diện sáng tối
  const { theme } = useModel('KhachHang.GlobalState.index');

  // phần cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // phần giao diện chính
  return (
    <div className={`contact-page-wrapper theme-${theme}`}>
      <header className="cp-header">
        <button className="cp-back-btn" onClick={() => history.push('/')}>
          <ArrowLeft size={18} />
          Quay lại TrangChu
        </button>

        <div className="cp-brand">
          <img
            src="/logo.webp"
            alt="Căng tin"
            className="cp-logo"
          />

          <div className="cp-brand-text">
            <h1 className="cp-brand-name">Căng tin</h1>
            <p className="cp-brand-slogan">DOANH NGHIỆP</p>
          </div>
        </div>
      </header>

      <main className="cp-main">
        <div className="cp-deco-leaf cp-deco-left">❧</div>
        <div className="cp-deco-leaf cp-deco-right">❧</div>

        <section className="cp-hero-card">
          <div className="cp-hero-content">
            <div className="cp-illustration">
              <div className="cp-illustration-bg" />
              <div className="cp-illustration-circle">
                <Headphones
                  size={64}
                  className="icon"
                  strokeWidth={1.6}
                />
              </div>
              <div className="cp-badge-1" />
              <div className="cp-badge-2" />
              <div className="cp-badge-3" />
            </div>

            <div className="cp-hero-text">
              <h1 className="cp-title">
                Liên Hệ Chúng Tôi
              </h1>

              <p className="cp-desc">
                Ban quản lý Căng tin luôn sẵn sàng lắng nghe mọi ý kiến đóng góp,
                phản hồi về chất lượng món ăn cũng như thái độ phục vụ để mang tới
                những bữa ăn chất lượng nhất cho CBNV.
              </p>
            </div>
          </div>
        </section>

        <section className="cp-contact-grid">
          {contactItems.map((item) => (
            <ContactCard key={item.title} item={item} />
          ))}
        </section>
      </main>

      <footer className="cp-footer">
        © 2026 Căng tin Doanh nghiệp. Bảo lưu mọi quyền.
      </footer>
    </div>
  );
}

// phần thẻ liên hệ
function ContactCard({ item }: any) {
  return (
    <div className={`cp-contact-card ${item.active ? 'active' : ''}`}>
      <div className="cp-card-inner">
        <div className="cp-card-icon">
          {item.icon}
        </div>

        <div className="cp-card-content">
          <h3 className="cp-card-title">{item.title}</h3>
          <p className="cp-card-value">{item.value}</p>
          <p className="cp-card-desc">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}
