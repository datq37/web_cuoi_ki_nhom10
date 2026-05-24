import React, { useState } from 'react';
import {
  Zap,
  Trophy,
  Sparkles,
  Clock3,
  Bell,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Leaf,
  Settings,
  Heart,
} from 'lucide-react';
import './index.less';

const whyFast = require('@/assets/trangchu/nhanhchong.png');
const whyConvenient = require('@/assets/trangchu/thuantien.png');
const whyClean = require('@/assets/trangchu/sachse.png');

const whyData = [
  {
    key: 'fast',
    tab: 'Nhanh chóng',
    icon: <Zap size={20} />,
    title: 'Nhanh chóng',
    image: whyFast,
    badge: 'Chỉ vài thao tác là xong đơn!',
    badgeDesc: 'Nhanh chóng - Tiết kiệm',
    desc: 'Với đội ngũ giao hàng chuyên nghiệp, chúng tôi cam kết mang đến những bữa ăn nóng hổi trong thời gian ngắn nhất. Bạn không cần phải chờ đợi lâu để thưởng thức hương vị tuyệt hảo mà mình yêu thích. Tốc độ và chất lượng luôn đi đôi với nhau.',
    features: [
      { icon: <Clock3 size={24} />, title: 'Phục vụ nhanh', desc: 'Giao món nhanh chóng, đúng giờ.' },
      { icon: <Zap size={24} />, title: 'Tiết kiệm thời gian', desc: 'Giảm thời gian chờ tối ưu nhất.' },
      { icon: <Bell size={24} />, title: 'Thông báo tức thì', desc: 'Cập nhật trạng thái đơn hàng liên tục.' },
      { icon: <ThumbsUp size={24} />, title: 'Trải nghiệm tốt', desc: 'Dịch vụ tận tâm, khách hàng hài lòng.' },
    ],
  },
  {
    key: 'convenient',
    tab: 'Thuận tiện',
    icon: <Trophy size={20} />,
    title: 'Thuận tiện',
    image: whyConvenient,
    badge: 'Đặt món mọi lúc mọi nơi!',
    badgeDesc: 'Linh hoạt - Dễ dùng',
    desc: 'Trải nghiệm đặt món trở nên dễ dàng và mượt mà hơn bao giờ hết. Bạn có thể thoải mái lựa chọn phương thức thanh toán linh hoạt và theo dõi đơn hàng mọi lúc mọi nơi. Sự thuận tiện của khách hàng luôn được chúng tôi đặt lên hàng đầu.',
    features: [
      { icon: <Smartphone size={24} />, title: 'Đặt món mọi lúc', desc: 'Dễ dàng chọn món trên điện thoại.' },
      { icon: <CreditCard size={24} />, title: 'Thanh toán linh hoạt', desc: 'Hỗ trợ tiền mặt, QR và ngân hàng.' },
      { icon: <Bell size={24} />, title: 'Theo dõi real-time', desc: 'Biết đơn hàng đang ở trạng thái nào.' },
      { icon: <ThumbsUp size={24} />, title: 'Thân thiện', desc: 'Giao diện dễ nhìn, dễ thao tác.' },
    ],
  },
  {
    key: 'clean',
    tab: 'Sạch sẽ',
    icon: <Sparkles size={20} />,
    title: 'Sạch sẽ',
    image: whyClean,
    badge: 'Đảm bảo vệ sinh nghiêm ngặt!',
    badgeDesc: 'Sạch sẽ - An toàn',
    desc: 'Vệ sinh an toàn thực phẩm là tiêu chí cốt lõi trong mọi khâu chế biến. Từ việc lựa chọn nguyên liệu tươi ngon đến quy trình đóng gói kỹ lưỡng, chúng tôi đảm bảo mỗi món ăn gửi đến bạn đều đạt chuẩn sạch sẽ và an toàn tuyệt đối.',
    features: [
      { icon: <ShieldCheck size={24} />, title: 'An toàn vệ sinh', desc: 'Đảm bảo tiêu chuẩn vệ sinh nghiêm ngặt.' },
      { icon: <Leaf size={24} />, title: 'Nguyên liệu tươi', desc: 'Lựa chọn nguyên liệu tươi ngon mỗi ngày.' },
      { icon: <Settings size={24} />, title: 'Quy trình chuẩn', desc: 'Quy trình chế biến khoa học, khép kín.' },
      { icon: <Heart size={24} />, title: 'Vì sức khỏe bạn', desc: 'Dinh dưỡng cân bằng, tốt cho sức khỏe.' },
    ],
  },
];

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = whyData[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? whyData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === whyData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="why-section">
      {/* Background decorations */}
      <div className="why-dots why-dots-left">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="why-dot" />
        ))}
      </div>
      <div className="why-leaf-deco">❧</div>
      <div className="why-blob why-blob-left" />
      <div className="why-blob why-blob-right" />

      <div className="why-inner">
        {/* Title */}
        <div className="why-header">
          <h2 className="why-title">
            VÌ SAO CHỌN{' '}
            <span className="why-title-green">CHÚNG TÔI?</span>
            <span className="why-title-leaf">🌿</span>
          </h2>
          <p className="why-subtitle">
            Mang đến trải nghiệm đặt món hiện đại, tiện lợi và an toàn cho doanh nghiệp
          </p>
        </div>

        {/* Tabs */}
        <div className="why-tabs">
          {whyData.map((item, index) => (
            <button
              key={item.key}
              onClick={() => setActiveIndex(index)}
              className={`why-tab-btn ${index === activeIndex ? 'why-tab-active' : ''}`}
            >
              {item.icon}
              {item.tab}
            </button>
          ))}
        </div>

        {/* Dots decoration right */}
        <div className="why-dots why-dots-right">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="why-dot" />
          ))}
        </div>

        {/* Main card */}
        <div className="why-card">
          <div className="why-card-grid">
            {/* Image side */}
            <div className="why-image-side">
              <div className="why-image-bg-blob" />
              <div className="why-image-wrap">
                <img
                  src={activeData.image}
                  alt={activeData.title}
                  className="why-image"
                />
                <div className="why-image-overlay" />
                <div className="why-badge">
                  <div className="why-badge-icon">
                    <ThumbsUp size={18} />
                  </div>
                  <div>
                    <p className="why-badge-title">{activeData.badge}</p>
                    <p className="why-badge-desc">{activeData.badgeDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="why-text-side">
              <div className="why-divider-line" />
              <div className="why-icon-wrap">
                {activeData.icon}
              </div>
              <h3 className="why-card-title">{activeData.title}</h3>
              <div className="why-underline" />
              <p className="why-desc">{activeData.desc}</p>

              <div className="why-features">
                {activeData.features.map((feature) => (
                  <div className="why-feature-box" key={feature.title}>
                    <div className="why-feature-icon">{feature.icon}</div>
                    <h4 className="why-feature-title">{feature.title}</h4>
                    <p className="why-feature-desc">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
