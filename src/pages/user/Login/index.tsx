import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { history } from 'umi';

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('Đăng nhập Quản trị thành công! Chào mừng Admin.');
      history.push('/quan-tri/tong-quan');
    } else {
      message.error('Tài khoản hoặc mật khẩu không chính xác. Thử: admin / admin');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 12, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#111827' }}>Đăng nhập Quản Trị</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tài khoản" name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
            <Input size="large" placeholder="Nhập tài khoản (admin)" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password size="large" placeholder="Nhập mật khẩu (admin)" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block style={{ background: '#16a34a', borderColor: '#16a34a', borderRadius: 8 }}>
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
