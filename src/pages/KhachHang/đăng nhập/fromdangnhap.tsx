import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message, Form, Input, Button } from 'antd';
import { history } from 'umi';
import type { LoginFormProps } from '@/services/KhachHang/Login/typing';
import { showCustomerNotification } from '@/utils/notification';

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [form] = Form.useForm();

  const handleLogin = (values: any) => {
    const { phone, password } = values;
    const DUMMY_PHONE = '0987654321';
    const DUMMY_PASSWORD = 'password123';

    if (phone === DUMMY_PHONE && password === DUMMY_PASSWORD) {
      showCustomerNotification('Đăng nhập thành công! Chào mừng bạn.', undefined, 'success');
      history.push('/KhachHang/TrangChu');
    } else {
      showCustomerNotification('Số điện thoại hoặc mật khẩu không chính xác.', undefined, 'error');
    }
  };

  return (
      <Form
        form={form}
        onFinish={handleLogin}
        className="ant-form-auth"
      >
        <h1>Đăng nhập</h1>
        
        <Form.Item 
          name="phone" 
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item 
          name="password" 
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <a href="#" className="quenMatKhau">Quên mật khẩu?</a>
        
        <Button
          type="primary"
          htmlType="submit"
          className="nutXacNhan"
        >
          Đăng nhập
        </Button>

        <div className="dangNhapMangXaHoi">
          <span>Hoặc đăng nhập bằng</span>
          <div className="khungMangXaHoi">
            <a href="#" className="nutMangXaHoi google" onClick={(e) => e.preventDefault()}>
              <GoogleOutlined className="bieuTuong" />
              <span className="vanBan">Google</span>
            </a>
          </div>
        </div>

        <div className="chuyenDoiDiDong" style={{ marginTop: '24px' }}>
          Chưa có tài khoản? <span onClick={onToggle} style={{ color: '#2D6A4F', cursor: 'pointer', fontWeight: 600 }}>Đăng ký ngay</span>
        </div>
      </Form>
  );
};

export default LoginForm;
