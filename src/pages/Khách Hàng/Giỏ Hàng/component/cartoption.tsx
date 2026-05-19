import React, { useState, useEffect } from 'react';
import {
    TagOutlined,
} from '@ant-design/icons';
import { CheckCircle, ChevronRight, Clock3, PencilLine, Tag, TicketPercent, Zap } from 'lucide-react';
import { Modal } from 'antd';
import { useModel } from 'umi';
import type { CartOptionProps } from '@/services/Khách hàng/Giỏ hàng/Cart Option/typing';
import { SEED_VOUCHERS } from '@/services/Khách hàng/Giỏ hàng/Cart Option/typing';
import { SEED_MENU } from '@/services/Khách hàng/Thực đơn';
import '../cartoption.less';

// ─── Tính giờ nhận tự động ────────────────────────────────────────────────────
// Logic: giờ hiện tại + prep_time_tối_đa_trong_giỏ + 5 phút buffer
const BUFFER_MIN = 5;

function calcPickupTime(cart: any[]): { timeStr: string; prepMin: number } {
    if (cart.length === 0) return { timeStr: '--:--', prepMin: 0 };

    const maxPrep = cart.reduce((max: number, item: any) => {
        const dish = SEED_MENU.find(d => d.id === item.id);
        return Math.max(max, dish?.prep ?? 0);
    }, 0);

    const totalMin = maxPrep + BUFFER_MIN;
    const ready = new Date(Date.now() + totalMin * 60 * 1000);

    const timeStr = ready.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return { timeStr, prepMin: totalMin };
}

// ─── Component ────────────────────────────────────────────────────────────────
const CartOption: React.FC<CartOptionProps> = ({
    note,
    onChangeNote,
    selectedVoucher,
    onSelectVoucher,
    subtotal,
}) => {
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const { cart } = useModel('Khách Hàng.Thực đơn.index');

    const [pickup, setPickup] = useState(() => calcPickupTime(cart));

    useEffect(() => {
        setPickup(calcPickupTime(cart));
        const timer = setInterval(() => setPickup(calcPickupTime(cart)), 60000);
        return () => clearInterval(timer);
    }, [cart]);

    const availableVouchers = SEED_VOUCHERS.filter(v => !v.minOrder || subtotal >= v.minOrder);
    const unavailableVouchers = SEED_VOUCHERS.filter(v => v.minOrder && subtotal < v.minOrder);

    const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(selectedVoucher?.id);

    useEffect(() => {
        if (isVoucherModalOpen) {
            setTempSelectedId(selectedVoucher?.id);
        }
    }, [isVoucherModalOpen, selectedVoucher]);

    const confirmSelection = () => {
        const v = SEED_VOUCHERS.find(x => x.id === tempSelectedId);
        onSelectVoucher(v);
        setIsVoucherModalOpen(false);
    };

    return (
        <div className="cart-options-container">
            {/* 1. Giờ nhận món — chỉ đọc, do hệ thống tính */}
            <div className="option-section">
                <div className="section-header">
                    <Clock3 size={25} />
                    <span>Giờ nhận món (dự kiến)</span>
                </div>
                <div className="pickup-time-display">
                    <div className="pickup-time-value">
                        <div className="pickup-icon-wrap">
                            <Zap size={36} className="pickup-icon" fill="currentColor" />
                        </div>
                        <span className="pickup-hhmm">{pickup.timeStr}</span>
                    </div>
                    {pickup.prepMin > 0 && (
                        <span className="pickup-note">
                            Khoảng {pickup.prepMin} phút kể từ lúc đặt
                        </span>
                    )}
                    <div className="pickup-leaf" aria-hidden="true">❧</div>
                </div>
            </div>

            {/* 2. Voucher */}
            <div className="option-section">
                <div className="section-header">
                    <Tag size={25} />
                    <span>Voucher giảm giá</span>
                </div>
                <div
                    className={`voucher-selector ${selectedVoucher ? 'has-value' : ''}`}
                    onClick={() => setIsVoucherModalOpen(true)}
                >
                    {cart.length === 0 ? (
                        <div className="placeholder">
                            <TicketPercent size={34} />
                            <span>Chọn Voucher</span>
                        </div>
                    ) : selectedVoucher ? (
                        <div className="selected-info">
                            <CheckCircle size={28} className="success-icon" />
                            <div className="text">
                                <strong>{selectedVoucher.code}</strong>
                                <span>- Đã áp dụng giảm {selectedVoucher.discount.toLocaleString()}đ</span>
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder">
                            <TicketPercent size={34} />
                            <span>Chọn Voucher</span>
                        </div>
                    )}
                    <ChevronRight size={28} className="arrow" />
                </div>
            </div>

            {/* 3. Ghi chú */}
            <div className="option-section">
                <div className="section-header">
                    <PencilLine size={25} />
                    <span>Ghi chú cho bếp</span>
                </div>
                <div className="note-wrap">
                    <textarea
                        className="note-textarea"
                        placeholder="Ví dụ: Ít cay, không hành, thêm cơm..."
                        value={note}
                        onChange={(e) => onChangeNote(e.target.value)}
                        rows={2}
                    />
                    <div className="note-leaf" aria-hidden="true">❧</div>
                </div>
            </div>

            {/* Modal danh sách Voucher giống thiết kế */}
            <Modal
                title={false}
                visible={isVoucherModalOpen}
                onCancel={() => setIsVoucherModalOpen(false)}
                footer={null}
                width={450}
                className="voucher-modal-custom"
                style={{ top: 40 }}
                getContainer={() => document.body}
            >
                <div className="vm-header">
                    <button className="vm-back" onClick={() => setIsVoucherModalOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <h2>Chọn Voucher</h2>
                </div>

                <div className="vm-body">
                    {availableVouchers.length > 0 && (
                        <div className="vm-section">
                            <h3 className="vm-section-title">Voucher khả dụng</h3>
                            {availableVouchers.map(v => (
                                <div 
                                    key={v.id} 
                                    className={`vm-ticket ${tempSelectedId === v.id ? 'selected' : ''}`}
                                    onClick={() => setTempSelectedId(v.id)}
                                >
                                    <div className="vmt-left">
                                        <div className="vmt-icon">
                                            <TagOutlined style={{ fontSize: 24, marginBottom: 4 }} />
                                            <span>Mã giảm giá</span>
                                        </div>
                                    </div>
                                    <div className="vmt-right">
                                        <div className="vmt-info">
                                            <h4>{v.desc}</h4>
                                            {v.minOrder ? <p>Đơn từ {v.minOrder / 1000}k</p> : <p>Mọi đơn hàng</p>}
                                            <div className="vmt-meta">
                                                <span className="badge">Ưu đãi có hạn</span>
                                                <span className="date">HSD: 31.05.2026 <a>Điều kiện</a></span>
                                            </div>
                                        </div>
                                        <div className="vmt-radio">
                                            <div className="radio-circle">
                                                {tempSelectedId === v.id && <div className="radio-dot" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {unavailableVouchers.length > 0 && (
                        <div className="vm-section">
                            <h3 className="vm-section-title">Voucher không khả dụng</h3>
                            {unavailableVouchers.map(v => (
                                <div key={v.id} className="vm-ticket disabled">
                                    <div className="vmt-left">
                                        <div className="vmt-icon">
                                            <TagOutlined style={{ fontSize: 24, marginBottom: 4 }} />
                                            <span>Mã giảm giá</span>
                                        </div>
                                    </div>
                                    <div className="vmt-right">
                                        <div className="vmt-info">
                                            <h4>{v.desc}</h4>
                                            <p>Đơn từ {v.minOrder! / 1000}k</p>
                                            <div className="vmt-meta">
                                                <span className="badge">Ưu đãi có hạn</span>
                                                <span className="date">HSD: 31.05.2026 <a>Điều kiện</a></span>
                                            </div>
                                        </div>
                                        <div className="vmt-radio">
                                            <div className="radio-circle" />
                                        </div>
                                    </div>
                                    <div className="vmt-warning">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        <span>Chưa đạt giá trị đơn hàng tối thiểu</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="vm-footer">
                    <button className="vm-ok-btn" onClick={confirmSelection}>OK</button>
                </div>
            </Modal>
        </div>
    );
};

export default CartOption;
