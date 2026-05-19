import React, { useEffect } from 'react';
import { history } from 'umi';
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  LockOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './index.less';

const PrivacyPolicy: React.FC = () => {
  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'collection',
      icon: <EyeOutlined />,
      title: '1. Thu Thập Thông Tin Cá Nhân',
      content: (
        <>
          <p>Hệ thống Căng tin Doanh nghiệp của chúng tôi tiến hành thu thập các thông tin sau khi bạn đăng ký và sử dụng dịch vụ đặt món trực tuyến:</p>
          <ul>
            <li><strong>Thông tin cơ bản:</strong> Họ tên, địa chỉ email và số điện thoại liên lạc để xác thực tài khoản và gửi hóa đơn.</li>
            <li><strong>Thông tin giao hàng nội bộ:</strong> Phòng ban, Tòa nhà, Tầng làm việc nhằm phục vụ đội ngũ giao hàng nội bộ tìm kiếm và vận chuyển chính xác món ăn đến nơi làm việc của bạn.</li>
            <li><strong>Thông tin giao dịch:</strong> Lịch sử đặt món, lịch sử áp dụng mã giảm giá (voucher) và lịch sử đánh giá chất lượng món ăn của bạn.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'usage',
      icon: <UserSwitchOutlined />,
      title: '2. Mục Đích Sử Dụng Thông Tin',
      content: (
        <>
          <p>Chúng tôi cam kết sử dụng thông tin cá nhân của bạn vào các mục đích minh bạch và thiết thực sau:</p>
          <ul>
            <li>Xử lý và chế biến chính xác đơn hàng theo thời gian nhận món đã hẹn.</li>
            <li>Định vị vị trí làm việc của bạn (Phòng ban/Tòa nhà/Tầng) để giao hàng tận nơi nhanh chóng trong khuôn viên doanh nghiệp.</li>
            <li>Gửi thông báo đẩy (Notification) theo thời gian thực về trạng thái đơn hàng (Bếp đã nhận, Đang chế biến, Đơn hàng đang được giao tới bạn).</li>
            <li>Đo lường, tối ưu hiệu suất phục vụ và đề xuất các món ăn nổi bật phù hợp với khẩu vị của bạn.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'security',
      icon: <LockOutlined />,
      title: '3. Cam Kết Bảo Mật Thông Tin',
      content: (
        <>
          <p>Bảo mật dữ liệu của cán bộ nhân viên là ưu tiên hàng đầu của chúng tôi. Chúng tôi áp dụng các biện pháp an ninh mạng tối tân nhất:</p>
          <ul>
            <li><strong>Mã hóa dữ liệu:</strong> Toàn bộ mật khẩu tài khoản và thông tin nhạy cảm đều được mã hóa một chiều an toàn trước khi lưu trữ trong cơ sở dữ liệu.</li>
            <li><strong>Đường truyền bảo mật:</strong> Mọi luồng dữ liệu truyền tải giữa trình duyệt của bạn và hệ thống đều qua giao thức HTTPS bảo mật cao.</li>
            <li><strong>Kiểm soát truy cập:</strong> Chỉ những nhân sự được phân quyền (Ban quản lý căng tin, người giao hàng được giao nhiệm vụ) mới được tiếp cận thông tin giao hàng của bạn trong phiên làm việc.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'rights',
      icon: <SafetyCertificateOutlined />,
      title: '4. Quyền Lợi Và Trách Nhiệm Của Người Dùng',
      content: (
        <>
          <p>Bạn giữ toàn quyền chủ động đối với thông tin cá nhân của mình trên hệ thống của chúng tôi:</p>
          <ul>
            <li><strong>Chỉnh sửa thông tin:</strong> Bạn có toàn quyền tự do cập nhật thông tin cá nhân, số điện thoại, đổi mật khẩu và cập nhật lại địa điểm làm việc bất kỳ lúc nào tại mục <em>Cài đặt tài khoản</em>.</li>
            <li><strong>Quản lý lịch sử:</strong> Xem lại toàn bộ danh sách đơn hàng đã mua, trạng thái đơn hàng, và trực tiếp viết bình luận/đánh giá chất lượng phục vụ của bếp.</li>
            <li><strong>Trách nhiệm bảo mật:</strong> Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình, không chia sẻ tài khoản cho người khác để tránh sai lệch thông tin giao nhận món.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'changes',
      icon: <FileTextOutlined />,
      title: '5. Thay Đổi Chính Sách Bảo Mật',
      content: (
        <>
          <p>Chính sách bảo mật này có thể được điều chỉnh để phù hợp với sự phát triển của hệ thống căng tin và các quy định an toàn thông tin nội bộ của doanh nghiệp.</p>
          <p>Mọi thay đổi lớn sẽ được chúng tôi gửi thông báo trực tiếp qua **Hộp thư thông báo nội bộ** trên thanh tiêu đề (Topbar) để bạn dễ dàng nắm bắt kịp thời.</p>
        </>
      ),
    },
  ];

  return (
    <div className="privacy-policy-page">
      {/* Top Header */}
      <header className="privacy-header">
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

      {/* Main Content Area */}
      <main className="privacy-main">
        <div className="privacy-container">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="privacy-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Mục Lục</h3>
              <nav className="sidebar-nav">
                {sections.map((sec) => (
                  <a key={sec.id} href={`#${sec.id}`} className="nav-link">
                    {sec.icon}
                    <span>{sec.title.split('. ')[1]}</span>
                  </a>
                ))}
              </nav>
              <div className="sidebar-decor">
                <CheckCircleOutlined className="icon-shield" />
                <div className="decor-text">
                  <h4>Dữ liệu an toàn</h4>
                  <p>Cam kết bảo mật dữ liệu theo tiêu chuẩn ISO 27001.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Main Articles */}
          <article className="privacy-content">
            <div className="content-card">
              <h1 className="content-title">Chính Sách Bảo Mật</h1>
              <p className="last-updated">Cập nhật lần cuối: Ngày 18 tháng 05 năm 2026</p>
              
              <div className="content-intro">
                <p>Chào mừng cán bộ nhân viên đến với hệ thống đặt món trực tuyến của Căng tin Doanh nghiệp. Chúng tôi hiểu rằng quyền riêng tư và sự an toàn dữ liệu của bạn là vô cùng quan trọng. Chính sách bảo mật này mô tả cách thức chúng tôi thu thập, sử dụng, bảo vệ và tôn trọng quyền lợi của bạn đối với thông tin cá nhân.</p>
              </div>

              <div className="policy-divider" />

              <div className="policy-sections">
                {sections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="policy-section">
                    <h2 className="section-title">
                      <span className="icon-wrapper">{sec.icon}</span>
                      {sec.title}
                    </h2>
                    <div className="section-body">
                      {sec.content}
                    </div>
                  </section>
                ))}
              </div>

              <div className="policy-footer">
                <p>Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào về Chính sách bảo mật này, xin vui lòng liên hệ với ban quản lý căng tin doanh nghiệp qua email <a href="mailto:privacy@cantindoanhnghiep.com">privacy@cantindoanhnghiep.com</a> hoặc đường dây nóng nội bộ.</p>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="privacy-footer-simple">
        <p>© 2026 Căng tin Doanh nghiệp. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
