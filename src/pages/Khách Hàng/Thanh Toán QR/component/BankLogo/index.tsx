import React from 'react';
import type { SupportedBank } from '@/services/Khách hàng/Thanh toán QR';

interface BankLogoProps {
  bank: SupportedBank;
}

const BankLogo: React.FC<BankLogoProps> = ({ bank }) => (
  <div className={`qr-bank-logo bank-${bank.id}`}>
    {bank.name}
  </div>
);

export default BankLogo;
