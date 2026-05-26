import React from 'react';
import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import type { CartFooterProps } from '@/services/Khách hàng/Giỏ hàng/cartfooter/typing';
import { SERVICE_FEE_LABEL } from '@/services/Khách hàng/Giỏ hàng/cartfooter';
import { useCartFooterModel } from '@/models/Khách Hàng/Giỏ hàng/cartfooter';
import './index.less';

// ─── Helper format tiền VND ───────────────────────────────────────────────────
const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// ─── Component ────────────────────────────────────────────────────────────────
const CartFooter: React.FC<CartFooterProps> = ({
    selectedVoucher,
    onConfirm,
    isLoading = false,
}) => {
    const {
        subtotal,
        serviceFee,
        discount,
        voucherDiscount,
        comboDiscount,
        total,
        isEmpty,
        voucherNotMet,
    } = useCartFooterModel(selectedVoucher);

    return (
        <div className="cart-footer">
            {/* ── Bảng chi tiết giá ─────────────────────────────────────── */}
            <div className="price-breakdown">
                {/* Tạm tính */}
                <div className="price-row">
                    <span className="price-label">Tạm tính</span>
                    <span className="price-value">{fmtVND(subtotal)}</span>
                </div>

                {/* Phụ phí phục vụ */}
                <div className="price-row">
                    <span className="price-label">{SERVICE_FEE_LABEL}</span>
                    <span className="price-value fee">+{fmtVND(serviceFee)}</span>
                </div>

                {/* Giảm giá Combo */}
                {comboDiscount > 0 && (
                    <div className="price-row voucher-row">
                        <span className="price-label">
                            Combo Nổi Bật
                        </span>
                        <span className="price-value discount">-{fmtVND(comboDiscount)}</span>
                    </div>
                )}

                {/* Khuyến mãi / Voucher */}
                {selectedVoucher && (
                    <div className={`price-row voucher-row ${voucherNotMet ? 'disabled' : ''}`}>
                        <span className="price-label">
                            Mã Giảm Giá
                            <span className="voucher-badge">{selectedVoucher.code}</span>
                        </span>
                        {voucherNotMet ? (
                            <span className="price-value warn">
                                <CircleAlert size={15} />
                                &nbsp;Chưa đủ {fmtVND(selectedVoucher.minOrder!)}
                            </span>
                        ) : (
                            <span className="price-value discount">-{fmtVND(voucherDiscount)}</span>
                        )}
                    </div>
                )}

                {/* Đường kẻ phân cách */}
                <div className="price-divider" />

                {/* Tổng thanh toán */}
                <div className="price-row total-row">
                    <span className="total-label">Tổng thanh toán</span>
                    <span className="total-value">{fmtVND(total)}</span>
                </div>
            </div>

            {/* ── Nút xác nhận ──────────────────────────────────────────── */}
            <button
                id="btn-confirm-order"
                className={`confirm-btn ${isEmpty ? 'disabled' : ''}`}
                onClick={onConfirm}
                disabled={isEmpty || isLoading}
                aria-label="Xác nhận đặt món"
            >
                {isLoading ? (
                    <>
                        <LoaderCircle className="spin-icon" size={24} />
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                    <>
                        <Check size={32} />
                        <span>{isEmpty ? 'Giỏ hàng trống' : `Xác nhận · ${fmtVND(total)}`}</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default CartFooter;
