import React from 'react';
import deliveryIcon from '@/assets/Khách Hàng/Tài khoản/nguoigiaohang.png';

const MeoGiaoHang: React.FC = () => {
    return (
        <section className="delivery-tip">
            <div className="tip-icon">💡</div>
            <div>
                <h3>Giao hàng nội bộ nhanh chóng</h3>
                <p>Thông tin chính xác giúp chúng tôi giao món ăn đúng nơi, đúng người và đúng thời gian.</p>
            </div>
            <img src={deliveryIcon} alt="Người giao hàng" />
        </section>
    );
};

export default MeoGiaoHang;
