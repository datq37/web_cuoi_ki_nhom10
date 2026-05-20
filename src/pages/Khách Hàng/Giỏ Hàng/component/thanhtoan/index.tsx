import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import type { ThanhToanProps } from '@/services/Khách hàng/Giỏ hàng/thanhtoan/typing';
import { PAYMENT_METHODS } from '@/services/Khách hàng/Giỏ hàng/thanhtoan';
import './index.less';

const ThanhToan: React.FC<ThanhToanProps> = ({ payment, onSelect }) => {
    return (
        <div className="payment-section">
            <div className="section-label">
                <CreditCard size={25} />
                <span>Phương thức thanh toán</span>
            </div>

            <div className="payment-options">
                {PAYMENT_METHODS.map(m => (
                    <button
                        key={m.key}
                        className={`pay-opt ${payment === m.key ? 'active' : ''}`}
                        onClick={() => onSelect(m.key)}
                        aria-pressed={payment === m.key}
                    >
                        <span className="pay-icon">{m.icon}</span>
                        <span className="pay-label">{m.label}</span>
                        {payment === m.key && (
                            <span className="pay-check">
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
