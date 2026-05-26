import React, { useState } from 'react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    CheckCircle2,
    ChevronRight,
    Circle,
    Clock3,
    PencilLine,
    Tag,
    TicketPercent,
    Timer,
    X,
    Zap,
} from 'lucide-react';
import { Modal } from 'antd';
import { useModel } from 'umi';
import type { CartOptionProps } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { useCartOptionModel } from '@/models/Khách Hàng/Giỏ hàng/cartoption';
import voucherBanner from '@/assets/Khách Hàng/Vourcher/bannervourcher.png';
import './index.less';

const formatCondition = (minOrder?: number) => {
    if (!minOrder) return 'Mọi đơn hàng';
    return `Đơn từ ${minOrder / 1000}k`;
};

const CartOption: React.FC<CartOptionProps> = ({
    note,
    onChangeNote,
    selectedVoucher,
    onSelectVoucher,
    subtotal,
}) => {
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const { cart } = useModel('Khách Hàng.Thực đơn.index');
    const { theme } = useModel('Khách Hàng.global');

    const {
        pickup,
        availableVouchers,
        unavailableVouchers,
        tempSelectedId,
        setTempSelectedId,
        confirmSelection,
    } = useCartOptionModel(
        cart,
        subtotal,
        selectedVoucher,
        onSelectVoucher,
        isVoucherModalOpen,
        setIsVoucherModalOpen
    );

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

            {/* Modal danh sách Voucher */}
            <Modal
                title={false}
                visible={isVoucherModalOpen}
                onCancel={() => setIsVoucherModalOpen(false)}
                footer={null}
                width={520}
                className={`voucher-modal-custom theme-${theme}`}
                centered
                getContainer={() => document.body}
                closable={false}
            >
                <div className="vm-header">
                    <button className="vm-back" onClick={() => setIsVoucherModalOpen(false)}>
                        <ArrowLeft size={21} />
                    </button>
                    <h2>Chọn Voucher</h2>
                    <button className="vm-close" onClick={() => setIsVoucherModalOpen(false)}>
                        <X size={21} />
                    </button>
                </div>

                <div className="vm-body">
                    <div className="vm-banner">
                        <img src={voucherBanner} alt="Voucher khả dụng" />
                    </div>

                    {availableVouchers.length > 0 && (
                        <div className="vm-section">
                            <div className="vm-section-head">
                                <h3 className="vm-section-title">Danh sách voucher</h3>
                                <span>{availableVouchers.length} khả dụng</span>
                            </div>
                            {availableVouchers.map(v => (
                                <button
                                    key={v.id}
                                    type="button"
                                    className={`vm-ticket vm-ticket-${v.theme || 'green'} ${tempSelectedId === v.id ? 'selected' : ''}`}
                                    onClick={() => setTempSelectedId(v.id)}
                                >
                                    <div className="vmt-left">
                                        <div className="vmt-left-mark" aria-hidden="true" />
                                        <div className="vmt-icon">
                                            {v.theme === 'orange' ? (
                                                <Timer size={22} />
                                            ) : (
                                                <Tag size={22} />
                                            )}
                                            <strong>{v.valueLabel || `${v.discount.toLocaleString()}đ`}</strong>
                                            <span>{v.typeLabel || 'GIẢM GIÁ'}</span>
                                        </div>
                                    </div>
                                    <div className="vmt-right">
                                        <div className="vmt-info">
                                            <h4>{v.desc}</h4>
                                            <p>{formatCondition(v.minOrder)}</p>
                                            <div className="vmt-tags">
                                                <span className="badge">
                                                    <Timer size={11} />
                                                    {v.badge || 'Ưu đãi có hạn'}
                                                </span>
                                                <span className="code">{v.code}</span>
                                            </div>
                                            <div className="vmt-date">
                                                <span>
                                                    <CalendarDays size={11} />
                                                    HSD: {v.expire || '31.05.2026'}
                                                </span>
                                                <i />
                                                <a>Điều kiện</a>
                                            </div>
                                        </div>
                                        <div className="vmt-radio">
                                            {tempSelectedId === v.id ? (
                                                <CheckCircle2 size={20} />
                                            ) : (
                                                <Circle size={20} />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {unavailableVouchers.length > 0 && (
                        <div className="vm-section">
                            <h3 className="vm-section-title">Voucher không khả dụng</h3>
                            {unavailableVouchers.map(v => (
                                <div key={v.id} className={`vm-ticket vm-ticket-${v.theme || 'green'} disabled`}>
                                    <div className="vmt-left">
                                        <div className="vmt-left-mark" aria-hidden="true" />
                                        <div className="vmt-icon">
                                            <Tag size={22} />
                                            <strong>{v.valueLabel || `${v.discount.toLocaleString()}đ`}</strong>
                                            <span>{v.typeLabel || 'GIẢM GIÁ'}</span>
                                        </div>
                                    </div>
                                    <div className="vmt-right">
                                        <div className="vmt-info">
                                            <h4>{v.desc}</h4>
                                            <p>{formatCondition(v.minOrder)}</p>
                                            <div className="vmt-tags">
                                                <span className="badge">
                                                    <Timer size={11} />
                                                    {v.badge || 'Ưu đãi có hạn'}
                                                </span>
                                                <span className="code">{v.code}</span>
                                            </div>
                                            <div className="vmt-date">
                                                <span>
                                                    <CalendarDays size={11} />
                                                    HSD: {v.expire || '31.05.2026'}
                                                </span>
                                                <i />
                                                <a>Điều kiện</a>
                                            </div>
                                        </div>
                                        <div className="vmt-radio">
                                            <Circle size={20} />
                                        </div>
                                    </div>
                                    <div className="vmt-warning">
                                        <span>Chưa đạt giá trị đơn hàng tối thiểu</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="vm-footer">
                    <button className="vm-ok-btn" onClick={confirmSelection}>
                        <TicketPercent size={18} />
                        Áp dụng Voucher
                    </button>
                    <p>
                        <CheckCircle2 size={12} />
                        Voucher chỉ áp dụng 1 lần cho mỗi đơn hàng
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default CartOption;
