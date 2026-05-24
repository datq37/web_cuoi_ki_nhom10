import React, { useState } from "react";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Zap,
  Heart,
  Leaf,
  ArrowRight,
  UserPlus,
  Headphones
} from "lucide-react";
import { message } from "antd";
import { history, useModel } from "umi";

import './index.less';
import bgImage from "@/assets/dangki/dangnhap.png";

export default function LoginPage() {
  const isRegisterRoute = history.location.pathname === '/dang-ky';
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);
  
  const { theme } = useModel('Khách Hàng.global');
  const darkMode = theme === 'dark';
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!phone || !password) {
        message.warning('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      message.success('Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setIsSignUp(false);
      setPhone("");
      setPassword("");
    } else {
      const DUMMY_PHONE = '0987654321';
      const DUMMY_PASSWORD = 'password123';
      if (phone === DUMMY_PHONE && password === DUMMY_PASSWORD) {
        message.success('Đăng nhập thành công! Chào mừng bạn.');
        history.push('/trang-chinh');
      } else {
        message.error('Số điện thoại hoặc mật khẩu không chính xác. Thử: 0987654321 / password123');
      }
    }
  };

  return (
    <div className={`new-login-page ${isSignUp ? 'is-sign-up' : ''} ${darkMode ? 'theme-dark' : ''}`}>
      <div className="login-card">

        {/* PHẦN TRÁI: FORM */}
        <div className="left-panel">
          {/* NỀN TRANG TRÍ PHẦN TRẮNG */}
          <div className="decor-blob-1"></div>
          <div className="decor-blob-2"></div>
          <div className="decor-blob-3"></div>

          {/* Lá trang trí */}
          <Leaf className="decor-leaf leaf-1" size={34} />
          <Leaf className="decor-leaf leaf-2" size={42} />
          <Leaf className="decor-leaf leaf-3" size={30} />

          {/* Chấm trang trí */}
          <div className="decor-dots">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="dot" />
            ))}
          </div>

          {/* Logo */}
          <div className="logo-header">
            <img src="/logo.webp" alt="Logo căng tin" />
            <div>
              <h2 className="brand-title">Căng tin</h2>
              <p className="brand-subtitle">DOANH NGHIỆP</p>
            </div>
          </div>

          {/* Nội dung form */}
          <div className="form-content">
            <div className="shield-icon-wrapper">
              <div className="shield-icon-bg">
                <ShieldCheck size={42} />
              </div>
            </div>

            <h1 className="title">
              {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
            </h1>

            <p className="subtitle">
              {isSignUp ? "Bắt đầu trải nghiệm tiện ích đặt món ngay hôm nay!" : "Chào mừng bạn quay trở lại 👋"}
            </p>

            <form onSubmit={handleSubmit} className="form">
              {/* Số điện thoại */}
              <div className="input-group">
                <div className="icon-box">
                  <Phone size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Số điện thoại (Test: 0987654321)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Mật khẩu */}
              <div className="input-group">
                <div className="icon-box">
                  <Lock size={22} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu (Test: password123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={23} /> : <Eye size={23} />}
                </button>
              </div>

              {/* Ghi nhớ / Quên mật khẩu */}
              {!isSignUp && (
                <div className="form-options">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button type="button" className="forgot-btn">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Button */}
              <button type="submit" className="submit-btn">
                {isSignUp ? (
                  <>
                    <UserPlus size={26} />
                    ĐĂNG KÝ NGAY
                    <ArrowRight size={26} />
                  </>
                ) : (
                  <>
                    <LogIn size={26} />
                    ĐĂNG NHẬP
                    <ArrowRight size={26} />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <div className="line"></div>
              <span>Hoặc {isSignUp ? "đăng ký" : "đăng nhập"} bằng</span>
              <div className="line"></div>
            </div>

            <button className="google-btn">
              <span className="g-icon">G</span>
              Tiếp tục với Google
            </button>

            <p className="signup-text">
              {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Đăng nhập ngay →" : "Đăng ký ngay →"}
              </button>
            </p>
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH CĂN TIN */}
        <div className="right-panel">
          <img src={bgImage} alt="Ảnh căn tin" className="bg-image" />

          <div className="overlay-gradient"></div>
          <div className="overlay-dark"></div>

          <div className="green-border"></div>

          <div className="decor-leaf-top">🍃</div>

          <div className="paper-plane">
            <div className="wrapper">
              <span className="line-icon">⌁</span>
              <div className="plane-icon">🛩️</div>
            </div>
          </div>

          <svg className="dashed-line" viewBox="0 0 260 100" fill="none">
            <path
              d="M10 70 C60 20, 100 90, 140 40 C170 5, 205 35, 240 10"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </svg>

          <div className="heart-icon-box">
            <Heart size={38} />
          </div>

          <div className="decor-leaf-bottom">🌿</div>

          <div className="content">
            <div className="welcome-wrapper">
              <p className="welcome-text">
                {isSignUp ? "Khởi đầu," : "Xin chào,"}
              </p>
              <h2 className="welcome-title">
                {isSignUp ? "Mới!" : "Bạn!"}
                <span className="underline-1"></span>
                <span className="underline-2"></span>
              </h2>
            </div>

            <p className="welcome-desc">
              {isSignUp ? (
                <>
                  Hãy tạo tài khoản ngay <br />
                  để nhận nhiều ưu đãi hấp dẫn
                </>
              ) : (
                <>
                  Nhập thông tin cá nhân của bạn <br />
                  và bắt đầu hành trình với chúng tôi
                </>
              )}
            </p>

            <div className="features">
              <FeatureCardRight icon={<ShieldCheck size={16} />} title="Bảo mật" desc="An toàn tuyệt đối" />
              <FeatureCardRight icon={<Zap size={16} />} title="Nhanh chóng" desc="Đăng nhập chỉ 1s" />
              <FeatureCardRight icon={<Leaf size={16} />} title="Tiện lợi" desc="Mọi lúc, mọi nơi" />
              <FeatureCardRight icon={<Headphones size={16} />} title="Hỗ trợ 24/7" desc="Luôn sẵn sàng" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function FeatureCardRight({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="feature-card-right">
      <div className="icon-wrapper">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
