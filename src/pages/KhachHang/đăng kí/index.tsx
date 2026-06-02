import React, { useState } from 'react';
import LoginForm from '../đăng nhập/fromdangnhap';
import RegisterForm from './fromdangki';
import './index.less';
import dangKiImg from '@/assets/dangki/dangki.png';

const SignUpPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="phanXacThuc">
      <div className={`khungXacThuc ${isSignUp ? 'kichHoatBangPhai' : ''}`}>

        <div className="khungDangKy">
          <RegisterForm />
        </div>

        <div className="khungDangNhap">
          <LoginForm />
        </div>

        <div className="khungPhu">
          <div className="lopPhu" style={{ backgroundImage: `url(${dangKiImg})` }}>
            <div className="Trai">
              <h1 className="ChaoMung">Chào mừng trở lại!</h1>
              <p>Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
              <button className="nutdangnhap" onClick={() => setIsSignUp(false)}>
                Đăng nhập
              </button>
            </div>
            <div className="Phai">
              <h1 className="ChaoMung">Xin chào, Bạn!</h1>
              <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>
              <button className="nutdangki" onClick={() => setIsSignUp(true)}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
