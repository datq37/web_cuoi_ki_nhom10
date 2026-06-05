import type { QRPaymentStep, SupportedBank } from './typing';

export const QR_PAYMENT_EXPIRE_SECONDS = 10 * 60;

export const VIETQR_CONFIG = {
  bankId: 'bidv',
  accountNo: '8832859169',
  accountName: 'NGUYEN QUANG DAT',
  template: 'compact2',
};

export function buildVietQrUrl(amount: number, orderId: string | number): string {
  const safeAmount = Math.max(0, Math.round(Number(amount) || 0));
  const addInfo = `DH${orderId}`;
  const { bankId, accountNo, accountName, template } = VIETQR_CONFIG;

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png`
    + `?amount=${safeAmount}`
    + `&addInfo=${encodeURIComponent(addInfo)}`
    + `&accountName=${encodeURIComponent(accountName)}`;
}

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
    desc: 'Kiểm tra đúng số tiền, số tài khoản và nội dung chuyển khoản.',
  },
  {
    id: 'success',
    stepNumber: 4,
    icon: 'success',
    title: 'Thanh toán thành công',
    desc: 'Admin sẽ kiểm tra giao dịch và xác nhận đơn hàng.',
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
