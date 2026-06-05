import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message, Form, Input, Button } from 'antd';
import { history } from 'umi';
import { showCustomerNotification } from '@/utils/notification';

import type { RegisterFormProps } from '@/services/KhachHang/Login/typing';

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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
            <Form 
                form={form}
                onFinish={handleRegister} 
                className="ant-form-auth"
            >
                <h1>Tạo tài khoản</h1>
                
                <Form.Item name="ten">
                    <Input placeholder="Họ và tên (không bắt buộc)" disabled={loading} />
                </Form.Item>

                <Form.Item 
                    name="taikhoan" 
                    rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                >
                    <Input placeholder="Tên tài khoản" disabled={loading} />
                </Form.Item>

                <Form.Item 
                    name="matkhau" 
                    rules={[{ required: true, min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
                >
                    <Input.Password placeholder="Mật khẩu (ít nhất 6 ký tự)" disabled={loading} />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="nutXacNhan"
                    loading={loading}
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
    );
};

export default RegisterForm;
