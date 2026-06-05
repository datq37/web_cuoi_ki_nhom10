import React from 'react';
import { Typography } from 'antd';
import deliveryIcon from '@/assets/KhachHang/Tài khoản/nguoigiaohang.png';

const MeoGiaoHang: React.FC = () => {
    return (
        <section className="meo-giao-hang">
            <div className="bieu-tuong-meo">💡</div>
            <div>
                <Typography.Title level={3} style={{ margin: '0 0 2px' }}>Giao hàng nội bộ nhanh chóng</Typography.Title>
                <Typography.Paragraph style={{ margin: 0 }}>Thông tin chính xác giúp chúng tôi giao món ăn đúng nơi, đúng người và đúng thời gian.</Typography.Paragraph>
            </div>
            <img src={deliveryIcon} alt="Người giao hàng" />
        </section>
    );
};

export default MeoGiaoHang;
