import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  ClipboardCheck,
  Building2,
  User,
  FileText,
  Truck,
  ChevronDown,
} from 'lucide-react';

// phần dùng chung giao diện chính sách
import '../Chính Sách Bảo Mật/index.less';

// phần mục lục
const menuItems = [
  {
    id: 'section-1',
    icon: <BookOpen size={18} />,
    title: 'Chấp Thuận Các Điều Khoản',
  },
  {
    id: 'section-2',
    icon: <Lock size={18} />,
    title: 'Quản Lý Tài Khoản Và An Ninh',
  },
  {
    id: 'section-3',
    icon: <ShoppingBag size={18} />,
    title: 'Quy Tắc Đặt Món Và Hủy Đơn',
  },
  {
    id: 'section-4',
    icon: <CreditCard size={18} />,
    title: 'Thanh Toán Và Giao Nhận',
  },
];

// phần trang điều khoản dịch vụ
export default function TermsPage() {
  // phần trạng thái giao diện
  const { theme } = useModel('Khách Hàng.GlobalState.index');
  const [activeSection, setActiveSection] = React.useState(menuItems[0].id);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // phần cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // phần cuộn tới mục nội dung
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // phần giao diện chính
  return (
    <div className={`privacy-page-wrapper theme-${theme}`}>
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

      <main className="pp-main">
        <aside className="pp-sidebar">
          <div 
            className="pp-sidebar-header"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="pp-sidebar-title-group">
              <div className="pp-sidebar-icon">
                <BookOpen size={20} />
              </div>

              <h2 className="pp-sidebar-title">
                Điều Khoản
              </h2>
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
                    // phần đóng menu trên điện thoại
                    setIsMenuOpen(false);
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
                  <h3>Sử dụng nội bộ</h3>
                  <p>Áp dụng riêng cho Cán bộ, Nhân viên của doanh nghiệp.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <section className="pp-content-area">
          <div className="pp-content-header">
            <h1 className="pp-main-title">
              Điều Khoản Dịch Vụ
            </h1>

            <div className="pp-last-updated">
              <CalendarDays size={16} className="icon" />
              <span>Cập nhật lần cuối: Ngày 18 tháng 05 năm 2026</span>
            </div>
          </div>
          <div className="pp-intro-box">
            <div className="pp-intro-icon-wrapper">
              <div className="pp-intro-icon-bg" />
              <ClipboardCheck size={64} className="icon" />
            </div>

            <p className="pp-intro-text">
              Chào mừng bạn đến với hệ thống đặt trước và điều phối ẩm thực nội bộ
              của doanh nghiệp. Khi tham gia sử dụng các dịch vụ đặt món, thanh toán
              và giao nhận tại căng tin của chúng tôi, bạn được mặc định là đã hiểu rõ
              và đồng ý tuân thủ đầy đủ các điều khoản dịch vụ dưới đây.
            </p>
          </div>

          <Divider />

          <TermsSection
            id="section-1"
            number="1"
            icon={<BookOpen size={20} />}
            title="Chấp Thuận Các Điều Khoản"
          >
            <p>
              Bằng việc đăng ký tài khoản và sử dụng hệ thống đặt món trực tuyến
              của Căng tin Doanh nghiệp, bạn đồng ý vô điều kiện tuân thủ tất cả
              các điều khoản, quy định được nêu chi tiết tại văn bản này.
            </p>

            <p>
              Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng
              dịch vụ và liên hệ trực tiếp với bộ phận Quản lý nhân sự hoặc Ban quản lý
              căng tin để được hỗ trợ giải quyết.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection
            id="section-2"
            number="2"
            icon={<Lock size={20} />}
            title="Quản Lý Tài Khoản Và An Ninh"
          >
            <p>
              Dịch vụ này được cung cấp độc quyền cho Cán bộ Nhân viên chính thức
              của công ty. Mỗi người dùng có trách nhiệm bảo mật tài khoản cá nhân
              và chịu trách nhiệm đối với mọi giao dịch đặt món phát sinh từ tài khoản đó.
            </p>

            <div className="pp-security-grid">
              <InfoCard
                icon={<User size={24} />}
                title="Tính chính chủ"
                desc="Không chia sẻ tài khoản cho người khác sử dụng khi chưa được phép."
              />

              <InfoCard
                icon={<Building2 size={24} />}
                title="Chính xác thông tin"
                desc="Cập nhật đúng phòng ban, tòa nhà, tầng và vị trí nhận món."
              />

              <InfoCard
                icon={<ShieldCheck size={24} />}
                title="Phạm vi sử dụng"
                desc="Tài khoản chỉ dùng cho hoạt động đặt món và giao nhận nội bộ."
              />
            </div>
          </TermsSection>

          <Divider />

          <TermsSection
            id="section-3"
            number="3"
            icon={<ShoppingBag size={20} />}
            title="Quy Tắc Đặt Món Và Hủy Đơn"
          >
            <CheckItem text="Người dùng cần kiểm tra kỹ món ăn, số lượng, ghi chú và thời gian nhận món trước khi xác nhận đơn hàng." />
            <CheckItem text="Đơn hàng đã được bếp xác nhận có thể không được hủy tùy theo trạng thái chế biến thực tế." />
            <CheckItem text="Ghi chú món ăn cần rõ ràng, lịch sự và phù hợp với khả năng phục vụ của căng tin." />
            <CheckItem text="Thực đơn có thể thay đổi theo ngày tùy theo tình trạng nguyên liệu và lịch phục vụ." />
          </TermsSection>

          <Divider />

          <TermsSection
            id="section-4"
            number="4"
            icon={<CreditCard size={20} />}
            title="Thanh Toán Và Giao Nhận"
          >
            <p>
              Hệ thống hỗ trợ nhiều hình thức thanh toán như tiền mặt, QR/Bank
              hoặc các phương thức nội bộ khác nếu được doanh nghiệp kích hoạt.
            </p>

            <div className="pp-security-grid">
              <InfoCard
                icon={<CreditCard size={24} />}
                title="Thanh toán linh hoạt"
                desc="Hỗ trợ thanh toán bằng tiền mặt, QR hoặc ngân hàng."
              />

              <InfoCard
                icon={<Truck size={24} />}
                title="Giao nhận nội bộ"
                desc="Giao món đến đúng tòa nhà, tầng và vị trí đã đăng ký."
              />

              <InfoCard
                icon={<FileText size={24} />}
                title="Xác nhận đơn"
                desc="Trạng thái đơn hàng được cập nhật rõ ràng theo thời gian thực."
              />
            </div>
          </TermsSection>
        </section>
      </main>
    </div>
  );
}

// phần đường phân cách
function Divider() {
  return <div className="pp-divider" />;
}

// phần nội dung điều khoản
function TermsSection({ id, number, icon, title, children }: any) {
  return (
    <section id={id} className="pp-section">
      <div className="pp-section-header">
        <div className="pp-info-icon" style={{ margin: 0 }}>
          {icon}
        </div>

        <div className="pp-section-number">{number}</div>
        <h2 className="pp-section-title">{title}</h2>
      </div>

      <div className="pp-section-body">
        {children}
      </div>
    </section>
  );
}

// phần thẻ thông tin
function InfoCard({ icon, title, desc }: any) {
  return (
    <div className="pp-security-card">
      <div className="pp-security-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// phần mục kiểm tra
function CheckItem({ text }: any) {
  return (
    <div className="pp-check-item">
      <CheckCircle2 size={18} className="icon" fill="#e8f5ec" />
      <p>{text}</p>
    </div>
  );
}
