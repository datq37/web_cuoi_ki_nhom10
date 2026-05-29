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
        giamGia,
        voucherDiscount,
        comboDiscount,
        total,
        isEmpty,
        voucherNotMet,
    } = useCartFooterModel(selectedVoucher);

    return (
        <div className="chanGioHang">
            {/* ── Bảng chi tiết giá ─────────────────────────────────────── */}
            <div className="chiTietGia">
                {/* Tạm tính */}
                <div className="hangGia">
                    <span className="nhanGia">Tạm tính</span>
                    <span className="giaTriGia">{fmtVND(subtotal)}</span>
                </div>

                {/* Phụ phí phục vụ */}
                <div className="hangGia">
                    <span className="nhanGia">{SERVICE_FEE_LABEL}</span>
                    <span className="giaTriGia phi">+{fmtVND(serviceFee)}</span>
                </div>

                {/* Giảm giá Combo */}
                {comboDiscount > 0 && (
                    <div className="hangGia hangPhieuGiamGia">
                        <span className="nhanGia">
                            Combo Nổi Bật
                        </span>
                        <span className="giaTriGia giamGia">-{fmtVND(comboDiscount)}</span>
                    </div>
                )}

                {/* Khuyến mãi / Voucher */}
                {selectedVoucher && (
                    <div className={`hangGia hangPhieuGiamGia ${voucherNotMet ? 'voHieuHoa' : ''}`}>
                        <span className="nhanGia">
                            Mã Giảm Giá
                            <span className="huyHieuPhieuGiamGia">{selectedVoucher.code}</span>
                        </span>
                        {voucherNotMet ? (
                            <span className="giaTriGia canhBao">
                                <CircleAlert size={15} />
                                &nbsp;Chưa đủ {fmtVND(selectedVoucher.minOrder!)}
                            </span>
                        ) : (
                            <span className="giaTriGia giamGia">-{fmtVND(voucherDiscount)}</span>
                        )}
                    </div>
                )}

                {/* Đường kẻ phân cách */}
                <div className="duongChiaGia" />

                {/* Tổng thanh toán */}
                <div className="hangGia hangTongCong">
                    <span className="nhanTongCong">Tổng thanh toán</span>
                    <span className="giaTriTongCong">{fmtVND(total)}</span>
                </div>
            </div>

            {/* ── Nút xác nhận ──────────────────────────────────────────── */}
            <button
                id="btn-confirm-order"
                className={`nutXacNhan ${isEmpty ? 'voHieuHoa' : ''}`}
                onClick={onConfirm}
                disabled={isEmpty || isLoading}
                aria-label="Xác nhận đặt món"
            >
                {isLoading ? (
                    <>
                        <LoaderCircle className="bieuTuongXoay" size={24} />
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
