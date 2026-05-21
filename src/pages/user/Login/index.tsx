import { Button, Form, Input } from 'antd';
import React from 'react';
import { history } from 'umi';

const Login: React.FC = () => {
  const onFinish = () => history.push('/dashboard');
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 12, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#111827' }}>Đăng nhập</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tài khoản" name="username" rules={[{ required: true }]}>
            <Input size="large" placeholder="Nhập tài khoản" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
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
