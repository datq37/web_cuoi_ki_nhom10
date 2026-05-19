import React from 'react';
import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import { useModel } from 'umi';
import type { Voucher } from '@/services/Khách hàng/Giỏ hàng/Cart Option/typing';
import '../cartfooter.less';

// ─── Hằng số phụ phí phục vụ ─────────────────────────────────────────────────
const SERVICE_FEE_RATE = 0.05; // 5% phụ phí phục vụ
const SERVICE_FEE_LABEL = 'Phụ phí phục vụ (5%)';

// ─── Helper format tiền VND ───────────────────────────────────────────────────
const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface CartFooterProps {
    selectedVoucher?: Voucher;
    onConfirm: () => void;
    isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
const CartFooter: React.FC<CartFooterProps> = ({
    selectedVoucher,
    onConfirm,
    isLoading = false,
}) => {
    // Lấy giỏ hàng từ model
    const { cart } = useModel('Khách Hàng.Thực đơn.index');

    // ── Tính toán giá ──────────────────────────────────────────────────────────
    const subtotal: number = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.qty,
        0,
    );

    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

    const discount = (() => {
        if (!selectedVoucher) return 0;
        if (selectedVoucher.minOrder && subtotal < selectedVoucher.minOrder) return 0;
        return selectedVoucher.discount;
    })();

    const total = Math.max(0, subtotal + serviceFee - discount);

    const isEmpty = cart.length === 0;

    // Kiểm tra voucher không đủ điều kiện
    const voucherNotMet =
        !!selectedVoucher &&
        !!selectedVoucher.minOrder &&
        subtotal < selectedVoucher.minOrder;

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

                {/* Khuyến mãi / Voucher */}
                {selectedVoucher && (
                    <div className={`price-row voucher-row ${voucherNotMet ? 'disabled' : ''}`}>
                        <span className="price-label">
                            Giảm giá
                            <span className="voucher-badge">{selectedVoucher.code}</span>
                        </span>
                        {voucherNotMet ? (
                            <span className="price-value warn">
                                <CircleAlert size={15} />
                                &nbsp;Chưa đủ {fmtVND(selectedVoucher.minOrder!)}
                            </span>
                        ) : (
                            <span className="price-value discount">-{fmtVND(discount)}</span>
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
