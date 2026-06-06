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
import { Modal, Input, Button, Typography } from 'antd';
import { useModel } from 'umi';
import type { CartOptionProps } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { VoucherLoai, VoucherTheme } from '@/services/KhachHang/Giỏ hàng/cartoption/typing';
import { useCartOptionModel } from '@/models/KhachHang/Giỏ hàng/cartoption';
import voucherBanner from '@/assets/KhachHang/Vourcher/bannervourcher.png';
import { formatCurrency } from '@/utils/format';
import { showCustomerNotification } from '@/utils/notification';
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
    const { cart } = useModel('KhachHang.ThucDon.index');
    const { theme } = useModel('KhachHang.GlobalState.index');
    const hasComboSelected = cart.some((item: any) => item.comboId || item.isComboItem);
    const selectedVoucherValue = selectedVoucher?.giamGia ?? selectedVoucher?.discount ?? 0;

    const handleOpenVoucherModal = () => {
        if (hasComboSelected) {
            showCustomerNotification(
                'Không thể chọn voucher',
                'Bạn đã chọn combo nên không thể áp dụng thêm ưu đãi khác.',
                'error',
            );
            return;
        }
        setIsVoucherModalOpen(true);
    };

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
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <Clock3 size={25} />
                    <span>Giờ nhận món</span>
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
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <Tag size={25} />
                    <span>Voucher giảm giá</span>
                </div>
                <div
                    className={`boChonPhieuGiamGia ${selectedVoucher ? 'coGiaTri' : ''}`}
                    onClick={handleOpenVoucherModal}
                    style={hasComboSelected ? { opacity: 0.65, cursor: 'not-allowed' } : undefined}
                >
                    {hasComboSelected ? (
                        <div className="giuCho">
                            <TicketPercent size={34} />
                            <span>Combo đã áp dụng</span>
                        </div>
                    ) : cart.length === 0 ? (
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
                                        ? `- Giảm ${selectedVoucherValue}% đơn hàng`
                                        : selectedVoucher.loai === VoucherLoai.MienShip
                                        ? '- Miễn phí phục vụ'
                                        : `- Đã áp dụng giảm ${formatCurrency(selectedVoucherValue)}`}
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
            <div className="phanTuyChon">
                <div className="tieuDePhan">
                    <PencilLine size={25} />
                    <span>Ghi chú cho bếp</span>
                </div>
                <div className="bocGhiChu">
                    <Input.TextArea
                        className="vungVanBanGhiChu"
                        placeholder="Ví dụ: Ít cay, không hành, thêm cơm..."
                        value={note}
                        onChange={(e) => onChangeNote(e.target.value)}
                        rows={2}
                    />
                    <div className="laGhiChu" aria-hidden="true">❧</div>
                </div>
            </div>
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
                    <Button type="text" className="quayLaiMoDanPhieu" onClick={() => setIsVoucherModalOpen(false)} icon={<ArrowLeft size={21} />} />
                    <Typography.Title level={2} style={{ margin: 0, fontSize: 18 }}>Chọn Voucher</Typography.Title>
                    <Button type="text" className="dongMoDanPhieu" onClick={() => setIsVoucherModalOpen(false)} icon={<X size={21} />} />
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
                                <div
                                    key={v.id}
                                    className={`veMoDanPhieu ${v.theme === VoucherTheme.Orange ? 'veMoDanPhieuCam' : v.theme === VoucherTheme.Lime ? 'veMoDanPhieuChanh' : ''} ${tempSelectedId === v.id ? 'daChon' : ''}`}
                                    onClick={() => setTempSelectedId(v.id)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="traiVeMoDanPhieu">
                                        <div className="dauTraiVeMoDanPhieu" aria-hidden="true" />
                                        <div className="bieuTuongVeMoDanPhieu">
                                            {v.theme === VoucherTheme.Orange ? (
                                                <Timer size={22} />
                                            ) : (
                                                <Tag size={22} />
                                            )}
                                            <Typography.Text strong style={{ color: 'inherit' }}>{v.valueLabel || formatCurrency(v.giamGia ?? v.discount)}</Typography.Text>
                                            <span>{v.typeLabel || 'GIẢM GIÁ'}</span>
                                        </div>
                                    </div>
                                    <div className="phaiVeMoDanPhieu">
                                        <div className="thongTinVeMoDanPhieu">
                                            <h4>{v.desc}</h4>
                                            <Typography.Text>{formatCondition(v.minOrder)}</Typography.Text>
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
                                </div>
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
                                            <strong>{v.valueLabel || formatCurrency(v.giamGia ?? v.discount)}</strong>
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
                    <Button className="nutDongYMoDanPhieu" onClick={confirmSelection} icon={<TicketPercent size={18} />}>
                        Áp dụng Voucher
                    </Button>
                    <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                        <CheckCircle2 size={12} />
                        Voucher chỉ áp dụng 1 lần cho mỗi đơn hàng
                    </Typography.Text>
                </div>
            </Modal>
        </div>
    );
};

export default CartOption;
