import React from 'react';
import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import type { CartFooterProps } from '@/services/Khách hàng/Giỏ hàng/cartfooter/typing';
import { SERVICE_FEE_LABEL } from '@/services/Khách hàng/Giỏ hàng/cartfooter';
import { useCartFooterModel } from '@/models/Khách Hàng/Giỏ hàng/cartfooter';
import { formatCurrency } from '@/utils/format';
import './index.less';

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
            <div className="chiTietGia">
                <div className="hangGia">
                    <span className="nhanGia">Tạm tính</span>
                    <span className="giaTriGia">{formatCurrency(subtotal)}</span>
                </div>
                <div className="hangGia">
                    <span className="nhanGia">{SERVICE_FEE_LABEL}</span>
                    <span className="giaTriGia phi">+{formatCurrency(serviceFee)}</span>
                </div>
                {comboDiscount > 0 && (
                    <div className="hangGia hangPhieuGiamGia">
                        <span className="nhanGia">
                            Combo Nổi Bật
                        </span>
                        <span className="giaTriGia giamGia">-{formatCurrency(comboDiscount)}</span>
                    </div>
                )}
                {selectedVoucher && (
                    <div className={`hangGia hangPhieuGiamGia ${voucherNotMet ? 'voHieuHoa' : ''}`}>
                        <span className="nhanGia">
                            Mã Giảm Giá
                            <span className="huyHieuPhieuGiamGia">{selectedVoucher.code}</span>
                        </span>
                        {voucherNotMet ? (
                            <span className="giaTriGia canhBao">
                                <CircleAlert size={15} />
                                &nbsp;Chưa đủ {formatCurrency(selectedVoucher.minOrder!)}
                            </span>
                        ) : (
                            <span className="giaTriGia giamGia">-{formatCurrency(voucherDiscount)}</span>
                        )}
                    </div>
                )}
                <div className="duongChiaGia" />
                <div className="hangGia hangTongCong">
                    <span className="nhanTongCong">Tổng thanh toán</span>
                    <span className="giaTriTongCong">{formatCurrency(total)}</span>
                </div>
            </div>
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
                        <span>{isEmpty ? 'Giỏ hàng trống' : `Xác nhận · ${formatCurrency(total)}`}</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default CartFooter;
