import React from 'react';
import { useModel } from 'umi';
import {
  ArrowRight,
  ClipboardCheck,
  Heart,
  Plus,
  Soup,
  Star,
  TicketPercent,
  Timer,
} from 'lucide-react';
import bannerHome from '@/assets/Khách Hàng/Trang chủ/banner trang chủ.png';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import chaySalad from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';
import shipperScooter from '@/assets/Khách Hàng/Trang chủ/shipper_scooter.png';
import handPhoneOrder from '@/assets/Khách Hàng/Trang chủ/hand_phone_order.png';
import paymentPhone from '@/assets/Khách Hàng/Trang chủ/payment_phone.png';
import './index.less';

interface StatCardProps {
  icon: React.ReactNode;
  image?: string;
  tone: 'green' | 'orange' | 'blue' | 'lime';
  title: string;
  value: string;
  desc: string;
}

interface CategoryCardProps {
  img: string;
  title: string;
}

interface FoodCardProps {
  img: string;
  name: string;
  desc: string;
  kcal: string;
  rate: string;
  price: string;
  hot?: boolean;
}

interface StepCardProps {
  number: string;
  img?: string;
  icon?: React.ReactNode;
  imageFit?: 'cover' | 'contain';
  title: string;
  desc: string;
}

const CustomerHome: React.FC = () => {
  const { setPage } = useModel('Khách Hàng.global');

  return (
    <div className="customer-home-page">
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
        <StatCard icon={<Soup size={28} strokeWidth={2.3} />} tone="green" title="Món hôm nay" value="12" desc="Món hấp dẫn" />
        <StatCard icon={<TicketPercent size={28} strokeWidth={2.3} />} tone="orange" title="Ưu đãi đang có" value="5" desc="Khuyến mãi hot" />
        <StatCard icon={<ClipboardCheck size={28} strokeWidth={2.3} />} tone="blue" title="Đơn đã đặt" value="8" desc="Đơn hàng của bạn" />
        <StatCard image={shipperScooter} icon={null} tone="lime" title="Giao nhanh" value="15 - 20 phút" desc="Nội bộ công ty" />
      </section>

      <div className="home-main-grid">
        <div className="home-main-left">
          <SectionTitle title="Danh mục nổi bật" onViewAll={() => setPage('menu')} />
          <div className="category-grid">
            <CategoryCard img={comPhan} title="Cơm phần" />
            <CategoryCard img={bunPho} title="Bún / Phở" />
            <CategoryCard img={doUong} title="Đồ uống" />
            <CategoryCard img={anNhe} title="Ăn nhẹ" />
            <CategoryCard img={chaySalad} title="Chay / Salad" />
          </div>

          <SectionTitle title="Món bán chạy hôm nay" onViewAll={() => setPage('menu')} className="spaced" />
          <div className="food-grid">
            <FoodCard
              hot
              img={comPhan}
              name="Cơm chiên Dương Châu"
              desc="Cơm chiên trứng, lạp xưởng, đậu Hà Lan, cà rốt"
              kcal="650 kcal"
              rate="4.6"
              price="40.000đ"
            />
            <FoodCard
              img={bunPho}
              name="Phở bò truyền thống"
              desc="Phở bò mềm, nước dùng đậm đà thơm ngon"
              kcal="520 kcal"
              rate="4.7"
              price="38.000đ"
            />
            <FoodCard
              img={anNhe}
              name="Cơm gà nướng mật ong"
              desc="Gà nướng mật ong, cơm trắng, rau củ, dưa leo"
              kcal="630 kcal"
              rate="4.6"
              price="42.000đ"
            />
          </div>

          <div className="order-steps-wrap">
            <h2>Quy trình đặt món</h2>
            <div className="order-steps">
              <StepCard number="1" img={handPhoneOrder} imageFit="contain" title="Chọn món" desc="Chọn món ngon yêu thích" />
              <StepCard number="2" img={paymentPhone} imageFit="contain" title="Thanh toán" desc="Thanh toán nhanh chóng, an toàn" />
              <StepCard number="3" img={shipperScooter} imageFit="contain" title="Nhận món" desc="Giao tận nơi 15 - 20 phút" />
            </div>
          </div>
        </div>

        <aside className="home-main-right">
          <div className="daily-offer-card">
            <img src={bannerHome} alt="Ưu đãi hôm nay" />
            <div className="offer-content">
              <div className="offer-head">
                <h3>Ưu đãi hôm nay</h3>
                <span>
                  <Timer size={14} />
                  Kết thúc sau
                </span>
              </div>
              <div className="countdown">
                <b>05</b>
                <span>:</span>
                <b>26</b>
                <span>:</span>
                <b>18</b>
              </div>
              <p className="offer-name">Combo ngon lành</p>
              <p className="offer-discount">Giảm ngay 15%</p>
              <p className="offer-note">Áp dụng cho đơn hàng từ 50.000đ</p>
              <button onClick={() => setPage('menu')}>Nhận ưu đãi</button>
            </div>
          </div>

          <div className="combo-card">
            <div className="combo-header">
              <h3>Combo nổi bật</h3>
              <button onClick={() => setPage('menu')}>Xem tất cả</button>
            </div>
            <div className="combo-box">
              <div className="combo-info-row">
                <div>
                  <p>Combo Trưa Năng Lượng</p>
                  <div>
                    <strong>45.000đ</strong>
                    <span>55.000đ</span>
                  </div>
                </div>
                <div className="combo-sale">
                  <small>Giảm</small>
                  15%
                </div>
              </div>
              <div className="combo-items">
                <ComboItem img={comPhan} />
                <span>+</span>
                <ComboItem img={bunPho} />
                <span>+</span>
                <ComboItem img={doUong} />
              </div>
              <button className="combo-btn" onClick={() => setPage('menu')}>Chọn combo</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; onViewAll: () => void; className?: string }> = ({ title, onViewAll, className }) => (
  <div className={`section-title-row ${className || ''}`}>
    <h2>{title}</h2>
    <button onClick={onViewAll}>Xem tất cả</button>
  </div>
);

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

const CategoryCard: React.FC<CategoryCardProps> = ({ img, title }) => (
  <button className="category-card">
    <img src={img} alt={title} />
    <span>{title}</span>
  </button>
);

const FoodCard: React.FC<FoodCardProps> = ({ img, name, desc, kcal, rate, price, hot }) => (
  <div className="home-food-card">
    <div className="food-image-wrap">
      <img src={img} alt={name} />
      {hot && <div className="hot-badge">HOT</div>}
      <button className="heart-btn" aria-label="Yêu thích">
        <Heart size={18} />
      </button>
    </div>
    <div className="food-content">
      <h3>{name}</h3>
      <p>{desc}</p>
      <div className="food-meta">
        <span>
          <Timer size={14} />
          {kcal}
        </span>
        <span className="rating">
          <Star size={15} fill="currentColor" />
          {rate}
        </span>
      </div>
      <div className="food-bottom">
        <strong>{price}</strong>
        <button aria-label="Thêm món">
          <Plus size={20} />
        </button>
      </div>
    </div>
  </div>
);

const StepCard: React.FC<StepCardProps> = ({ number, img, icon, imageFit = 'cover', title, desc }) => (
  <div className="step-card">
    {img ? <img src={img} alt={title} className={imageFit === 'contain' ? 'img-contain' : ''} /> : <div className="step-icon">{icon}</div>}
    <div className="step-number">{number}</div>
    <div>
      <p>{title}</p>
      <span>{desc}</span>
    </div>
  </div>
);

const ComboItem: React.FC<{ img: string }> = ({ img }) => (
  <div className="combo-item">
    <img src={img} alt="Combo" />
  </div>
);

export default CustomerHome;
