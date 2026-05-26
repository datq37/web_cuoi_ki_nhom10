import React, { useState } from 'react';
import LoginForm from '../đăng nhập/fromdangnhap';
import RegisterForm from './fromdangki';
import './index.less';
import dangKiImg from '@/assets/dangki/dangki.png';

const SignUpPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="auth-body">
      <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`}>
        
        <div className="form-container sign-up-container">
          <RegisterForm />
        </div>

        <div className="form-container sign-in-container">
          <LoginForm />
        </div>

        <div className="overlay-container">
          <div className="overlay" style={{ backgroundImage: `url(${dangKiImg})` }}>
            <div className="overlay-panel overlay-left">
              <h1 className="welcome-text">Chào mừng trở lại!</h1>
              <p>Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(false)}>
                Đăng nhập
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="welcome-text">Xin chào, Bạn!</h1>
              <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>
              <button className="ghost-btn" onClick={() => setIsSignUp(true)}>
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
