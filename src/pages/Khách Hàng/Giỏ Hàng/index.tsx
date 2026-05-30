import React from 'react';
import { ArrowLeft, ShoppingCart, X } from 'lucide-react';
import DanhSachMon from './component/danhsachmon';
import CartOption from './component/cartoption';
import ThanhToan from './component/thanhtoan';
import CartFooter from './component/cartfooter';
import { useGioHangModel } from '@/models/Khách Hàng/Giỏ hàng';
import './index.less';

const GioHang: React.FC = () => {
    const {
        cartOpen,
        setCartOpen,
        note,
        setNote,
        selectedVoucher,
        setSelectedVoucher,
        payment,
        setPayment,
        isLoading,
        cartQty,
        subtotal,
        handleConfirm,
        setPage,
    } = useGioHangModel();

    return (
        <>
            <div
                className={`lopPhuGioHang ${cartOpen ? 'hienThi' : ''}`}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
            />
            <aside className={`nganKeoGioHang ${cartOpen ? 'mo' : ''}`} aria-label="Giỏ hàng">
                <div className="phanDauNganKeoGioHang">
                    <button
                        className="nutQuayLaiGioHang"
                        onClick={() => {
                            setCartOpen(false);
                            setPage('menu');
                        }}
                        aria-label="Quay lại thực đơn"
                    >
                        <ArrowLeft size={28} />
                    </button>

                    <div className="tieuDeNganKeoGioHang">
                        <ShoppingCart size={34} strokeWidth={2.4} />
                        <span>Giỏ hàng</span>
                        {cartQty > 0 && (
                            <span className="huyHieuGioHang">{cartQty}</span>
                        )}
                    </div>
                    <button
                        id="btn-close-cart"
                        className="nutDongGioHang"
                        onClick={() => setCartOpen(false)}
                        aria-label="Đóng giỏ hàng"
                    >
                        <X size={30} />
                    </button>
                </div>
                <div className="phanThanNganKeoGioHang">
                    <section className="phanGioHang">
                        <DanhSachMon />
                    </section>
                    <section className="phanGioHang">
                        <CartOption
                            note={note}
                            onChangeNote={setNote}
                            selectedVoucher={selectedVoucher}
                            onSelectVoucher={setSelectedVoucher}
                            subtotal={subtotal}
                        />
                    </section>
                    <section className="phanGioHang">
                        <ThanhToan payment={payment} onSelect={setPayment} />
                    </section>
                </div>
                <div className="phanChanNganKeoGioHang">
                    <CartFooter
                        selectedVoucher={selectedVoucher}
                        onConfirm={handleConfirm}
                        isLoading={isLoading}
                    />
                </div>
            </aside>
        </>
    );
};

export default GioHang;
