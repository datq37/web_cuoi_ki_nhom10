import React from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const PhanHero: React.FC = () => {
    return (
        <div className="phan-anh-bia">
            <div className="hang-tieu-de-anh-bia">
                <span className="bieu-tuong-anh-bia">
                    <SettingOutlined />
                </span>
                <div>
                    <Typography.Title level={1} style={{ margin: 0 }}>Cài đặt tài khoản</Typography.Title>
                    <Typography.Paragraph style={{ margin: 0 }}>Quản lý thông tin cá nhân và cấu hình giao hàng nội bộ.</Typography.Paragraph>
                </div>
            </div>

            <div className="minh-hoa-anh-bia" aria-hidden="true">
                <div className="chau-cay">
                    <span />
                </div>
                <div className="the-ten">
                    <div className="kep-the" />
                    <div className="anh-dai-dien-the">
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
