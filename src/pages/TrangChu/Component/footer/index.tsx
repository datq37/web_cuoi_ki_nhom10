import type { ReactNode } from 'react';
import { history } from 'umi';
import {
  ShieldCheck,
  FileText,
  Headphones,
  Building2,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import './index.less';
import { useCanteenInfo } from '@/hooks/useCanteenInfo';

// phần chân trang
export default function HomeFooter() {
  const canteen = useCanteenInfo();

  return (
    <footer className="home-footer-wrapper">
      <div className="home-footer-leaf left-leaf">
        ❧
      </div>

      <div className="home-footer-leaf right-leaf">
        ❧
      </div>

      <div className="home-footer-inner">
        <div className="home-footer-card">
          <div className="home-footer-main">
            <div className="home-footer-brand-section">
              <div className="brand-header">
                <div className="brand-logo-wrap">
                  <img
                    src={canteen.logo}
                    alt={canteen.ten}
                  />
                </div>

                <div className="brand-text-wrap">
                  <h2>
                    {canteen.ten}
                  </h2>
                  <p>
                    DOANH NGHIỆP
                  </p>
                </div>
              </div>

              <p className="brand-desc">
                Trải nghiệm ẩm thực tuyệt vời trong không gian hiện đại.
                Chúng tôi cam kết mang đến những bữa ăn ngon miệng, an toàn
                và tiện lợi cho toàn thể nhân viên.
              </p>

              <div className="brand-features">
                <FeatureBadge icon={<Leaf size={24} />} text="Nguyên liệu tươi ngon" />
                <FeatureBadge icon={<ShieldCheck size={24} />} text="An toàn vệ sinh" />
                <FeatureBadge icon={<Heart size={24} />} text="Phục vụ tận tâm" />
              </div>
            </div>
            <FooterColumn title="LIÊN KẾT">
              <FooterLink
                icon={<ShieldCheck size={22} />}
                text="Chính sách bảo mật"
                onClick={() => history.push('/chinh-sach-bao-mat')}
              />
              <FooterLink
                icon={<FileText size={22} />}
                text="Điều khoản dịch vụ"
                onClick={() => history.push('/dieu-khoan-dich-vu')}
              />
              <FooterLink
                icon={<Headphones size={22} />}
                text="Hỗ trợ khách hàng"
                onClick={() => history.push('/lien-he')}
              />
            </FooterColumn>
            <FooterColumn title="LIÊN HỆ">
              <InfoItem icon={<Building2 size={22} />} text={canteen.ten} />
              <InfoItem icon={<Mail size={22} />} text={canteen.email} />
              <InfoItem icon={<Phone size={22} />} text={canteen.sdt} />
              <InfoItem icon={<MapPin size={22} />} text={canteen.diaChi} />
            </FooterColumn>
            <div className="home-footer-newsletter-section">
              <FooterTitle title="THEO DÕI CHÚNG TÔI" />

              <p className="newsletter-desc">
                Cập nhật ưu đãi, món mới và thông báo mới nhất từ căng tin.
              </p>

              <div className="social-buttons">
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
        </div>
      </div>
    </footer>
  );
}

// phần cột nội dung
function FooterColumn({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div>
      <FooterTitle title={title} />
      <div className="home-footer-links-wrap">
        {children}
      </div>
    </div>
  );
}


// phần tiêu đề cột
function FooterTitle({ title }: { title: string }) {
  return (
    <div className="home-footer-title">
      <h3>{title}</h3>
      <div className="title-line" />
    </div>
  );
}

// phần liên kết chân trang
function FooterLink({ icon, text, onClick }: { icon: ReactNode, text: string, onClick?: () => void }) {
  return (
    <button className="home-footer-link" onClick={onClick}>
      <div className="link-left">
        <span className="link-icon">
          {icon}
        </span>
        <span className="link-text">
          {text}
        </span>
      </div>
      <ChevronRight size={22} className="link-right-icon" />
    </button>
  );
}

// phần thông tin liên hệ
function InfoItem({ icon, text }: { icon: ReactNode, text: string }) {
  return (
    <div className="home-footer-info-item">
      <span className="info-icon">
        {icon}
      </span>
      <span className="info-text">
        {text}
      </span>
    </div>
  );
}

// phần huy hiệu thương hiệu
function FeatureBadge({ icon, text }: { icon: ReactNode, text: string }) {
  return (
    <div className="home-footer-badge">
      <span className="badge-icon">
        {icon}
      </span>
      <span className="badge-text">
        {text}
      </span>
    </div>
  );
}
