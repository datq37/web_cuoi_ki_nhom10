import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';
import { LoginFormProps } from '@/services/KhachHang/Login/typing';
import { showCustomerNotification } from '@/utils/notification';

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const DUMMY_PHONE = '0987654321';
    const DUMMY_PASSWORD = 'password123';

    if (phone === DUMMY_PHONE && password === DUMMY_PASSWORD) {
      showCustomerNotification('Đăng nhập thành công! Chào mừng bạn.', undefined, 'success');
      history.push('/trang-chinh');
    } else {
      showCustomerNotification('Số điện thoại hoặc mật khẩu không chính xác. Thử: 0987654321 / password123', undefined, 'error');
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
      <a href="#" className="quenMatKhau">Quên mật khẩu?</a>
      <button className="nutXacNhan" type="button" onClick={handleLogin}>Đăng nhập</button>
      <div className="dangNhapMangXaHoi">
        <span>Hoặc đăng nhập bằng</span>
        <div className="khungMangXaHoi">
          <a href="#" className="nutMangXaHoi google" onClick={(e) => e.preventDefault()}>
            <GoogleOutlined className="bieuTuong" />
            <span className="vanBan">Google</span>
          </a>
        </div>
      </div>
      <div className="chuyenDoiDiDong">
        Chưa có tài khoản? <span onClick={onToggle}>Đăng ký ngay</span>
      </div>
    </form>
  );
};

export default LoginForm;
