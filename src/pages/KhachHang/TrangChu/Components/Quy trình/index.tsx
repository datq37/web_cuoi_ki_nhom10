import React from 'react';
import shipperScooter from '@/assets/KhachHang/Trang chủ/shipper_scooter.png';
import handPhoneOrder from '@/assets/KhachHang/Trang chủ/hand_phone_order.png';
import paymentPhone from '@/assets/KhachHang/Trang chủ/payment_phone.png';
import { ImageFit } from '@/services/KhachHang/TrangChu/typing';
import type { StepCardProps } from '@/services/KhachHang/TrangChu/typing';
import './index.less';

const StepCard: React.FC<StepCardProps> = ({ number, img, icon, imageFit = ImageFit.Cover, title, desc }) => (
  <div className="step-card">
    {img ? <img src={img} alt={title} className={imageFit === ImageFit.Contain ? 'img-contain' : ''} /> : <div className="step-icon">{icon}</div>}
    <div className="step-number">{number}</div>
    <div>
      <p>{title}</p>
      <span>{desc}</span>
    </div>
  </div>
);
const OrderSteps: React.FC = () => {
  return (
    <div className="order-steps-wrap">
      <h2>Quy trình đặt món</h2>
      <div className="order-steps">
        <StepCard number="1" img={handPhoneOrder} imageFit={ImageFit.Contain} title="Chọn món" desc="Chọn món ngon yêu thích" />
        <StepCard number="2" img={paymentPhone} imageFit={ImageFit.Contain} title="Thanh toán" desc="Thanh toán nhanh chóng, an toàn" />
        <StepCard number="3" img={shipperScooter} imageFit={ImageFit.Contain} title="Nhận món" desc="Giao tận nơi 15 - 20 phút" />
      </div>
    </div>
  );
};

export default OrderSteps;
