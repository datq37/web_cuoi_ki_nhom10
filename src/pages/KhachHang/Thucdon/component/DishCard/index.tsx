import React from 'react';
import {
    Clock3,
    Minus,
    Plus,
    Star,
    Zap,
} from 'lucide-react';
import { Button, Typography } from 'antd';
import type { DishCardProps } from '@/services/KhachHang/ThucDon/DishCard/typing';
import riceImg from '@/assets/KhachHang/Trang chủ/com_phan_no_text.png';
import noodleImg from '@/assets/KhachHang/Trang chủ/bun_pho_no_text.png';
import saladImg from '@/assets/KhachHang/Trang chủ/chay_salad_no_text.png';
import snackImg from '@/assets/KhachHang/Trang chủ/an_nhe_no_text.png';
import drinkImg from '@/assets/KhachHang/Trang chủ/do_uong_no_text.png';
import phoImg from '@/assets/trangchu/pho.png';
import bunChaImg from '@/assets/trangchu/buncha.png';
import xoiImg from '@/assets/trangchu/xoi.png';
import { formatNumberViVN } from '@/utils/format';

const dishImages: Record<string, string> = {
    m1: riceImg,
    m2: phoImg,
    m3: bunChaImg,
    m4: riceImg,
    m5: saladImg,
    m6: xoiImg,
    m7: riceImg,
    m8: noodleImg,
    m9: saladImg,
    m10: snackImg,
    m11: drinkImg,
    m12: drinkImg,
};

const categoryFallbackImages: Record<string, string> = {
    rice: riceImg,
    noodle: noodleImg,
    veg: saladImg,
    snack: snackImg,
    drink: drinkImg,
    main: riceImg,
};

const DishCard: React.FC<DishCardProps> = ({ dish, qty, onAdd, onInc, onDec, onClick, isFuture }) => (
    <div className="theMonAn" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="hinhAnhMon">
            <img src={dish.hinhAnh || dishImages[dish.id] || categoryFallbackImages[dish.cat]} alt={dish.name} />
            <div className="danhSachNhan">
                {dish.tags.map(t => (
                    <span key={t} className={`nhanMon ${t}`}>{t.toUpperCase()}</span>
                ))}
            </div>
        </div>
        <div className="thanTheMon">
            <Typography.Title level={3} className="tenMon" style={{ margin: 0, color: 'inherit' }}>{dish.name}</Typography.Title>
            <Typography.Paragraph className="moTaMon" style={{ margin: 0 }}>{dish.desc}</Typography.Paragraph>
            <div className="thongTinMon">
                <span><Clock3 size={14} /> {dish.prep}m</span>
                <span><Zap size={14} /> {dish.kcal} kcal</span>
                <span className="danhGiaMon"><Star size={14} fill="currentColor" /> {dish.rating.toFixed(1)}</span>
            </div>
            <div className="phanChanThe">
                <div className="giaMon">
                    {formatNumberViVN(dish.price)} <Typography.Text className="donViTien" style={{ color: 'inherit' }}>đ</Typography.Text>
                </div>
                {isFuture ? (
                    <Typography.Text className="nhanChuaBan" onClick={(e) => e?.stopPropagation()}>Chưa mở bán</Typography.Text>
                ) : qty === 0 ? (
                    <Button 
                        type="primary" 
                        shape="circle" 
                        className="nutThemMon" 
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        icon={<Plus size={20} />}
                    />
                ) : (
                    <div className="soLuongMon" onClick={(e) => e.stopPropagation()}>
                        <Button type="text" shape="circle" onClick={onDec} icon={<Minus size={15} />} />
                        <Typography.Text strong style={{ color: 'inherit' }}>{qty}</Typography.Text>
                        <Button type="text" shape="circle" onClick={onInc} icon={<Plus size={15} />} />
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default DishCard;
