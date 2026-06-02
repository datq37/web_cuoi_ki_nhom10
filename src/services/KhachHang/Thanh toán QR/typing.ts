export interface QRPaymentStep {
  id: string;
  stepNumber: number;
  icon: 'bank-app' | 'scan' | 'card' | 'success';
  title: string;
  desc: string;
}

export interface SupportedBank {
  id: string;
  name: string;
}
