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
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

import './index.less';
import bgImage from "@/assets/dangki/dangnhap.png";
import { showCustomerNotification } from '@/utils/notification';
import GlobalNotificationModal from '../Component/GlobalNotificationModal';

export default function LoginPage() {
  const isRegisterRoute = history.location.pathname === '/dang-ky';
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);

  const { theme } = useModel('KhachHang.GlobalState.index');
  const darkMode = theme === 'dark';
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!phone || !password) {
        message.warning('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      try {
        await axios.post(`${ip3}/auth/register`, { taikhoan: phone, matkhau: password });
        showCustomerNotification(
          'Đăng ký thành công!',
          undefined,
          'success'
        );
        setTimeout(() => {
          setIsSignUp(false);
          setPassword('');
        }, 2000);
      } catch (err: any) {
        const detail = err?.response?.data?.detail;
        showCustomerNotification(
          'Đăng ký thất bại',
          detail || 'Vui lòng thử lại.',
          'error'
        );
      }
    } else {
      if (!phone || !password) {
        message.warning('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      try {
        const res = await axios.post(`${ip3}/auth/login`, { taikhoan: phone, matkhau: password });
        if (res.data && res.data.accessToken) {
           localStorage.setItem('loginToken', res.data.accessToken);
           showCustomerNotification('Đăng nhập thành công!', undefined, 'success');
           if (phone === 'admin') history.push('/quan-tri/tong-quan');
           else history.push('/trang-chinh');
        }
      } catch (err: any) {
        showCustomerNotification('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.', undefined, 'error');
      }
    }
  };

  return (
    <>
      <GlobalNotificationModal />
      <div className={`trangDangNhapMoi ${isSignUp ? 'laDangKy' : ''} ${darkMode ? 'giaoDienToi' : ''}`}>
      <div className="theDangNhap">

        <div className="bangTrai">

          <div className="hinhTrangTri1"></div>
          <div className="hinhTrangTri2"></div>
          <div className="hinhTrangTri3"></div>

          <Leaf className="laTrangTri la1" size={34} />
          <Leaf className="laTrangTri la2" size={42} />
          <Leaf className="laTrangTri la3" size={30} />

          <div className="chamTrangTri">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="cham" />
            ))}
          </div>
          <div className="logoDangNhap">
            <img src="/logo.webp" alt="Logo căng tin" />
            <div>
              <h2 className="tieuDeThuongHieu">Căng tin</h2>
              <p className="tieuDePhuThuongHieu">DOANH NGHIỆP</p>
            </div>
          </div>
          <div className="khungForm">
            <div className="khungBieuTuongKhien">
              <div className="nenBieuTuongKhien">
                <ShieldCheck size={42} />
              </div>
            </div>

            <h1 className="tieuDe">
              {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
            </h1>

            <p className="tieuDePhu">
              {isSignUp ? "Bắt đầu trải nghiệm tiện ích đặt món ngay hôm nay!" : "Chào mừng bạn quay trở lại 👋"}
            </p>

            <form onSubmit={handleSubmit} className="bieuMau">
              <div className="nhomNhapLieu">
                <div className="hopBieuTuong">
                  <Phone size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Tài khoản (VD: admin hoặc dang.nh20)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="nhomNhapLieu">
                <div className="hopBieuTuong">
                  <Lock size={22} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu (VD: 123456 hoặc pass123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="anHienMatKhau"
                >
                  {showPassword ? <EyeOff size={23} /> : <Eye size={23} />}
                </button>
              </div>

              {!isSignUp && (
                <div className="bieuMau-options">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button type="button" className="nutQuenMatKhau">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button type="submit" className="nutXacNhan">
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

            <div className="duongChia">
              <div className="duongKe"></div>
              <span>Hoặc {isSignUp ? "đăng ký" : "đăng nhập"} bằng</span>
              <div className="duongKe"></div>
            </div>

            <button className="nutGoogle">
              <span className="bieuTuongG">G</span>
              Tiếp tục với Google
            </button>

            <p className="chuDangKy">
              {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Đăng nhập ngay →" : "Đăng ký ngay →"}
              </button>
            </p>
          </div>
        </div>
        <div className="bangPhai">
          <img src={bgImage} alt="Ảnh căn tin" className="anhNen" />

          <div className="lopPhuChuyenMau"></div>
          <div className="lopPhuToi"></div>

          <div className="vienXanh"></div>

          <div className="laTrangTri-top">🍃</div>

          <div className="mayBayGiay">
            <div className="khungBao">
              <span className="duongKe-icon">⌁</span>
              <div className="bieuTuongMayBay">🛩️</div>
            </div>
          </div>

          <svg className="dashed-duongKe" viewBox="0 0 260 100" fill="none">
            <path
              d="M10 70 C60 20, 100 90, 140 40 C170 5, 205 35, 240 10"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </svg>

          <div className="heart-hopBieuTuong">
            <Heart size={38} />
          </div>

          <div className="laTrangTri-bottom">🌿</div>

          <div className="noiDung">
            <div className="welcome-khungBao">
              <p className="chuChaoMung">
                {isSignUp ? "Khởi đầu," : "Xin chào,"}
              </p>
              <h2 className="welcome-tieuDe">
                {isSignUp ? "Mới!" : "Bạn!"}
                <span className="duongGachChan1"></span>
                <span className="duongGachChan2"></span>
              </h2>
            </div>

            <p className="moTaChaoMung">
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

            <div className="cacTinhNang">
              <FeatureCardRight icon={<ShieldCheck size={16} />} title="Bảo mật" desc="An toàn tuyệt đối" />
              <FeatureCardRight icon={<Zap size={16} />} title="Nhanh chóng" desc="Đăng nhập chỉ 1s" />
              <FeatureCardRight icon={<Leaf size={16} />} title="Tiện lợi" desc="Mọi lúc, mọi nơi" />
              <FeatureCardRight icon={<Headphones size={16} />} title="Hỗ trợ 24/7" desc="Luôn sẵn sàng" />
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="theTinhNang">
      <div className="icon-khungBao">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function FeatureCardRight({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="theTinhNang-right">
      <div className="icon-khungBao">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
