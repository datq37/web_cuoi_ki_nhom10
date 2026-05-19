import React, { useEffect } from 'react';
import { history } from 'umi';
import {
  ArrowLeftOutlined,
  ReadOutlined,
  LockOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './index.less';

const TermsOfService: React.FC = () => {
  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      icon: <ReadOutlined />,
      title: '1. Chấp Thuận Các Điều Khoản',
      content: (
        <>
          <p>Bằng việc đăng ký tài khoản và sử dụng hệ thống đặt món trực tuyến của Căng tin Doanh nghiệp, bạn đồng ý vô điều kiện tuân thủ tất cả các điều khoản, quy định được nêu chi tiết tại văn bản này.</p>
          <p>Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng dịch vụ và liên hệ trực tiếp với bộ phận Quản lý nhân sự hoặc Ban quản lý căng tin để được hỗ trợ giải quyết.</p>
        </>
      ),
    },
    {
      id: 'account',
      icon: <LockOutlined />,
      title: '2. Quản Lý Tài Khoản Và An Ninh',
      content: (
        <>
          <p>Dịch vụ này được cung cấp độc quyền cho Cán bộ Nhân viên (CBNV) chính thức của công ty:</p>
          <ul>
            <li><strong>Tính chính chủ:</strong> Bạn có trách nhiệm bảo mật mật khẩu tài khoản cá nhân và hoàn toàn chịu trách nhiệm cho mọi giao dịch đặt món được thực hiện dưới tên tài khoản của bạn.</li>
            <li><strong>Chính xác thông tin:</strong> CBNV phải cung cấp chính xác thông tin phòng ban, tòa nhà và tầng làm việc hiện tại để đảm bảo việc giao nhận món không xảy ra sai sót.</li>
            <li><strong>Nghiêm cấm chia sẻ:</strong> Tuyệt đối không chia sẻ tài khoản cho người ngoài doanh nghiệp hoặc sử dụng tài khoản để đặt món với mục đích thương mại phi pháp.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'ordering',
      icon: <ShoppingOutlined />,
      title: '3. Quy Tắc Đặt Món Và Hủy Đơn',
      content: (
        <>
          <p>Để tối ưu quy trình chế biến của bếp và đảm bảo món ăn nóng sốt đúng giờ, CBNV cần tuân thủ lịch trình đặt món:</p>
          <ul>
            <li><strong>Khung giờ đặt trước:</strong> Khuyến khích đặt món trước giờ ăn tối thiểu 30 phút để nhà bếp chuẩn bị chu đáo nhất.</li>
            <li><strong>Giới hạn đặt món:</strong> CBNV không thể đặt món cho các ngày trong tương lai (Chỉ được phép xem trước thực đơn tương lai tại lịch tuần).</li>
            <li><strong>Hủy đơn hàng:</strong> CBNV chỉ có thể hủy đơn và được hoàn tiền khi đơn hàng ở trạng thái <em>Chờ xác nhận</em> (Bếp chưa bắt đầu chế biến). Một khi bếp đã xác nhận và chế biến, đơn hàng sẽ không thể hủy bỏ.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'payment',
      icon: <CreditCardOutlined />,
      title: '4. Thanh Toán Và Giao Nhận Nội Bộ',
      content: (
        <>
          <p>Hệ thống hỗ trợ các phương thức giao nhận và thanh toán nội bộ khép kín linh hoạt:</p>
          <ul>
            <li><strong>Phương thức thanh toán:</strong> CBNV thanh toán qua ví điện tử nội bộ, tiền mặt trực tiếp tại quầy hoặc khấu trừ lương cuối tháng tùy theo chính sách phúc lợi được đăng ký.</li>
            <li><strong>Giao nhận tận nơi:</strong> Đội ngũ giao hàng nội bộ sẽ chuyển món ăn đến đúng Phòng ban/Tòa nhà/Tầng đã nhập trong form thông tin. CBNV vui lòng chú ý điện thoại khi trạng thái đơn hàng chuyển sang <em>Đang giao hàng</em>.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'disclaimer',
      icon: <ExclamationCircleOutlined />,
      title: '5. Giới Hạn Trách Nhiệm Về Dị Ứng Thực Phẩm',
      content: (
        <>
          <p>Sức khỏe của CBNV là vốn quý nhất của doanh nghiệp. Tuy nhiên, chúng tôi cần lưu ý một số điểm sau:</p>
          <ul>
            <li><strong>Thành phần dị ứng:</strong> CBNV có trách nhiệm tự kiểm tra kỹ danh sách nguyên liệu của món ăn (được hiển thị đầy đủ tại Modal Chi tiết món ăn) trước khi đặt món nếu bản thân có tiền sử dị ứng với đậu phộng, hải sản, gluten, v.v.</li>
            <li><strong>Trách nhiệm của bếp:</strong> Căng tin cam kết chế biến sạch sẽ, đảm bảo vệ sinh an toàn thực phẩm theo chuẩn Bộ Y tế nhưng không chịu trách nhiệm pháp lý đối với các phản ứng dị ứng cá nhân do CBNV không xem kỹ nguyên liệu món ăn trước khi đặt.</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="terms-of-service-page">
      {/* Top Header */}
      <header className="terms-header">
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
      <main className="terms-main">
        <div className="terms-container">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="terms-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Điều Khoản</h3>
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
                  <h4>Sử dụng nội bộ</h4>
                  <p>Áp dụng riêng cho Cán bộ Nhân viên của doanh nghiệp.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Main Articles */}
          <article className="terms-content">
            <div className="content-card">
              <h1 className="content-title">Điều Khoản Dịch Vụ</h1>
              <p className="last-updated">Cập nhật lần cuối: Ngày 18 tháng 05 năm 2026</p>
              
              <div className="content-intro">
                <p>Chào mừng bạn đến với Hệ thống đặt trước và điều phối ẩm thực nội bộ của doanh nghiệp. Khi tham gia sử dụng các dịch vụ đặt món, thanh toán và giao nhận tại căng tin của chúng tôi, bạn được mặc định là đã hiểu rõ và đồng ý tuân thủ đầy đủ các điều khoản dịch vụ dưới đây để cùng xây dựng một nét văn hóa ẩm thực công sở văn minh, hiện đại và tiện lợi.</p>
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
                <p>Mọi thắc mắc, đóng góp ý kiến về chất lượng dịch vụ hoặc các phản hồi liên quan đến Điều khoản dịch vụ này, xin vui lòng gửi về Ban quản lý căng tin qua hòm thư nội bộ hoặc email chính thức: <a href="mailto:support@cantindoanhnghiep.com">support@cantindoanhnghiep.com</a>.</p>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="terms-footer-simple">
        <p>© 2026 Căng tin Doanh nghiệp. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
