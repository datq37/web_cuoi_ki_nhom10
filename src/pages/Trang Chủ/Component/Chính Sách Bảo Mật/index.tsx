import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  User,
  Lock,
  ShieldCheck,
  FileText,
  CalendarDays,
  Building2,
  Mail,
  Truck,
  History,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

import './index.less';

const menuItems = [
  {
    id: 'section-1',
    icon: <Eye size={18} />,
    title: 'Thu Thập Thông Tin Cá Nhân',
  },
  {
    id: 'section-2',
    icon: <User size={18} />,
    title: 'Mục Đích Sử Dụng Thông Tin',
  },
  {
    id: 'section-3',
    icon: <Lock size={18} />,
    title: 'Cam Kết Bảo Mật Thông Tin',
  },
];

export default function PrivacyPage() {
  const { theme } = useModel('Khách Hàng.GlobalState.index');
  const [activeSection, setActiveSection] = React.useState(menuItems[0].id);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`privacy-page-wrapper theme-${theme}`}>
      {/* Header */}
      <header className="pp-header">
        <button className="pp-back-btn" onClick={() => history.push('/')}>
          <ArrowLeft size={18} />
          Quay lại Trang Chủ
        </button>

        <div className="pp-brand">
          <img
            src="/logo.webp"
            alt="Căng tin"
            className="pp-logo"
          />

          <div className="pp-brand-text">
            <h1 className="pp-brand-name">Căng tin</h1>
            <p className="pp-brand-slogan">DOANH NGHIỆP</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pp-main">
        {/* Sidebar */}
        <aside className="pp-sidebar">
          <div 
            className="pp-sidebar-header"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="pp-sidebar-title-group">
              <div className="pp-sidebar-icon">
                <BookOpen size={20} />
              </div>
              <h2 className="pp-sidebar-title">MỤC LỤC</h2>
            </div>
            
            <div className={`pp-sidebar-toggle ${isMenuOpen ? 'open' : ''}`}>
              <ChevronDown size={20} />
            </div>
          </div>

          <div className={`pp-sidebar-collapsible ${isMenuOpen ? 'open' : ''}`}>
            <div className="pp-sidebar-divider" />

            <nav className="pp-nav-menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false); // Đóng menu khi click trên mobile
                  }}
                  className={`pp-nav-item ${activeSection === item.id ? 'active' : ''}`}
                >
                  <span className="pp-nav-icon">
                    {item.icon}
                  </span>
                  <span className="pp-nav-text">
                    {item.title}
                  </span>
                </button>
              ))}
            </nav>

            <div className="pp-sidebar-banner">
              <div className="pp-banner-deco">❧</div>

              <div className="pp-banner-content">
                <div className="pp-banner-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="pp-banner-text">
                  <h3>Dữ liệu an toàn</h3>
                  <p>Cam kết bảo mật dữ liệu theo tiêu chuẩn ISO 27001.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="pp-content-area">
          {/* Title */}
          <div className="pp-content-header">
            <h1 className="pp-main-title">Chính Sách Bảo Mật</h1>
            <div className="pp-last-updated">
              <CalendarDays size={16} className="icon" />
              <span>Cập nhật lần cuối: Ngày 18 tháng 05 năm 2026</span>
            </div>
          </div>

          {/* Intro box */}
          <div className="pp-intro-box">
            <div className="pp-intro-icon-wrapper">
              <div className="pp-intro-icon-bg" />
              <ShieldCheck size={64} className="icon" />
            </div>

            <p className="pp-intro-text">
              Chào mừng cán bộ nhân viên đến với hệ thống đặt món trực tuyến
              của <b>Căng tin Doanh nghiệp</b>. Chúng tôi hiểu rằng quyền riêng
              tư và sự an toàn dữ liệu của bạn là vô cùng quan trọng. Chính sách
              bảo mật này mô tả cách thức chúng tôi thu thập, sử dụng, bảo vệ và
              tôn trọng quyền lợi của bạn đối với thông tin cá nhân.
            </p>
          </div>

          <Divider />

          {/* Section 1 */}
          <PolicySection id="section-1" number="1" title="Thu Thập Thông Tin Cá Nhân">
            <p>
              Hệ thống Căng tin Doanh nghiệp của chúng tôi tiến hành thu thập
              các thông tin sau khi bạn đăng ký và sử dụng dịch vụ đặt món trực
              tuyến:
            </p>

            <InfoLine
              icon={<User size={18} />}
              title="Thông tin cơ bản:"
              text="Họ tên, địa chỉ email và số điện thoại liên lạc để xác thực tài khoản và gửi hóa đơn."
            />

            <InfoLine
              icon={<Truck size={18} />}
              title="Thông tin giao hàng nội bộ:"
              text="Phòng ban, Tòa nhà, Tầng làm việc nhằm phục vụ đội ngũ giao hàng nội bộ tìm kiếm và vận chuyển chính xác món ăn đến nơi làm việc của bạn."
            />

            <InfoLine
              icon={<TicketPercent size={18} />}
              title="Thông tin giao dịch:"
              text="Lịch sử đặt món, lịch sử áp dụng mã giảm giá và lịch sử đánh giá chất lượng món ăn của bạn."
            />
          </PolicySection>

          <Divider />

          {/* Section 2 */}
          <PolicySection id="section-2" number="2" title="Mục Đích Sử Dụng Thông Tin">
            <p>
              Chúng tôi cam kết sử dụng thông tin cá nhân của bạn vào các mục
              đích minh bạch và thiết thực sau:
            </p>

            <CheckItem text="Xử lý và chế biến chính xác đơn hàng theo thời gian nhận món đã hẹn." />
            <CheckItem text="Hỗ trợ giao hàng nội bộ đến đúng vị trí làm việc của nhân viên." />
            <CheckItem text="Gửi thông báo trạng thái đơn hàng, voucher và ưu đãi phù hợp." />
            <CheckItem text="Cải thiện chất lượng món ăn, dịch vụ và trải nghiệm người dùng." />
          </PolicySection>

          <Divider />

          {/* Section 3 */}
          <PolicySection id="section-3" number="3" title="Cam Kết Bảo Mật Thông Tin">
            <p>
              Thông tin của bạn được lưu trữ và bảo vệ bằng các biện pháp kỹ
              thuật phù hợp. Chúng tôi không bán, trao đổi hoặc chia sẻ dữ liệu
              cá nhân của bạn cho bên thứ ba khi chưa có sự đồng ý, trừ trường
              hợp pháp luật yêu cầu.
            </p>

            <div className="pp-security-grid">
              <SecurityCard
                icon={<Lock size={24} />}
                title="Mã hóa dữ liệu"
                desc="Bảo vệ thông tin trong quá trình truyền tải."
              />
              <SecurityCard
                icon={<ShieldCheck size={24} />}
                title="Kiểm soát truy cập"
                desc="Chỉ nhân sự được phân quyền mới có thể xử lý dữ liệu."
              />
              <SecurityCard
                icon={<History size={24} />}
                title="Theo dõi lịch sử"
                desc="Ghi nhận hoạt động để đảm bảo minh bạch."
              />
            </div>
          </PolicySection>
        </section>
      </main>
    </div>
  );
}

function Divider() {
  return <div className="pp-divider" />;
}

function PolicySection({ id, number, title, children }: any) {
  return (
    <section id={id} className="pp-section">
      <div className="pp-section-header">
        <div className="pp-section-number">{number}</div>
        <h2 className="pp-section-title">{title}</h2>
      </div>

      <div className="pp-section-body">
        {children}
      </div>
    </section>
  );
}

function InfoLine({ icon, title, text }: any) {
  return (
    <div className="pp-info-line">
      <div className="pp-info-icon">{icon}</div>
      <p>
        <b>{title}</b> {text}
      </p>
    </div>
  );
}

function CheckItem({ text }: any) {
  return (
    <div className="pp-check-item">
      <CheckCircle2 size={18} className="icon" fill="#e8f5ec" />
      <p>{text}</p>
    </div>
  );
}

function SecurityCard({ icon, title, desc }: any) {
  return (
    <div className="pp-security-card">
      <div className="pp-security-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
