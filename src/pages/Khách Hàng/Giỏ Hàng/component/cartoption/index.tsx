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
import type { CartOptionProps, Voucher } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
import { VoucherLoai, VoucherTheme } from '@/services/Khách hàng/Giỏ hàng/cartoption/typing';
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
        <div className="thungChuaTuyChonGioHang">
            {/* 1. Giờ nhận món — chỉ đọc, do hệ thống tính */}
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <Clock3 size={25} />
                    <span>Giờ nhận món (dự kiến)</span>
                </div>
                <div className="hienThiThoiGianLay">
                    <div className="giaTriThoiGianLay">
                        <div className="bocBieuTuongLay">
                            <Zap size={36} className="bieuTuongLay" fill="currentColor" />
                        </div>
                        <span className="gioPhutLay">{pickup.timeStr}</span>
                    </div>
                    {pickup.prepMin > 0 && (
                        <span className="ghiChuLay">
                            Khoảng {pickup.prepMin} phút kể từ lúc đặt
                        </span>
                    )}
                    <div className="laLay" aria-hidden="true">❧</div>
                </div>
            </div>

            {/* 2. Voucher */}
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <Tag size={25} />
                    <span>Voucher giảm giá</span>
                </div>
                <div
                    className={`boChonPhieuGiamGia ${selectedVoucher ? 'coGiaTri' : ''}`}
                    onClick={() => setIsVoucherModalOpen(true)}
                >
                    {cart.length === 0 ? (
                        <div className="giuCho">
                            <TicketPercent size={34} />
                            <span>Chọn Voucher</span>
                        </div>
                    ) : selectedVoucher ? (
                        <div className="thongTinDaChon">
                            <CheckCircle size={28} className="bieuTuongThanhCong" />
                            <div className="vanBan">
                                <strong>{selectedVoucher.code}</strong>
                                <span>
                                    {selectedVoucher.loai === VoucherLoai.PhanTram
                                        ? `- Giảm ${selectedVoucher.giamGia}% đơn hàng`
                                        : selectedVoucher.loai === VoucherLoai.MienShip
                                        ? '- Miễn phí phục vụ'
                                        : `- Đã áp dụng giảm ${selectedVoucher.giamGia.toLocaleString()}đ`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="giuCho">
                            <TicketPercent size={34} />
                            <span>Chọn Voucher</span>
                        </div>
                    )}
                    <ChevronRight size={28} className="muiTen" />
                </div>
            </div>

            {/* 3. Ghi chú */}
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <PencilLine size={25} />
                    <span>Ghi chú cho bếp</span>
                </div>
                <div className="bocGhiChu">
                    <textarea
                        className="vungVanBanGhiChu"
                        placeholder="Ví dụ: Ít cay, không hành, thêm cơm..."
                        value={note}
                        onChange={(e) => onChangeNote(e.target.value)}
                        rows={2}
                    />
                    <div className="laGhiChu" aria-hidden="true">❧</div>
                </div>
            </div>

            {/* Modal danh sách Voucher */}
            <Modal
                title={false}
                visible={isVoucherModalOpen}
                onCancel={() => setIsVoucherModalOpen(false)}
                footer={null}
                width={520}
                className={`moDanPhieuGiamGiaTuyChinh theme-${theme}`}
                centered
                getContainer={() => document.body}
                closable={false}
            >
                <div className="phanDauMoDanPhieu">
                    <button className="quayLaiMoDanPhieu" onClick={() => setIsVoucherModalOpen(false)}>
                        <ArrowLeft size={21} />
                    </button>
                    <h2>Chọn Voucher</h2>
                    <button className="dongMoDanPhieu" onClick={() => setIsVoucherModalOpen(false)}>
                        <X size={21} />
                    </button>
                </div>

                <div className="phanThanMoDanPhieu">
                    <div className="bangRonMoDanPhieu">
                        <img src={voucherBanner} alt="Voucher khả dụng" />
                    </div>

                    {availableVouchers.length > 0 && (
                        <div className="phanMoDanPhieu">
                            <div className="dauPhanMoDanPhieu">
                                <h3 className="tieuDePhanMoDanPhieu">Danh sách voucher</h3>
                                <span>{availableVouchers.length} khả dụng</span>
                            </div>
                            {availableVouchers.map(v => (
                                <button
                                    key={v.id}
                                    type="button"
                                    className={`veMoDanPhieu ${v.theme === VoucherTheme.Orange ? 'veMoDanPhieuCam' : v.theme === VoucherTheme.Lime ? 'veMoDanPhieuChanh' : ''} ${tempSelectedId === v.id ? 'daChon' : ''}`}
                                    onClick={() => setTempSelectedId(v.id)}
                                >
                                    <div className="traiVeMoDanPhieu">
                                        <div className="dauTraiVeMoDanPhieu" aria-hidden="true" />
                                        <div className="bieuTuongVeMoDanPhieu">
                                            {v.theme === VoucherTheme.Orange ? (
                                                <Timer size={22} />
                                            ) : (
                                                <Tag size={22} />
                                            )}
                                            <strong>{v.valueLabel || `${v.giamGia.toLocaleString()}đ`}</strong>
                                            <span>{v.typeLabel || 'GIẢM GIÁ'}</span>
                                        </div>
                                    </div>
                                    <div className="phaiVeMoDanPhieu">
                                        <div className="thongTinVeMoDanPhieu">
                                            <h4>{v.desc}</h4>
                                            <p>{formatCondition(v.minOrder)}</p>
                                            <div className="theVeMoDanPhieu">
                                                <span className="huyHieu">
                                                    <Timer size={11} />
                                                    {v.huyHieu || 'Ưu đãi có hạn'}
                                                </span>
                                                <span className="code">{v.code}</span>
                                            </div>
                                            <div className="ngayVeMoDanPhieu">
                                                <span>
                                                    <CalendarDays size={11} />
                                                    HSD: {v.expire || '31.05.2026'}
                                                </span>
                                                <i />
                                                <a>Điều kiện</a>
                                            </div>
                                        </div>
                                        <div className="tuyChonVeMoDanPhieu">
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
                        <div className="phanMoDanPhieu">
                            <h3 className="tieuDePhanMoDanPhieu">Voucher không khả dụng</h3>
                            {unavailableVouchers.map(v => (
                                <div key={v.id} className={`veMoDanPhieu ${v.theme === VoucherTheme.Orange ? 'veMoDanPhieuCam' : v.theme === VoucherTheme.Lime ? 'veMoDanPhieuChanh' : ''} voHieuHoa`}>
                                    <div className="traiVeMoDanPhieu">
                                        <div className="dauTraiVeMoDanPhieu" aria-hidden="true" />
                                        <div className="bieuTuongVeMoDanPhieu">
                                            <Tag size={22} />
                                            <strong>{v.valueLabel || `${v.giamGia.toLocaleString()}đ`}</strong>
                                            <span>{v.typeLabel || 'GIẢM GIÁ'}</span>
                                        </div>
                                    </div>
                                    <div className="phaiVeMoDanPhieu">
                                        <div className="thongTinVeMoDanPhieu">
                                            <h4>{v.desc}</h4>
                                            <p>{formatCondition(v.minOrder)}</p>
                                            <div className="theVeMoDanPhieu">
                                                <span className="huyHieu">
                                                    <Timer size={11} />
                                                    {v.huyHieu || 'Ưu đãi có hạn'}
                                                </span>
                                                <span className="code">{v.code}</span>
                                            </div>
                                            <div className="ngayVeMoDanPhieu">
                                                <span>
                                                    <CalendarDays size={11} />
                                                    HSD: {v.expire || '31.05.2026'}
                                                </span>
                                                <i />
                                                <a>Điều kiện</a>
                                            </div>
                                        </div>
                                        <div className="tuyChonVeMoDanPhieu">
                                            <Circle size={20} />
                                        </div>
                                    </div>
                                    <div className="canhBaoVeMoDanPhieu">
                                        <span>Chưa đạt giá trị đơn hàng tối thiểu</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="phanChanMoDanPhieu">
                    <button className="nutDongYMoDanPhieu" onClick={confirmSelection}>
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
