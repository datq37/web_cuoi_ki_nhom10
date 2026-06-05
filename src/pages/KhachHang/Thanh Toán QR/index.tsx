import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { ArrowLeft, Clock3, Headphones, ShieldCheck } from 'lucide-react';
import { OrderStatus, PaymentMethod } from '@/services/KhachHang/Đơn Hàng';
import { buildVietQrUrl, QR_PAYMENT_STEPS, SUPPORTED_QR_BANKS } from '@/services/KhachHang/Thanh toán QR';
import PaymentStep from './component/PaymentStep';
import BankLogo from './component/BankLogo';
import './index.less';

const QRPaymentPage: React.FC = () => {
  const { setPage } = useModel('KhachHang.GlobalState.index');
  const { orders, cancelOrder } = useModel('KhachHang.Đơn Hàng.Orders');
  const expiredOrderIdRef = useRef<string | null>(null);
  const {
    pendingOrder,
    setPendingOrder,
    clearPendingOrder,
    formattedAmount,
    formattedCountdown,
    paymentPayload,
    paymentDescription,
    bankInfo,
    isExpired,
  } = useModel('KhachHang.Thanh toán QR.index');

  const fallbackOrder = useMemo(
    () => orders.find((order: any) => (
      order.payment === PaymentMethod.QR && order.status === OrderStatus.Pending
    )),
    [orders],
  );

  useEffect(() => {
    if (!pendingOrder && fallbackOrder) {
      setPendingOrder(fallbackOrder);
    }
  }, [fallbackOrder, pendingOrder, setPendingOrder]);

  const paymentOrder = pendingOrder || fallbackOrder || null;
  const vietQrImageUrl = paymentPayload || (paymentOrder ? buildVietQrUrl(paymentOrder.total, paymentOrder.id) : '');
  const transferDescription = paymentDescription || (paymentOrder ? `DH${paymentOrder.id}` : '');

  useEffect(() => {
    if (!paymentOrder || !isExpired || expiredOrderIdRef.current === paymentOrder.id) return;

    expiredOrderIdRef.current = paymentOrder.id;
    cancelOrder(paymentOrder.id);
    clearPendingOrder();
    setPage('history');
  }, [cancelOrder, clearPendingOrder, isExpired, paymentOrder, setPage]);

  const goBackToOrders = () => {
    setPage('history');
  };

  const cancelPayment = () => {
    if (paymentOrder) {
      cancelOrder(paymentOrder.id);
    }
    clearPendingOrder();
    setPage('history');
  };

  if (!paymentOrder) {
    return (
      <div className="qr-payment-page empty">
        <button className="qr-back-button" onClick={() => setPage('history')} aria-label="Quay lại đơn hàng">
          <ArrowLeft size={28} />
        </button>
        <div className="qr-empty-state">
          <h1>Không có giao dịch QR đang chờ</h1>
          <p>Hãy chọn thanh toán QR khi đặt món để tạo mã thanh toán mới.</p>
          <button onClick={() => setPage('menu')}>Quay lại thực đơn</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-payment-page">
      <div className="qr-payment-header">
        <button className="qr-back-button" onClick={goBackToOrders} aria-label="Quay lại đơn hàng">
          <ArrowLeft size={28} />
        </button>

        <div className="qr-title-block">
          <h1>Thanh toán bằng mã QR</h1>
          <p>
            <ShieldCheck size={18} />
            Thanh toán an toàn & bảo mật
          </p>
        </div>
      </div>

      <section className="qr-payment-grid">
        <div className="qr-card qr-code-card">
          <div className="qr-card-heading">
            <h2>Quét mã QR để thanh toán</h2>
            <p>
              Mã đơn hàng: <strong>#{paymentOrder.id}</strong>
            </p>
          </div>

          <div className="qr-code-wrap">
            <div className="qr-code-frame">
              <img src={vietQrImageUrl} alt={`VietQR thanh toán đơn ${paymentOrder.id}`} className="vietqr-image" />
            </div>
          </div>

          <div className="qr-bank-detail">
            <div>
              <span>Ngân hàng</span>
              <strong>{bankInfo.bankId.toUpperCase()}</strong>
            </div>
            <div>
              <span>Số tài khoản</span>
              <strong>{bankInfo.accountNo}</strong>
            </div>
            <div>
              <span>Chủ tài khoản</span>
              <strong>{bankInfo.accountName}</strong>
            </div>
            <div>
              <span>Nội dung</span>
              <strong>{transferDescription}</strong>
            </div>
          </div>

          <div className="qr-amount-block">
            <p>Số tiền thanh toán</p>
            <strong>{formattedAmount}</strong>

            <span className="qr-timer-label">
              <Clock3 size={18} />
              Thời gian còn lại
            </span>
            <b className={isExpired ? 'expired' : ''}>{formattedCountdown}</b>
          </div>

          {isExpired && (
            <div className="qr-alert expired">
              Giao dịch đã hết hạn. Vui lòng hủy và đặt lại thanh toán.
            </div>
          )}
        </div>

        <div className="qr-card qr-guide-card">
          <h2>Hướng dẫn thanh toán</h2>

          <div className="qr-step-list">
            {QR_PAYMENT_STEPS.map((step, index) => (
              <PaymentStep
                key={step.id}
                step={step}
                last={index === QR_PAYMENT_STEPS.length - 1}
              />
            ))}
          </div>

          <div className="qr-bank-section">
            <p>Hỗ trợ thanh toán từ các ngân hàng và ví điện tử</p>
            <div className="qr-bank-grid">
              {SUPPORTED_QR_BANKS.map(bank => (
                <BankLogo key={bank.id} bank={bank} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="qr-support-bar">
        <div className="support-info">
          <div className="support-icon">
            <Headphones size={30} />
          </div>
          <div>
            <h3>Cần hỗ trợ?</h3>
            <p>Liên hệ hỗ trợ 24/7</p>
          </div>
        </div>

        <div className="support-actions">
          <button onClick={cancelPayment}>Hủy thanh toán</button>
          <p>Giao dịch sẽ hết hạn sau {formattedCountdown}</p>
        </div>
      </section>
    </div>
  );
};

export default QRPaymentPage;
