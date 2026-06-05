import React from 'react';
import { Check, CreditCard, ScanLine, Smartphone } from 'lucide-react';
import { Typography } from 'antd';
import type { QRPaymentStep } from '@/services/KhachHang/Thanh toán QR';

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
      <Typography.Title level={3} style={{ margin: '0 0 4px', fontSize: 16 }}>{step.title}</Typography.Title>
      <Typography.Paragraph style={{ margin: 0, color: '#666' }}>{step.desc}</Typography.Paragraph>
    </div>
  </div>
);

export default PaymentStep;
