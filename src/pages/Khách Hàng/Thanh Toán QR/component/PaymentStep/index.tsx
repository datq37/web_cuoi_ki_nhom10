import React from 'react';
import { Check, CreditCard, ScanLine, Smartphone } from 'lucide-react';
import type { QRPaymentStep } from '@/services/Khách hàng/Thanh toán QR';

interface PaymentStepProps {
  step: QRPaymentStep;
  last?: boolean;
}

const ICONS: Record<QRPaymentStep['icon'], React.ReactNode> = {
  'bank-app': <Smartphone size={30} />,
  scan: <ScanLine size={30} />,
  card: <CreditCard size={30} />,
  success: <Check size={34} />,
};

const PaymentStep: React.FC<PaymentStepProps> = ({ step, last }) => (
  <div className="qr-payment-step">
    {!last && <div className="step-line" aria-hidden="true" />}

    <div className={`step-icon ${step.icon === 'success' ? 'success' : ''}`}>
      {ICONS[step.icon]}
      <span className="step-number">{step.stepNumber}</span>
    </div>

    <div className="step-content">
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
    </div>
  </div>
);

export default PaymentStep;
