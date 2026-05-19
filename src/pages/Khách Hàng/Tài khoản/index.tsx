import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Avatar, Upload } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import './index.less';

const { Option } = Select;

const TaiKhoan: React.FC = () => {
    const { currentUser, updateProfile } = useModel('Khách Hàng.user');
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);

    useEffect(() => {
        form.setFieldsValue(currentUser);
        setAvatarUrl(currentUser.avatar);
    }, [currentUser, form]);

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG/WEBP!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setAvatarUrl(reader.result as string);
            message.success('Đã tải ảnh lên thành công!');
        };

        return false; // Ngăn không cho upload lên server
    };

    const onFinish = (values: any) => {
        updateProfile({ ...values, avatar: avatarUrl });
        message.success('Cập nhật thông tin thành công!');
    };

    const renderAvatar = () => {
        if (avatarUrl && avatarUrl.length > 2) {
            return <Avatar size={120} src={avatarUrl} style={{ border: '4px solid var(--accent)' }} />;
        }
        return (
            <Avatar size={120} style={{ backgroundColor: 'var(--accent)', fontSize: '42px', border: '4px solid rgba(255,107,0,0.2)' }}>
                {avatarUrl || 'U'}
            </Avatar>
        );
    };

    return (
        <div className="profile-settings-page fade-in">
            <div className="page-header">
                <h2>Cài đặt Tài khoản</h2>
                <p>Quản lý thông tin cá nhân và cấu hình giao hàng nội bộ.</p>
            </div>

            <div className="profile-container">
                {/* Cột trái: Ảnh đại diện */}
                <div className="profile-sidebar card">
                    <div className="avatar-section">
                        <div className="avatar-preview">
                            {renderAvatar()}
                        </div>
                        <h3 className="user-name">{currentUser.name}</h3>
                        <p className="user-dept">{currentUser.dept}</p>

                        <div className="avatar-input-wrapper">
                            <label>Ảnh đại diện:</label>
                            <Upload
                                name="avatar"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} size="large" style={{ width: '100%', marginBottom: '8px' }}>
                                    Tải ảnh lên
                                </Button>
                            </Upload>

                        </div>
                    </div>
                </div>

                {/* Cột phải: Form thông tin */}
                <div className="profile-content card">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="profile-form"
                    >
                        <h3 className="section-title">Thông tin cơ bản</h3>
                        <div className="form-row">
                            <Form.Item
                                name="name"
                                label="Họ và Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                className="flex-1"
                            >
                                <Input prefix={<UserOutlined style={{ color: 'var(--text-secondary)' }} />} placeholder="Nhập họ và tên" size="large" />
                            </Form.Item>
                        </div>
                        <div className="form-row">
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="Ví dụ: 0987654321" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email công việc"
                                rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="email@company.com" size="large" />
                            </Form.Item>
                        </div>

                        <h3 className="section-title mt-4">Thông tin giao hàng nội bộ</h3>
                        <div className="form-row">
                            <Form.Item
                                name="dept"
                                label="Phòng ban"
                                rules={[{ required: true, message: 'Vui lòng nhập phòng ban!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="Ví dụ: IT, Marketing, Nhân sự..." size="large" />
                            </Form.Item>
                            <Form.Item
                                name="building"
                                label="Tòa nhà"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tòa nhà!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="Ví dụ: Tòa nhà A, Keangnam..." size="large" />
                            </Form.Item>
                        </div>
                        <div className="form-row">
                            <Form.Item
                                name="floor"
                                label="Tầng"
                                rules={[{ required: true, message: 'Vui lòng nhập tầng!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="Ví dụ: Tầng 5" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="desk"
                                label="Vị trí / Chỗ ngồi"
                                rules={[{ required: true, message: 'Vui lòng nhập vị trí chỗ ngồi!' }]}
                                className="flex-1"
                            >
                                <Input placeholder="Ví dụ: Bàn 502, Cụm C" size="large" />
                            </Form.Item>
                        </div>

                        <div className="form-actions">
                            <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} className="btn-save">
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default TaiKhoan;
