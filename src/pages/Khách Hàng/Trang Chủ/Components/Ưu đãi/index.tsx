import React, { useEffect, useState } from 'react';
import { Timer, Tag } from 'lucide-react';
import { message } from 'antd';
import { useModel } from 'umi';
import comPhan from '@/assets/Khách Hàng/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/Khách Hàng/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/Khách Hàng/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/Khách Hàng/Trang chủ/an_nhe_no_text.png';
import chayImg from '@/assets/Khách Hàng/Trang chủ/chay_salad_no_text.png';
import { OffersAndCombosProps } from '@/services/Khách hàng/Trang Chủ/typing';
import './index.less';

interface BestVoucher {
  ma: string;
  ten: string;
  loai: string;
  giaTriGiam: number;
  donToiThieu: number;
  foodImg: string;
  discountLabel: string;
  conditionLabel: string;
}

interface BestCombo {
  id: string;
  ten: string;
  giaTriGiam: number;
  loaiGia: string;
  originalPrice: number;
  discountedPrice: number;
  dishImages: string[];
  dishIds: string[];
}

// Chọn ảnh món ăn ngẫu nhiên thay đổi theo mã voucher
const FOOD_IMGS = [comPhan, bunPho, doUong, anNhe, chayImg];
function getFoodImgForVoucher(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return FOOD_IMGS[Math.abs(hash) % FOOD_IMGS.length];
}

function getBestVoucher(): BestVoucher | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('admin_vouchers');
  if (!saved) return null;
  try {
    const list: any[] = JSON.parse(saved);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const active = list.filter((k: any) => {
      if (!k.hoatDong) return false;
      if (k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
      if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
      if (k.hetHan) {
        const parts = k.hetHan.split('/');
        if (parts.length === 3) {
          const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          if (exp < today) return false;
        }
      }
      return true;
    });

    if (active.length === 0) return null;

    // Tính giá trị thực: phan_tram dùng % (1 = 1%), so_tien dùng VND
    const scored = active.map((k: any) => ({
      ...k,
      score: k.loai === 'phan_tram' ? k.giaTriGiam * 1000 : k.giaTriGiam,
    }));
    scored.sort((a: any, b: any) => b.score - a.score);
    const best = scored[0];

    const discountLabel =
      best.loai === 'phan_tram'
        ? `Giảm ngay ${best.giaTriGiam}%`
        : best.loai === 'mien_ship'
        ? 'Miễn phí phục vụ'
        : `Giảm ngay ${Number(best.giaTriGiam).toLocaleString('vi-VN')}đ`;

    const conditionLabel =
      best.donToiThieu > 0
        ? `Áp dụng cho đơn hàng từ ${Number(best.donToiThieu).toLocaleString('vi-VN')}đ`
        : 'Áp dụng cho mọi đơn hàng';

    return {
      ma: best.ma,
      ten: best.ten,
      loai: best.loai,
      giaTriGiam: best.giaTriGiam,
      donToiThieu: best.donToiThieu || 0,
      foodImg: getFoodImgForVoucher(best.id),
      discountLabel,
      conditionLabel,
    };
  } catch {
    return null;
  }
}

function getBestCombo(): BestCombo | null {
  if (typeof window === 'undefined') return null;
  const comboSaved = localStorage.getItem('admin_combos');
  const dishSaved = localStorage.getItem('admin_dishes');
  if (!comboSaved || !dishSaved) return null;

  try {
    const comboList: any[] = JSON.parse(comboSaved);
    const dishList: any[] = JSON.parse(dishSaved);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeCombos = comboList.filter((c: any) => {
      if (!c.hoatDong) return false;
      if (c.trangThai === 'het_han' || c.trangThai === 'tam_dung') return false;
      if (c.hetHan) {
        const parts = c.hetHan.split('/');
        if (parts.length === 3) {
          const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          if (exp < today) return false;
        }
      }
      return true;
    });

    if (activeCombos.length === 0) return null;

    // Lấy combo đầu tiên
    const best = activeCombos[0];
    
    let originalPrice = 0;
    const dishImages: string[] = [];
    const dishIds: string[] = best.monAnIds || [];

    dishIds.forEach(id => {
       const dish = dishList.find((d: any) => d.id === id);
       if (dish) {
           originalPrice += dish.giaBan || 0;
           dishImages.push(dish.hinhAnh || getFoodImgForVoucher(dish.id));
       }
    });
    
    let discountedPrice = originalPrice;
    if (best.loaiGia === 'phan_tram') {
        discountedPrice = originalPrice - (originalPrice * best.giaTriGiam / 100);
    } else {
        discountedPrice = originalPrice - best.giaTriGiam;
    }

    return {
      id: best.id,
      ten: best.ten,
      giaTriGiam: best.giaTriGiam,
      loaiGia: best.loaiGia,
      originalPrice,
      discountedPrice,
      dishImages,
      dishIds
    };
  } catch {
    return null;
  }
}

// Countdown đến cuối ngày hôm nay
function useCountdown() {
  const getSecsLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  };
  const [secs, setSecs] = useState(getSecsLeft);
  useEffect(() => {
    const t = setInterval(() => setSecs(getSecsLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return { h, m, s };
}

const ComboItem: React.FC<{ img: string }> = ({ img }) => (
  <div className="combo-item">
    <img src={img} alt="Combo" />
  </div>
);

const OffersAndCombos: React.FC<OffersAndCombosProps> = ({ setPage }) => {
  const [best, setBest] = useState<BestVoucher | null>(() => getBestVoucher());
  const [bestCombo, setBestCombo] = useState<BestCombo | null>(() => getBestCombo());
  const { h, m, s } = useCountdown();
  const { addToCart } = useModel('Khách Hàng.Thực đơn.index');

  useEffect(() => {
    const reload = () => {
      setBest(getBestVoucher());
      setBestCombo(getBestCombo());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener('focus', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('focus', reload);
    };
  }, []);

  const handleAddComboToCart = () => {
    if (!bestCombo) return;
    
    try {
      const dishSaved = localStorage.getItem('admin_dishes');
      if (!dishSaved) return;
      const dishList: any[] = JSON.parse(dishSaved);
      
      let added = 0;
      bestCombo.dishIds.forEach(id => {
        const dishData = dishList.find((d: any) => d.id === id);
        if (dishData) {
          // Convert admin dish to customer Dish format
          let cat = 'main';
          if (dishData.danhMuc === 'do_uong') cat = 'drink';
          else if (dishData.danhMuc === 'an_vat') cat = 'snack';
          else if (dishData.danhMuc === 'mon_chay') cat = 'veg';
          else if (dishData.danhMuc === 'rice') cat = 'rice';
          else if (dishData.danhMuc === 'noodle') cat = 'noodle';

          const dish = {
            id: dishData.id,
            name: dishData.ten,
            cat: cat,
            price: dishData.giaBan,
            desc: dishData.moTa || '',
            emoji: dishData.emoji || (dishData.danhMuc === 'do_uong' ? '☕' : '🍱'),
            tags: dishData.isHot ? ['hot'] : [],
            rating: dishData.danhGia || 5,
            sold: dishData.sold || 0,
            prep: dishData.thoiGian || 10,
            kcal: dishData.calo || 0,
            ingredients: dishData.nguyenLieu || [],
            hinhAnh: dishData.hinhAnh,
          };
          
          addToCart(dish);
          added++;
        }
      });

      if (added > 0) {
        message.success(`Đã thêm combo ${bestCombo.ten} vào giỏ hàng!`);
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi thêm combo vào giỏ hàng");
    }
  };

  return (
    <aside className="home-main-right">
      <div className="daily-offer-card">
        {/* Hình ảnh món ăn liên quan đến ưu đãi tốt nhất */}
        <img
          src={best?.foodImg || comPhan}
          alt={best?.ten || 'Ưu đãi hôm nay'}
        />
        <div className="offer-content">
          <div className="offer-head">
            <h3>Ưu đãi hôm nay</h3>
            <span>
              <Timer size={14} />
              Kết thúc sau
            </span>
          </div>
          <div className="countdown">
            <b>{h}</b>
            <span>:</span>
            <b>{m}</b>
            <span>:</span>
            <b>{s}</b>
          </div>

          {best ? (
            <>
              <div className="offer-code-badge">
                <Tag size={13} />
                {best.ma}
              </div>
              <p className="offer-discount">{best.discountLabel}</p>
              <p className="offer-note">{best.conditionLabel}</p>
            </>
          ) : (
            <>
              <p className="offer-discount">Chưa có ưu đãi</p>
              <p className="offer-note">Admin chưa tạo mã giảm giá nào</p>
            </>
          )}

          <button onClick={() => setPage('menu')}>Nhận ưu đãi</button>
        </div>
      </div>

      <div className="combo-card">
        <div className="combo-header">
          <h3>Combo nổi bật</h3>
          <button onClick={() => setPage('menu')}>Xem tất cả</button>
        </div>
        {bestCombo ? (
          <div className="combo-box">
            <div className="combo-info-row">
              <div>
                <p>{bestCombo.ten}</p>
                <div>
                  <strong>{Number(bestCombo.discountedPrice).toLocaleString('vi-VN')}đ</strong>
                  <span>{Number(bestCombo.originalPrice).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              <div className="combo-sale" style={bestCombo.loaiGia !== 'phan_tram' ? { fontSize: '12px' } : undefined}>
                <small>Giảm</small>
                {bestCombo.loaiGia === 'phan_tram' ? `${bestCombo.giaTriGiam}%` : `${Number(bestCombo.giaTriGiam / 1000).toLocaleString('vi-VN')}k`}
              </div>
            </div>
            <div className="combo-items" style={{ gridTemplateColumns: `repeat(${bestCombo.dishImages.length * 2 - 1}, auto)`}}>
              {bestCombo.dishImages.map((img, idx) => (
                <React.Fragment key={idx}>
                  <ComboItem img={img} />
                  {idx < bestCombo.dishImages.length - 1 && <span>+</span>}
                </React.Fragment>
              ))}
            </div>
            <button className="combo-btn" onClick={handleAddComboToCart}>Chọn combo</button>
          </div>
        ) : (
          <div className="combo-box" style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#68747d' }}>Chưa có combo nào hoạt động</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OffersAndCombos;
