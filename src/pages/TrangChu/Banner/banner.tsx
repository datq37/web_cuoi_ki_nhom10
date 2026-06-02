import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';
import './banner.less';
import bannerImg from '@/assets/trangchu/banner.png';

// phần banner
const Banner: React.FC = () => {
    // phần giao diện chính
    return (
        <div className="banner-container">
            <div className="banner-content-left">
                <h1 className="banner-title">
                    <span className="text-dark">Căng tin</span><br />
                </h1>
                <div className="banner-description-box">
                    <p className="banner-description">
                        Trải nghiệm ẩm thực tinh tế, kết hợp hoàn hảo giữa hương vị truyền thống và phong cách hiện đại trong không gian sang trọng.
                    </p>
                </div>
                <Button 
                    type="primary" 
                    className="btn-order-now"
                    onClick={() => history.push('/dang-nhap')}
                >
                    Đặt món ngay
                </Button>
            </div>
            <div className="banner-content-right">
                <img src={bannerImg} alt="Món ăn hấp dẫn" className="banner-image" />
            </div>
        </div>
    );
};

export default Banner;
