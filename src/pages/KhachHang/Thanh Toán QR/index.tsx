import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { Button, Typography } from 'antd';
import { ArrowLeft, Clock3, Headphones, ShieldCheck } from 'lucide-react';
import { OrderStatus, PaymentMethod } from '@/services/KhachHang/Đơn Hàng';
import { buildVietQrUrl, QR_PAYMENT_STEPS, SUPPORTED_QR_BANKS } from '@/services/KhachHang/Thanh toán QR';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { formatDateTimeViVN } from '@/utils/format';
import { showCustomerNotification } from '@/utils/notification';
import PaymentStep from './component/PaymentStep';
import BankLogo from './component/BankLogo';
import './index.less';

const QRPaymentPage: React.FC = () => {
  const { setPage } = useModel('KhachHang.GlobalState.index');
  const { orders, cancelOrder, fetchOrders } = useModel('KhachHang.Đơn Hàng.Orders');
  const { addNotification } = useModel('KhachHang.Thông Báo.index');
  const expiredOrderIdRef = useRef<string | null>(null);
  const paidOrderIdRef = useRef<string | null>(null);
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
      order.payment === PaymentMethod.QR
      && order.status === OrderStatus.Pending
      && order.paymentStatus !== 'paid'
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

  useEffect(() => {
    if (!paymentOrder || isExpired) return undefined;

    let stopped = false;

    const checkPaymentStatus = async () => {
      try {
        const res = await axios.get(`${ip3}/orders/${paymentOrder.id}`);
        const payments = Array.isArray(res.data?.payments) ? res.data.payments : [];
        const isPaid = payments.some((payment: any) => payment.status === 'paid');

        if (!isPaid || stopped || paidOrderIdRef.current === paymentOrder.id) return;

        paidOrderIdRef.current = paymentOrder.id;
        clearPendingOrder();
        await fetchOrders?.(true);

        addNotification({
          id: `payment-${paymentOrder.id}-${Date.now()}`,
          title: 'Thanh toán thành công',
          message: `Đơn hàng ${paymentOrder.id} đã được xác nhận chuyển khoản.`,
          time: formatDateTimeViVN(),
          isRead: false,
          image: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
        });

        showCustomerNotification(
          'Thanh toán thành công',
          `Đơn hàng ${paymentOrder.id} đã được xác nhận và chuyển sang trạng thái đã đặt.`,
          'success'
        );

        setPage('history');
      } catch (error) {
        console.error('Không thể kiểm tra trạng thái thanh toán QR:', error);
      }
    };

    checkPaymentStatus();
    const intervalId = window.setInterval(checkPaymentStatus, 3000);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, [addNotification, clearPendingOrder, fetchOrders, isExpired, paymentOrder, setPage]);

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
        <Button type="text" className="qr-back-button" onClick={() => setPage('history')} aria-label="Quay lại đơn hàng" icon={<ArrowLeft size={28} />} />
        <div className="qr-empty-state">
          <Typography.Title level={1} style={{ margin: 0 }}>Không có giao dịch QR đang chờ</Typography.Title>
          <Typography.Paragraph>Hãy chọn thanh toán QR khi đặt món để tạo mã thanh toán mới.</Typography.Paragraph>
          <Button onClick={() => setPage('menu')} type="primary">Quay lại thực đơn</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-payment-page">
      <div className="qr-payment-header">
        <Button type="text" className="qr-back-button" onClick={goBackToOrders} aria-label="Quay lại đơn hàng" icon={<ArrowLeft size={28} />} />

        <div className="qr-title-block">
          <Typography.Title level={1} style={{ margin: 0, color: 'inherit' }}>Thanh toán bằng mã QR</Typography.Title>
          <Typography.Paragraph style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={18} />
            Thanh toán an toàn & bảo mật
          </Typography.Paragraph>
        </div>
      </div>

      <section className="qr-payment-grid">
        <div className="qr-card qr-code-card">
          <div className="qr-card-heading">
            <Typography.Title level={2} style={{ margin: '0 0 6px', color: 'inherit' }}>Quét mã QR để thanh toán</Typography.Title>
            <Typography.Paragraph style={{ margin: 0, color: '#666' }}>
              Mã đơn hàng: <Typography.Text strong>#{paymentOrder.id}</Typography.Text>
            </Typography.Paragraph>
          </div>

          <div className="qr-code-wrap">
            <div className="qr-code-frame">
              <img src={vietQrImageUrl} alt={`VietQR thanh toán đơn ${paymentOrder.id}`} className="vietqr-image" />
            </div>
          </div>

          <div className="qr-bank-detail">
            <div>
              <Typography.Text>Ngân hàng</Typography.Text>
              <Typography.Text strong>{bankInfo.bankId.toUpperCase()}</Typography.Text>
            </div>
            <div>
              <Typography.Text>Số tài khoản</Typography.Text>
              <Typography.Text strong>{bankInfo.accountNo}</Typography.Text>
            </div>
            <div>
              <Typography.Text>Chủ tài khoản</Typography.Text>
              <Typography.Text strong>{bankInfo.accountName}</Typography.Text>
            </div>
            <div>
              <Typography.Text>Nội dung</Typography.Text>
              <Typography.Text strong>{transferDescription}</Typography.Text>
            </div>
          </div>

          <div className="qr-amount-block">
            <Typography.Paragraph style={{ margin: 0 }}>Số tiền thanh toán</Typography.Paragraph>
            <Typography.Text strong style={{ fontSize: 28, color: '#18783e', display: 'block', marginBottom: 12 }}>{formattedAmount}</Typography.Text>

            <Typography.Text className="qr-timer-label">
              <Clock3 size={18} />
              Thời gian còn lại
            </Typography.Text>
            <Typography.Text strong className={isExpired ? 'expired' : ''} style={{ fontSize: 20 }}>{formattedCountdown}</Typography.Text>
          </div>

          {isExpired && (
            <div className="qr-alert expired">
              Giao dịch đã hết hạn. Vui lòng hủy và đặt lại thanh toán.
            </div>
          )}
        </div>

        <div className="qr-card qr-guide-card">
          <Typography.Title level={2} style={{ margin: '0 0 16px', fontSize: 18 }}>Hướng dẫn thanh toán</Typography.Title>

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
            <Typography.Paragraph style={{ marginBottom: 12, color: '#666' }}>Hỗ trợ thanh toán từ các ngân hàng và ví điện tử</Typography.Paragraph>
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
            <Typography.Title level={3} style={{ margin: '0 0 4px', fontSize: 16 }}>Cần hỗ trợ?</Typography.Title>
            <Typography.Paragraph style={{ margin: 0, color: '#666' }}>Liên hệ hỗ trợ 24/7</Typography.Paragraph>
          </div>
        </div>

        <div className="support-actions">
          <Button onClick={cancelPayment} danger type="primary">Hủy thanh toán</Button>
          <Typography.Paragraph style={{ margin: '8px 0 0', color: '#666', fontSize: 13 }}>Giao dịch sẽ hết hạn sau {formattedCountdown}</Typography.Paragraph>
        </div>
      </section>
    </div>
  );
};

export default QRPaymentPage;
