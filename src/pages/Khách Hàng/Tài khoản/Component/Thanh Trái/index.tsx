import React from 'react';
import { Button, Avatar, Upload, Progress } from 'antd';
import { CameraOutlined, SafetyOutlined, UploadOutlined, CrownFilled } from '@ant-design/icons';
import type { ThanhBenProps } from '@/services/Khách hàng/Tài khoản/typing';

const ThanhBen: React.FC<ThanhBenProps> = ({ currentUser, avatarUrl, isAvatarImage, beforeUpload, rankInfo }) => {
    const renderAvatar = () => {
        if (isAvatarImage()) {
            return <Avatar size={128} src={avatarUrl} className="profile-avatar" />;
        }
        return (
            <Avatar size={128} className="profile-avatar profile-avatar-text">
                {avatarUrl || 'U'}
            </Avatar>
        );
    };

    const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

    return (
        <section className="profile-sidebar profile-card">
            <div className="avatar-art" aria-hidden="true">
                <span className="leaf leaf-a" />
                <span className="leaf leaf-b" />
            </div>

            <div className="avatar-preview">
                {renderAvatar()}
                <span className="camera-badge">
                    <CameraOutlined />
                </span>
            </div>

            <h2>{currentUser.name}</h2>
            <p className="user-dept">{currentUser.dept}</p>

            <div className="rank-info" style={{ marginTop: 16, marginBottom: 16, textAlign: 'center', background: '#f5f5f5', padding: 12, borderRadius: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: rankInfo?.color || '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <CrownFilled /> Hạng {rankInfo?.name || 'Đồng'}
                </div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                    Điểm thưởng: <strong style={{ color: '#ff4d4f' }}>{fmt(currentUser.points || 0)}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    Đã chi tiêu: {fmt(currentUser.totalSpent || 0)}đ
                </div>
            </div>

            <div className="avatar-upload-block">
                <strong>Ảnh đại diện</strong>
                <span>JPG, PNG tối đa 2MB</span>
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    accept="image/*"
                >
                    <Button icon={<UploadOutlined />} className="upload-btn">
                        Tải ảnh lên
                    </Button>
                </Upload>
            </div>

            <div className="privacy-note">
                <SafetyOutlined />
                <span>Thông tin của bạn được bảo mật và chỉ hiển thị nội bộ.</span>
            </div>
        </section>
    );
};

export default ThanhBen;
