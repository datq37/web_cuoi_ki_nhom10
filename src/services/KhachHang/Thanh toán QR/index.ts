import type { QRPaymentStep, SupportedBank } from './typing';

export const QR_PAYMENT_EXPIRE_SECONDS = 10 * 60;

export const QR_PAYMENT_STEPS: QRPaymentStep[] = [
  {
    id: 'bank-app',
    stepNumber: 1,
    icon: 'bank-app',
    title: 'Mở ứng dụng ngân hàng',
    desc: 'Mở ứng dụng ngân hàng hoặc ví điện tử đã liên kết của bạn.',
  },
  {
    id: 'scan',
    stepNumber: 2,
    icon: 'scan',
    title: 'Quét mã QR',
    desc: 'Chọn tính năng quét mã QR và quét mã bên cạnh.',
  },
  {
    id: 'confirm',
    stepNumber: 3,
    icon: 'card',
    title: 'Xác nhận thanh toán',
    desc: 'Kiểm tra thông tin và xác nhận thanh toán.',
  },
  {
    id: 'success',
    stepNumber: 4,
    icon: 'success',
    title: 'Thanh toán thành công',
    desc: 'Đơn hàng sẽ được xác nhận ngay sau khi thanh toán.',
  },
];

export const SUPPORTED_QR_BANKS: SupportedBank[] = [
  { id: 'vcb', name: 'Vietcombank' },
  { id: 'bidv', name: 'BIDV' },
  { id: 'vietinbank', name: 'VietinBank' },
  { id: 'mb', name: 'MB' },
  { id: 'momo', name: 'Momo' },
  { id: 'zalopay', name: 'ZaloPay' },
];

export type { QRPaymentStep, SupportedBank } from './typing';
