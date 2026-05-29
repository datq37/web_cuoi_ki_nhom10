import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Clock3, Headphones, ShieldCheck } from 'lucide-react';
import { OrderStatus, PaymentMethod } from '@/services/Khách hàng/Đơn Hàng';
import { QR_PAYMENT_STEPS, SUPPORTED_QR_BANKS } from '@/services/Khách hàng/Thanh toán QR';
import PaymentStep from './component/PaymentStep';
import BankLogo from './component/BankLogo';
import './index.less';

const LOGO_SRC = '/logo.webp';

const QRPaymentPage: React.FC = () => {
  const { setPage } = useModel('Khách Hàng.GlobalState.index');
  const { orders } = useModel('Khách Hàng.Đơn Hàng.Orders');
  const {
    pendingOrder,
    setPendingOrder,
    clearPendingOrder,
    formattedAmount,
    formattedCountdown,
    paymentPayload,
    isExpired,
  } = useModel('Khách Hàng.Thanh toán QR.index');

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
  const qrValue = paymentPayload || (paymentOrder ? `CANTEEN_PAYMENT_ORDER_${paymentOrder.id}_AMOUNT_${paymentOrder.total}` : '');

  const goBackToOrders = () => {
    setPage('history');
  };

  const cancelPayment = () => {
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
              <QRCodeCanvas
                value={qrValue}
                size={180}
                bgColor="#ffffff"
                fgColor="#111111"
                level="H"
                includeMargin={false}
              />

              <div className="qr-logo-mark" aria-hidden="true">
                <img src={LOGO_SRC} alt="" />
              </div>
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

          <div className={`qr-alert ${isExpired ? 'expired' : ''}`}>
            {isExpired
              ? 'Giao dịch đã hết hạn. Vui lòng hủy và đặt lại thanh toán.'
              : 'Đơn hàng sẽ được xác nhận ngay sau khi thanh toán thành công.'}
          </div>
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
