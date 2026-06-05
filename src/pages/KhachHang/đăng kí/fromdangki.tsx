import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message, Form, Input, Button, ConfigProvider } from 'antd';
import { history } from 'umi';
import { showCustomerNotification } from '@/utils/notification';

import type { RegisterFormProps } from '@/services/KhachHang/Login/typing';

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
    const [form] = Form.useForm();

    const handleRegister = async (values: any) => {
        const { ten, taikhoan, matkhau } = values;

        setLoading(true);
        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taikhoan, matkhau, ten: ten || undefined }),
            });

            if (res.status === 201) {
                showCustomerNotification(
                    'Đăng ký thành công! 🎉',
                    'Tài khoản đã được tạo. Chuyển sang đăng nhập...',
                    'success'
                );
                setTimeout(() => {
                    if (onToggle) {
                        onToggle();
                    } else {
                        history.push('/KhachHang/dangnhap');
                    }
                }, 1500);
            } else {
                const data = await res.json();
                const errMsg =
                    data?.detail === 'Tên tài khoản đã tồn tại'
                        ? 'Tài khoản này đã được đăng ký rồi!'
                        : data?.detail || 'Đăng ký thất bại, vui lòng thử lại.';
                message.error(errMsg);
            }
        } catch {
            message.error('Không thể kết nối tới máy chủ, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        colorBgContainer: '#f5f5f5',
                        colorBorder: '#eee',
                        borderRadius: 10,
                        controlHeight: 46,
                        hoverBorderColor: '#2D6A4F',
                        activeBorderColor: '#2D6A4F',
                    },
                    Button: {
                        colorPrimary: '#2D6A4F',
                        colorPrimaryHover: '#1b4332',
                        colorPrimaryActive: '#1b4332',
                        borderRadius: 30,
                        controlHeight: 46,
                        fontWeight: 600,
                    }
                }
            }}
        >
            <Form 
                form={form}
                onFinish={handleRegister} 
                className="ant-form-auth"
                style={{
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '0 50px',
                    height: '100%',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontWeight: 700, marginBottom: '30px', color: '#2D6A4F' }}>Tạo tài khoản</h1>
                
                <Form.Item 
                    name="ten" 
                    style={{ width: '100%', marginBottom: '16px' }}
                >
                    <Input placeholder="Họ và tên (không bắt buộc)" disabled={loading} />
                </Form.Item>

                <Form.Item 
                    name="taikhoan" 
                    rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                    style={{ width: '100%', marginBottom: '16px' }}
                >
                    <Input placeholder="Tên tài khoản" disabled={loading} />
                </Form.Item>

                <Form.Item 
                    name="matkhau" 
                    rules={[{ required: true, min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
                    style={{ width: '100%', marginBottom: '16px' }}
                >
                    <Input.Password placeholder="Mật khẩu (ít nhất 6 ký tự)" disabled={loading} />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="nutXacNhan"
                    loading={loading}
                    style={{ 
                        width: '100%', 
                        marginTop: '20px', 
                        marginBottom: '30px',
                        boxShadow: '0 4px 10px rgba(45, 106, 79, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Đăng ký
                </Button>

                <div className="dangNhapMangXaHoi">
                    <span>Hoặc đăng ký bằng</span>
                    <div className="khungMangXaHoi">
                        <a href="#" className="nutMangXaHoi google" onClick={(e) => e.preventDefault()}>
                            <GoogleOutlined className="bieuTuong" />
                            <span className="vanBan">Google</span>
                        </a>
                    </div>
                </div>
                
                <div className="chuyenDoi" style={{ marginTop: '20px' }}>
                    Đã có tài khoản? <span onClick={onToggle} style={{ color: '#2D6A4F', cursor: 'pointer', fontWeight: 600 }}>Đăng nhập ngay</span>
                </div>
            </Form>
        </ConfigProvider>
    );
};

export default RegisterForm;
