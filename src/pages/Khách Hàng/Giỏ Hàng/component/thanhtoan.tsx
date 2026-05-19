import React from 'react';
import { Check, CreditCard, QrCode, Wallet } from 'lucide-react';
import type { ThanhToanProps } from '@/services/Khách hàng/Giỏ hàng/Thanh toán/typing';
import './thanhtoan.less';

const PAYMENT_METHODS = [
    { key: 'cash', label: 'Tiền mặt', icon: <Wallet size={38} /> },
    { key: 'qr', label: 'QR / Bank', icon: <QrCode size={38} /> },
];

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
