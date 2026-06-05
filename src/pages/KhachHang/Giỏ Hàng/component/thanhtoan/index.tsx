import React from 'react';
import { Typography } from 'antd';
import { Check, CreditCard } from 'lucide-react';
import type { ThanhToanProps } from '@/services/KhachHang/Giỏ hàng/thanhtoan/typing';
import { PAYMENT_METHODS } from '@/services/KhachHang/Giỏ hàng/thanhtoan';
import './index.less';

const ThanhToan: React.FC<ThanhToanProps> = ({ payment, onSelect }) => {
    return (
        <div className="phanThanhToan">
            <div className="nhanPhan">
                <CreditCard size={25} />
                <Typography.Text style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}>Phương thức thanh toán</Typography.Text>
            </div>

            <div className="tuyChonThanhToan">
                {PAYMENT_METHODS.map(m => (
                    <div
                        key={m.key}
                        className={`tuyChonTra ${payment === m.key ? 'hoatDong' : ''}`}
                        onClick={() => onSelect(m.key)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={payment === m.key}
                    >
                        <span className="bieuTuongTra">{m.icon}</span>
                        <Typography.Text className="nhanTra" style={{ color: 'inherit' }}>{m.label}</Typography.Text>
                        {payment === m.key && (
                            <span className="dauTichTra">
                                <Check size={22} />
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThanhToan;
