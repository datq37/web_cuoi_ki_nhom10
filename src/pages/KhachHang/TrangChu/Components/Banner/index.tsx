import React from 'react';
import { ArrowRight, Soup, TicketPercent, ClipboardCheck } from 'lucide-react';
import bannerHome from '@/assets/KhachHang/Trang chủ/banner trang chủ.png';
import shipperScooter from '@/assets/KhachHang/Trang chủ/shipper_scooter.png';
import { StatCardTone } from '@/services/KhachHang/TrangChu/typing';
import type { StatCardProps, BannerProps } from '@/services/KhachHang/TrangChu/typing';
import './index.less';

const StatCard: React.FC<StatCardProps> = ({ icon, image, tone, title, value, desc }) => (
  <div className="stat-card">
    <div className={`stat-icon tone-${tone}`}>
      {image ? <img src={image} alt={title} /> : icon}
    </div>
    <div>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{desc} &gt;</span>
    </div>
  </div>
);

const Banner: React.FC<BannerProps> = ({
  setPage,
  todayDishCount,
  activeOfferCount,
  placedOrderCount,
}) => {
  return (
    <>
      <section className="home-hero">
        <img src={bannerHome} alt="Banner căng tin" className="home-hero-img" />
        <div className="home-hero-discount" aria-label="Giảm 15 phần trăm">
          <span>Giảm</span>
          <strong>15%</strong>
        </div>
        <div className="home-hero-content">
          <div className="home-pill">Món ngon mỗi ngày</div>
          <p className="home-kicker">Chào mừng đến với</p>
          <h1>Căng tin Doanh nghiệp</h1>
          <p className="home-desc">
            Đặt món nhanh chóng - Không xếp hàng -
            <br />
            Món ăn tươi ngon mỗi ngày dành cho bạn.
          </p>

          <div className="home-actions">
            <button className="btn-primary-home" onClick={() => setPage('menu')}>
              Đặt món ngay
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="home-stats">
                        <StatCard icon={<ClipboardCheck size={28} strokeWidth={2.3} />} tone={StatCardTone.Blue} title="Đơn đã đặt" value={String(placedOrderCount)} desc="Đơn hàng của bạn" />
        <StatCard image={shipperScooter} icon={null} tone={StatCardTone.Lime} title="Giao nhanh" value="15 - 20 phút" desc="Nội bộ công ty" />
      </section>
    </>
  );
};

export default Banner;
