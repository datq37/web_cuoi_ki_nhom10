import React from 'react';
import { Timer } from 'lucide-react';
import bannerHome from '@/assets/Khách Hàng/Trang chủ/banner trang chủ.png';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import { OffersAndCombosProps } from '@/services/Khách hàng/Trang Chủ/typing';
import './index.less';

const ComboItem: React.FC<{ img: string }> = ({ img }) => (
  <div className="combo-item">
    <img src={img} alt="Combo" />
  </div>
);

const OffersAndCombos: React.FC<OffersAndCombosProps> = ({ setPage }) => {
  return (
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
  );
};

export default OffersAndCombos;
