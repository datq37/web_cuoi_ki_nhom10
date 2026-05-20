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
            {/* ── Overlay backdrop ─────────────────────────────────────────── */}
            <div
                className={`cart-overlay ${cartOpen ? 'visible' : ''}`}
                onClick={() => setCartOpen(false)}
                aria-hidden="true"
            />

            {/* ── Drawer giỏ hàng ──────────────────────────────────────────── */}
            <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Giỏ hàng">
                {/* Header */}
                <div className="cart-drawer-header">
                    <button
                        className="cart-back-btn"
                        onClick={() => {
                            setCartOpen(false);
                            setPage('menu');
                        }}
                        aria-label="Quay lại thực đơn"
                    >
                        <ArrowLeft size={28} />
                    </button>

                    <div className="cart-drawer-title">
                        <ShoppingCart size={34} strokeWidth={2.4} />
                        <span>Giỏ hàng</span>
                        {cartQty > 0 && (
                            <span className="cart-badge">{cartQty}</span>
                        )}
                    </div>
                    <button
                        id="btn-close-cart"
                        className="cart-close-btn"
                        onClick={() => setCartOpen(false)}
                        aria-label="Đóng giỏ hàng"
                    >
                        <X size={30} />
                    </button>
                </div>

                {/* Nội dung cuộn được */}
                <div className="cart-drawer-body">
                    {/* 1. Danh sách món */}
                    <section className="cart-section">
                        <DanhSachMon />
                    </section>

                    {/* 2. Tuỳ chọn (giờ nhận, voucher, ghi chú) */}
                    <section className="cart-section">
                        <CartOption
                            note={note}
                            onChangeNote={setNote}
                            selectedVoucher={selectedVoucher}
                            onSelectVoucher={setSelectedVoucher}
                            subtotal={subtotal}
                        />
                    </section>

                    {/* 3. Phương thức thanh toán */}
                    <section className="cart-section">
                        <ThanhToan payment={payment} onSelect={setPayment} />
                    </section>
                </div>

                {/* Footer cố định: giá + nút xác nhận */}
                <div className="cart-drawer-footer">
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
