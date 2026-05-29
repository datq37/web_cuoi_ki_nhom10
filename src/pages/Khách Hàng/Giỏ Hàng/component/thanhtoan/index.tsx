import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import type { ThanhToanProps } from '@/services/Khách hàng/Giỏ hàng/thanhtoan/typing';
import { PAYMENT_METHODS } from '@/services/Khách hàng/Giỏ hàng/thanhtoan';
import './index.less';

const ThanhToan: React.FC<ThanhToanProps> = ({ payment, onSelect }) => {
    return (
        <div className="phanThanhToan">
            <div className="nhanPhan">
                <CreditCard size={25} />
                <span>Phương thức thanh toán</span>
            </div>

            <div className="tuyChonThanhToan">
                {PAYMENT_METHODS.map(m => (
                    <button
                        key={m.key}
                        className={`tuyChonTra ${payment === m.key ? 'hoatDong' : ''}`}
                        onClick={() => onSelect(m.key)}
                        aria-pressed={payment === m.key}
                    >
                        <span className="bieuTuongTra">{m.icon}</span>
                        <span className="nhanTra">{m.label}</span>
                        {payment === m.key && (
                            <span className="dauTichTra">
                                <Check size={22} />
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThanhToan;
