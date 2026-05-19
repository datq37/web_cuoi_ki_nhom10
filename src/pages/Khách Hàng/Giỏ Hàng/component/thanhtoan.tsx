import React from 'react';
import { ThanhToanProps } from '@/services/Khách hàng/Giỏ hàng/Thanh toán/typing';
import { PAYMENT_METHODS } from '@/services/Khách hàng/Giỏ hàng/thanhtoan';



import './thanhtoan.less';

const ThanhToan: React.FC<ThanhToanProps> = ({ payment, onSelect }) => {
    return (
        <div className="payment-section">
            <div className="section-label">Phương thức thanh toán</div>

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
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThanhToan;
