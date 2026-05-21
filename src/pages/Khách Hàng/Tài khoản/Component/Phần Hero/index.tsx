import React from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';

const PhanHero: React.FC = () => {
    return (
        <div className="account-hero">
            <div className="hero-title-row">
                <span className="hero-icon">
                    <SettingOutlined />
                </span>
                <div>
                    <h1>Cài đặt tài khoản</h1>
                    <p>Quản lý thông tin cá nhân và cấu hình giao hàng nội bộ.</p>
                </div>
            </div>

            <div className="hero-card-illustration" aria-hidden="true">
                <div className="plant-pot">
                    <span />
                </div>
                <div className="id-card">
                    <div className="clip" />
                    <div className="id-avatar">
                        <UserOutlined />
                    </div>
                    <i />
                    <i />
                    <i />
                </div>
            </div>
        </div>
    );
};

export default PhanHero;
