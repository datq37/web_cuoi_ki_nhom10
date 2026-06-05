import React from 'react';
import { Button, Tag, Typography } from 'antd';
import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import type { CartFooterProps } from '@/services/KhachHang/Giỏ hàng/cartfooter/typing';
import { SERVICE_FEE_LABEL } from '@/services/KhachHang/Giỏ hàng/cartfooter';
import { useCartFooterModel } from '@/models/KhachHang/Giỏ hàng/cartfooter';
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
                        <Typography.Text className="nhanGia">
                            Combo Nổi Bật
                        </Typography.Text>
                        <Typography.Text className="giaTriGia giamGia">-{formatCurrency(comboDiscount)}</Typography.Text>
                    </div>
                )}
                {selectedVoucher && (
                    <div className={`hangGia hangPhieuGiamGia ${voucherNotMet ? 'voHieuHoa' : ''}`}>
                        <span className="nhanGia">
                            Mã Giảm Giá
                            <Tag className="huyHieuPhieuGiamGia" style={{ border: 'none', margin: '0 0 0 6px' }}>{selectedVoucher.code}</Tag>
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
                    <Typography.Text className="nhanTongCong">Tổng thanh toán</Typography.Text>
                    <Typography.Text className="giaTriTongCong">{formatCurrency(total)}</Typography.Text>
                </div>
            </div>
            <Button
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
            </Button>
        </div>
    );
};

export default CartFooter;
