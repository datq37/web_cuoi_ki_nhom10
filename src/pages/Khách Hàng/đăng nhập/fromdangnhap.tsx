import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';

interface LoginFormProps {
  onToggle?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Tài khoản giả định để test
    const DUMMY_PHONE = '0987654321';
    const DUMMY_PASSWORD = 'password123';

    if (phone === DUMMY_PHONE && password === DUMMY_PASSWORD) {
      message.success('Đăng nhập thành công! Chào mừng bạn.');
      history.push('/trang-chinh'); // Chuyển hướng về trang chính
    } else {
      message.error('Số điện thoại hoặc mật khẩu không chính xác. Thử: 0987654321 / password123');
    }
  };

  return (
    <form action="#" onSubmit={(e) => e.preventDefault()}>
      <h1>Đăng nhập</h1>
      <input 
        type="text" 
        placeholder="Số điện thoại (Test: 0987654321)" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Mật khẩu (Test: password123)" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <a href="#" className="forgot-password">Quên mật khẩu?</a>
      <button className="submit-btn" type="button" onClick={handleLogin}>Đăng nhập</button>
      <div className="social-login">
        <span>Hoặc đăng nhập bằng</span>
        <div className="social-container">
          <a href="#" className="social-btn google" onClick={(e) => e.preventDefault()}>
            <GoogleOutlined className="icon" />
            <span className="text">Google</span>
          </a>
        </div>
      </div>
      <div className="mobile-toggle">
        Chưa có tài khoản? <span onClick={onToggle}>Đăng ký ngay</span>
      </div>
    </form>
  );
};

export default LoginForm;
