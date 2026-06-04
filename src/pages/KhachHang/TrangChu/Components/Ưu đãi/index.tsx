import React, { useEffect, useState } from 'react';
import { Timer, Tag } from 'lucide-react';
import { useModel } from 'umi';
import comPhan from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import bunPho from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import doUong from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import anNhe from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import chayImg from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';
import { OffersAndCombosProps } from '@/services/KhachHang/TrangChu/typing';
import { formatCurrency, formatNumberViVN } from '@/utils/format';
import './index.less';
import { showCustomerNotification } from '@/utils/notification';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { SyncAdapters } from '@/services/api/adapters';

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
  dishes: any[];
}

// chọn ảnh ngẫu nhiên
const FOOD_IMGS = [comPhan, bunPho, doUong, anNhe, chayImg];
function getFoodImgForVoucher(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return FOOD_IMGS[Math.abs(hash) % FOOD_IMGS.length];
}

function isActiveCombo(combo: any) {
  if (!combo.hoatDong) return false;
  if (combo.trangThai === 'het_han' || combo.trangThai === 'tam_dung') return false;
  if (!combo.hetHan) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parts = combo.hetHan.split('/');
  if (parts.length !== 3) return true;

  const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return exp >= today;
}

function buildBestCombo(comboList: any[], dishList: any[]): BestCombo | null {
  const activeCombos = comboList.filter(isActiveCombo);
  if (activeCombos.length === 0) return null;

  const best = activeCombos[0];
  const dishIds: string[] = best.monAnIds || [];
  const dishes = dishIds
    .map((id) => dishList.find((dish: any) => dish.id === id))
    .filter(Boolean);

  if (dishes.length === 0) return null;

  const originalPrice = dishes.reduce((sum, dish) => sum + (dish.giaBan || dish.price || 0), 0);
  const discountedPrice =
    best.loaiGia === 'phan_tram'
      ? Math.round(originalPrice * (1 - best.giaTriGiam / 100))
      : best.giaTriGiam;

  return {
    id: best.id,
    ten: best.ten,
    giaTriGiam: best.giaTriGiam,
    loaiGia: best.loaiGia,
    originalPrice,
    discountedPrice,
    dishImages: dishes.map((dish) => dish.hinhAnh || getFoodImgForVoucher(dish.id)),
    dishIds,
    dishes,
  };
}

// đếm ngược hết ngày
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

const ComboItem: React.FC<{ img: string; name: string }> = ({ img, name }) => (
  <div className="combo-item">
    <img src={img} alt={name} />
    <span>{name}</span>
  </div>
);

const OffersAndCombos: React.FC<OffersAndCombosProps> = ({ setPage }) => {
  const [best, setBest] = useState<BestVoucher | null>(null);
  const [bestCombo, setBestCombo] = useState<BestCombo | null>(null);
  const { h, m, s } = useCountdown();
  const { addToCart } = useModel('KhachHang.ThucDon.index');

  useEffect(() => {
    const reload = async () => {
      try {
        const res = await axios.get(`${ip3}/promotions/active`);
        if (res.data && res.data.items) {
          const list = res.data.items.map(SyncAdapters.mapAdminPromoToUI);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const active = list.filter((k: any) => {
            if (!k.hoatDong) return false;
            if (k.trangThai === 'het_han' || k.trangThai === 'tam_dung') return false;
            if (k.gioiHan && (k.daDung || 0) >= k.gioiHan) return false;
            if (k.hetHan) {
                let exp: Date;
                if (k.hetHan.includes('-')) {
                    exp = new Date(k.hetHan);
                } else {
                    const parts = k.hetHan.split('/');
                    if (parts.length === 3) {
                        exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                    } else {
                        exp = new Date(k.hetHan);
                    }
                }
                if (exp < today) return false;
            }
            return true;
          });

          if (active.length > 0) {
            const scored = active.map((k: any) => ({
              ...k,
              score: (k.loai === 'phan_tram' || k.loai === 'phan_tram') ? k.giaTriGiam * 1000 : k.giaTriGiam,
            }));
            scored.sort((a: any, b: any) => b.score - a.score);
            const top = scored[0];

            const discountLabel =
              (top.loai === 'phan_tram' || top.loai === 'phan_tram')
                ? `Giảm ngay ${top.giaTriGiam}%`
                : (top.loai === 'mien_ship' || top.loai === 'mien_ship')
                ? 'Miễn phí phục vụ'
                : `Giảm ngay ${formatCurrency(Number(top.giaTriGiam))}`;

            const conditionLabel =
              top.donToiThieu > 0
                ? `Áp dụng cho đơn từ ${formatCurrency(Number(top.donToiThieu))}`
                : 'Áp dụng cho mọi đơn hàng';

            setBest({
              ma: top.ma,
              ten: top.ten,
              loai: top.loai,
              giaTriGiam: top.giaTriGiam,
              donToiThieu: top.donToiThieu || 0,
              foodImg: getFoodImgForVoucher(top.id.toString()),
              discountLabel,
              conditionLabel,
            });
          } else {
            setBest(null);
          }
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const [comboRes, dishRes] = await Promise.all([
          axios.get(`${ip3}/combos`),
          axios.get(`${ip3}/menus/items?limit=200`),
        ]);
        const combos = (comboRes.data?.items || []).map(SyncAdapters.mapAdminComboToUI);
        const dishes = (dishRes.data?.items || []).map(SyncAdapters.mapAdminMenuToUI);
        setBestCombo(buildBestCombo(combos, dishes));
      } catch (err) {
        console.error(err);
        setBestCombo(null);
      }
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
    const selectedVoucher = typeof window !== 'undefined'
      ? localStorage.getItem('selected_customer_voucher')
      : null;
    if (selectedVoucher) {
      showCustomerNotification(
        'Không thể chọn combo',
        'Bạn đang áp dụng voucher. Hãy bỏ voucher trước khi chọn combo.',
        'error',
      );
      return;
    }

    try {
      let added = 0;
      bestCombo.dishes.forEach((dishData) => {
        addToCart({
          id: dishData.id,
          name: dishData.ten,
          cat: String(dishData.danhMuc || 'main'),
          price: dishData.giaBan,
          desc: dishData.moTa || '',
          emoji: dishData.emoji || '🍱',
          tags: dishData.isHot ? ['hot'] : [],
          rating: dishData.danhGia || 5,
          sold: dishData.sold || 0,
          prep: dishData.thoiGian || 10,
          kcal: dishData.calo || 0,
          ingredients: dishData.nguyenLieu || [],
          hinhAnh: dishData.hinhAnh,
          comboId: bestCombo.id,
          isComboItem: true,
        });
        added++;
      });

      if (added > 0) {
        showCustomerNotification(`Đã thêm combo ${bestCombo.ten} vào giỏ hàng!`, undefined, 'success');
      }
    } catch (e) {
      console.error(e);
      showCustomerNotification("Lỗi khi thêm combo vào giỏ hàng", undefined, 'error');
    }
  };

  return (
    <aside className="home-main-right">
      <div className="daily-offer-card">
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
                  <strong>{formatCurrency(Number(bestCombo.discountedPrice))}</strong>
                  <span>{formatCurrency(Number(bestCombo.originalPrice))}</span>
                </div>
              </div>
              <div className="combo-sale" style={bestCombo.loaiGia !== 'phan_tram' ? { fontSize: '12px' } : undefined}>
                <small>{bestCombo.loaiGia === 'phan_tram' ? 'Giảm' : 'Giá'}</small>
                {bestCombo.loaiGia === 'phan_tram' ? `${bestCombo.giaTriGiam}%` : `${formatNumberViVN(Number(bestCombo.giaTriGiam / 1000))}k`}
              </div>
            </div>
            <div className="combo-items">
              {bestCombo.dishImages.map((img, idx) => (
                <React.Fragment key={idx}>
                  <ComboItem img={img} name={bestCombo.dishes[idx]?.ten || 'Món ăn'} />
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
